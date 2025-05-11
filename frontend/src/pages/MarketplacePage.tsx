import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { WalletConnectPrompt } from '@components/WalletConnectPrompt';
import { TokenCardsPagination } from '@components/TokenCardsPagination';
import { useMarketplaceTokens } from '@hooks/useMarketplaceTokens';

export const MarketplacePage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | Explore NFTs';
  }, []);

  const { tokens, isLoading, isError, error } = useMarketplaceTokens();

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">NFT Marketplace</h1>
          <p className="text-muted">Discover unique digital assets</p>
        </Col>
      </Row>

      <WalletConnectPrompt>
        <TokenCardsPagination
          tokens={tokens.slice(0, 12)}
          isLoading={isLoading}
          isError={isError}
          error={error}
          itemsPerPage={12}
        />
      </WalletConnectPrompt>
    </Container>
  );
};
