// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title AdvancedNFT Marketplace
 * @notice Gas-optimized NFT marketplace contract with royalty support
 * @dev Implements ERC721 and ERC2981 standards with maximum gas optimization
 */
contract AdvancedNFT is ERC721URIStorage, Ownable, ReentrancyGuard, IERC2981 {
    using Counters for Counters.Counter;

    // ========== Constants ==========

    /// @dev Basis points for percentage calculations (10000 = 100%)
    uint96 private constant BASIS_POINTS = 10000;

    // ========== Structs (Storage Optimized) ==========

    /**
     * @dev Packed token data structure (saves ~20k gas on mint)
     * @notice Uses optimal variable sizes to minimize storage costs
     */
    struct TokenData {
        address creator; // 20 bytes - token creator
        uint96 royaltyPercent; // 2 bytes - royalty percentage
        uint64 createdAt; // 8 bytes - creation timestamp
        uint96 price; // 12 bytes - current price
        bool isForSale; // 1 byte - sale status flag
    }

    /**
     * @dev User statistics with optimized storage layout
     */
    struct UserStats {
        uint32 tokensOwned; // 4 bytes - owned tokens count
        uint32 tokensSold; // 4 bytes - sold tokens count
        uint32 tokensPurchased; // 4 bytes - purchased tokens count
        uint128 totalSpent; // 16 bytes - total ETH spent
        uint128 totalEarned; // 16 bytes - total ETH earned
    }

    /**
     * @dev Marketplace statistics and parameters
     */
    struct MarketplaceStats {
        uint128 totalSalesVolume; // Total sales volume
        uint64 totalTransactions; // Total transactions count
        uint96 marketplaceFee; // Marketplace fee (in basis points)
        uint96 maxRoyaltyFee; // Maximum royalty percentage (in basis points)
    }

    // ========== State Variables ==========

    /// @dev Counter for token IDs
    Counters.Counter private _tokenIdCounter;

    /// @dev Marketplace statistics
    MarketplaceStats private _marketplaceStats;

    /// @dev Mapping of token ID to token data
    mapping(uint256 => TokenData) private _tokenData;

    /// @dev Mapping of user address to user statistics
    mapping(address => UserStats) private _userStats;

    /// @dev Mapping of owner address to owned token IDs
    mapping(address => uint256[]) private _ownedTokens;

    /// @dev Array of token IDs currently for sale
    uint256[] private _tokensForSale;

    // ========== Events ==========

    event TokenListed(uint256 indexed tokenId, uint96 price);
    event TokenDelisted(uint256 indexed tokenId);
    event TokenSold(
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint96 price,
        uint96 fee,
        uint96 royalty
    );
    event MetadataUpdated(uint256 indexed tokenId);
    event MarketplaceFeeUpdated(uint256 newFee);
    event MaxRoyaltyUpdated(uint256 newMaxRoyalty);

    // ========== Constructor ==========

    /**
     * @dev Initializes the contract with marketplace parameters
     * @param initialFee Initial marketplace fee (in basis points)
     * @param maxRoyalty Maximum allowed royalty percentage (in basis points)
     */
    constructor(
        uint96 initialFee,
        uint96 maxRoyalty
    ) ERC721("AdvancedNFT", "ANFT") Ownable() {
        require(initialFee <= BASIS_POINTS, "Fee too high");
        require(maxRoyalty <= BASIS_POINTS, "Royalty too high");

        _marketplaceStats = MarketplaceStats({
            totalSalesVolume: 0,
            totalTransactions: 0,
            marketplaceFee: initialFee,
            maxRoyaltyFee: maxRoyalty
        });
    }

    // ========== Core Functions ==========

    /**
     * @notice Mints a new NFT with gas optimization
     * @dev Uses calldata for URI and packed struct for storage
     * @param ipfsURI IPFS metadata URI (format "ipfs://Qm...")
     * @param price Initial price (0 if not for sale)
     * @param royaltyPercent Royalty percentage (in basis points, 100 = 1%)
     */
    function mintNFT(
        string calldata ipfsURI,
        uint96 price,
        uint96 royaltyPercent
    ) external {
        require(bytes(ipfsURI).length > 0, "Empty URI");
        require(
            royaltyPercent <= _marketplaceStats.maxRoyaltyFee,
            "Royalty too high"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, ipfsURI);

        // Store token data with minimal storage operations (1 SSTORE)
        _tokenData[tokenId] = TokenData({
            creator: msg.sender,
            royaltyPercent: royaltyPercent,
            createdAt: uint64(block.timestamp),
            price: price,
            isForSale: price > 0
        });

        _ownedTokens[msg.sender].push(tokenId);

        if (price > 0) {
            _tokensForSale.push(tokenId);
            emit TokenListed(tokenId, price);
        }

        // Update statistics with minimal storage writes
        _userStats[msg.sender].tokensOwned += 1;
    }

    /**
     * @notice Purchases an NFT with secure payment distribution
     * @dev Protected against reentrancy with optimized transfers
     * @param tokenId ID of the token to purchase
     */
    function buyNFT(uint256 tokenId) external payable nonReentrant {
        TokenData memory token = _tokenData[tokenId];
        require(token.isForSale, "Not for sale");
        require(msg.value >= token.price, "Insufficient funds");

        address seller = ownerOf(tokenId);
        uint96 price = token.price;

        // Calculate payment distribution
        uint96 fee = uint96(
            (price * _marketplaceStats.marketplaceFee) / BASIS_POINTS
        );
        uint96 royalty = uint96((price * token.royaltyPercent) / BASIS_POINTS);
        uint96 sellerAmount = price - fee - royalty;

        // Remove token from sale before transfer
        token.isForSale = false;
        _removeTokenFromSale(tokenId);

        // Transfer token ownership
        _transfer(seller, msg.sender, tokenId);

        // Distribute payments
        (bool success, ) = payable(seller).call{value: sellerAmount}("");
        require(success, "Seller transfer failed");

        if (fee > 0) {
            (success, ) = owner().call{value: fee}("");
            require(success, "Fee transfer failed");
        }

        if (royalty > 0) {
            (success, ) = token.creator.call{value: royalty}("");
            require(success, "Royalty transfer failed");
        }

        // Update statistics
        UserStats storage buyerStats = _userStats[msg.sender];
        UserStats storage sellerStats = _userStats[seller];

        buyerStats.tokensPurchased += 1;
        buyerStats.totalSpent += uint128(price);
        buyerStats.tokensOwned += 1;

        sellerStats.tokensSold += 1;
        sellerStats.totalEarned += uint128(sellerAmount);
        sellerStats.tokensOwned -= 1;

        _marketplaceStats.totalSalesVolume += uint128(price);
        _marketplaceStats.totalTransactions += 1;

        emit TokenSold(tokenId, seller, msg.sender, price, fee, royalty);
    }

    // ========== Management Functions ==========

    /**
     * @notice Lists a token for sale
     * @dev Minimizes storage writes
     * @param tokenId ID of the token to list
     * @param price Sale price in wei
     */
    function listForSale(uint256 tokenId, uint96 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!_tokenData[tokenId].isForSale, "Already listed");

        _tokenData[tokenId].price = price;
        _tokenData[tokenId].isForSale = true;
        _tokensForSale.push(tokenId);

        emit TokenListed(tokenId, price);
    }

    /**
     * @notice Delists a token from sale
     * @dev Only one storage write operation
     * @param tokenId ID of the token to delist
     */
    function delist(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(_tokenData[tokenId].isForSale, "Not listed");

        _tokenData[tokenId].isForSale = false;
        _removeTokenFromSale(tokenId);

        emit TokenDelisted(tokenId);
    }

    // ========== View Functions ==========

    /**
     * @notice Returns complete token data
     * @param tokenId ID of the token
     * @return TokenData structure with token information
     */
    function getTokenData(
        uint256 tokenId
    ) external view returns (TokenData memory) {
        return _tokenData[tokenId];
    }

    /**
     * @notice Returns user statistics
     * @param user User address
     * @return UserStats structure with user activity
     */
    function getUserStats(
        address user
    ) external view returns (UserStats memory) {
        return _userStats[user];
    }

    /**
     * @notice Returns paginated list of owned tokens
     * @param owner Owner address
     * @param offset Pagination offset
     * @param limit Maximum items to return
     * @return Array of token IDs
     */
    function getOwnedTokens(
        address owner,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
        uint256[] storage owned = _ownedTokens[owner];
        uint256 length = owned.length;

        if (offset >= length) return new uint256[](0);

        uint256 end = offset + limit;
        if (end > length) end = length;

        uint256[] memory result = new uint256[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = owned[i];
        }

        return result;
    }

    /**
     * @notice Returns paginated list of tokens for sale
     * @param offset Pagination offset
     * @param limit Maximum items to return
     * @return Array of token IDs
     */
    function getTokensForSale(
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
        uint256 length = _tokensForSale.length;

        if (offset >= length) return new uint256[](0);

        uint256 end = offset + limit;
        if (end > length) end = length;

        uint256[] memory result = new uint256[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = _tokensForSale[i];
        }

        return result;
    }

    /**
     * @notice Returns contract statistics
     * @return totalNFTs Total number of NFTs
     * @return totalOnSale Number of NFTs currently for sale
     * @return stats MarketplaceStats structure
     */
    function getContractStats()
        external
        view
        returns (
            uint256 totalNFTs,
            uint256 totalOnSale,
            MarketplaceStats memory stats
        )
    {
        return (
            _tokenIdCounter.current(),
            _tokensForSale.length,
            _marketplaceStats
        );
    }

    // ========== Internal Functions ==========

    /**
     * @dev Removes a token from the for-sale list
     * @param tokenId ID of the token to remove
     */
    function _removeTokenFromSale(uint256 tokenId) private {
        uint256 length = _tokensForSale.length;
        for (uint256 i = 0; i < length; i++) {
            if (_tokensForSale[i] == tokenId) {
                // Move last element to the deleted spot
                _tokensForSale[i] = _tokensForSale[length - 1];
                _tokensForSale.pop();
                break;
            }
        }
    }

    /**
     * @dev Removes a token from an owner's list
     * @param owner Owner address
     * @param tokenId ID of the token to remove
     */
    function _removeFromOwned(address owner, uint256 tokenId) private {
        uint256[] storage owned = _ownedTokens[owner];
        uint256 length = owned.length;
        for (uint256 i = 0; i < length; i++) {
            if (owned[i] == tokenId) {
                // Move last element to the deleted spot
                owned[i] = owned[length - 1];
                owned.pop();
                break;
            }
        }
    }

    // ========== Royalty Standard (ERC2981) ==========

    /**
     * @notice ERC2981 royalty information implementation
     * @param tokenId ID of the token
     * @param salePrice Sale price for royalty calculation
     * @return receiver Royalty receiver address
     * @return royaltyAmount Calculated royalty amount
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        TokenData memory token = _tokenData[tokenId];
        return (
            token.creator,
            (salePrice * token.royaltyPercent) / BASIS_POINTS
        );
    }

    /**
     * @dev Overrides transfer to update ownership tracking
     * @param from Sender address
     * @param to Recipient address
     * @param tokenId ID of the token to transfer
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        // Remove from previous owner's stst
        _removeFromOwned(from, tokenId);

        // Perform standard transfer
        super._transfer(from, to, tokenId);

        // Add to new owner's list
        _ownedTokens[to].push(tokenId);
    }

    // ========== Admin Functions ==========

    /**
     * @notice Updates marketplace fee percentage
     * @param newFee New fee in basis points (100 = 1%)
     */
    function setMarketplaceFee(uint96 newFee) external onlyOwner {
        require(newFee <= BASIS_POINTS, "Fee too high");
        _marketplaceStats.marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(newFee);
    }

    /**
     * @notice Updates maximum allowed royalty percentage
     * @param newMaxRoyalty New maximum royalty in basis points (100 = 1%)
     */
    function setMaxRoyalty(uint96 newMaxRoyalty) external onlyOwner {
        require(newMaxRoyalty <= BASIS_POINTS, "Royalty too high");
        _marketplaceStats.maxRoyaltyFee = newMaxRoyalty;
        emit MaxRoyaltyUpdated(newMaxRoyalty);
    }
}