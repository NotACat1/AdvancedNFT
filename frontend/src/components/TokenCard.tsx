import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Spinner,
  Badge,
  Tooltip,
  OverlayTrigger,
  Modal,
  Form,
} from 'react-bootstrap';
import { useTokenDetails } from '@hooks/useTokenDetails';
import { useTokenUri } from '@hooks/useTokenUri';
import { usePinata } from '@hooks/usePinata';
import { useIsCardOwner } from '@hooks/useIsCardOwner';
import { useDelist } from '@hooks/useDelist';
import { useListForSale } from '@hooks/useListForSale';
import { useBuyNFT } from '@hooks/useBuyNFT';
import { FormatUtils } from '@utils/FormatUtils';
import { INFTMetadata } from '@type/INFTMetadata';

interface TokenCardProps {
  tokenId: bigint;
  className?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({ tokenId, className = '' }) => {
  const {
    tokenData,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: detailsError,
  } = useTokenDetails(tokenId);
  const {
    token,
    isLoading: isLoadingUri,
    isError: isErrorUri,
    error: uriError,
  } = useTokenUri(tokenId);
  const {
    isOwner,
    isLoading: isLoadingOwner,
    isError: isErrorOwner,
    error: ownerError,
  } = useIsCardOwner(tokenId);
  const { delist, isError: isErrorDelist, error: delistError } = useDelist();
  const { list, isError: isErrorListForSale, error: listForSaleError } = useListForSale();
  const { buy } = useBuyNFT();
  const { fetchFromIpfs, getIpfsUrl } = usePinata();

  const [metadata, setMetadata] = useState<INFTMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    price: '',
  });

  // Объединяем все возможные ошибки
  const combinedError =
    error || detailsError || uriError || ownerError || delistError || listForSaleError;
  const hasError =
    isErrorDetails || isErrorUri || isErrorOwner || isErrorDelist || isErrorListForSale || !!error;

  useEffect(() => {
    const loadMetadata = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await fetchFromIpfs(token);
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch NFT metadata');
        }

        const nftData = result.data as INFTMetadata;

        if (nftData.image?.startsWith('ipfs://')) {
          nftData.image = getIpfsUrl(nftData.image.replace('ipfs://', ''));
        } else if (!nftData.image?.startsWith('http')) {
          nftData.image = getIpfsUrl(nftData.image);
        }

        setMetadata(nftData);
        setEditForm({
          price: tokenData?.price ? FormatUtils.formatEthBalance(tokenData.price) : '',
        });
      } catch (err) {
        console.error('Error loading NFT metadata:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [token]);

  const handleActionClick = () => {
    if (isOwner) {
      if (tokenData?.isForSale) {
        delist(tokenId);
      } else {
        setShowEditModal(true);
      }
    } else {
      if (tokenData) {
        buy(tokenId, tokenData.price);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await list(tokenId, FormatUtils.parseEthToWei(editForm.price));
    setShowEditModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoadingDetails || isLoadingUri || isLoading || isLoadingOwner || !tokenData) {
    return (
      <Card className={`h-100 ${className}`}>
        <Card.Body
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '300px' }}
        >
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    );
  }

  if (hasError || !metadata) {
    return (
      <Card className={`h-100 ${className}`}>
        <Card.Body
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{ minHeight: '300px' }}
        >
          <span className="text-danger mb-2">⚠️ Error loading NFT</span>
          {combinedError && (
            <div className="text-danger small mb-2">{combinedError.toString()}</div>
          )}
          <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const renderTooltip = (text: string) => <Tooltip id={`tooltip-${tokenId}`}>{text}</Tooltip>;

  const actionButtonText = isOwner
    ? tokenData.isForSale
      ? 'Remove from Sale'
      : 'Edit & Sell'
    : 'Buy Now';

  return (
    <>
      <Card className={`h-100 shadow-sm ${className}`}>
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={metadata.image}
            alt={metadata.name}
            style={{
              height: '200px',
              objectFit: 'cover',
              background: '#f8f9fa',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-nft.png';
            }}
          />
          {tokenData.isForSale && (
            <Badge bg="success" className="position-absolute top-0 end-0 m-2">
              For Sale
            </Badge>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <OverlayTrigger placement="top" overlay={renderTooltip(metadata.name)}>
              <Card.Title className="mb-1 text-truncate" style={{ maxWidth: '70%' }}>
                {metadata.name}
              </Card.Title>
            </OverlayTrigger>
            <Badge bg="secondary">#{tokenId.toString()}</Badge>
          </div>

          {metadata.description && (
            <OverlayTrigger placement="top" overlay={renderTooltip(metadata.description)}>
              <Card.Text className="text-muted small mb-3 text-truncate">
                {metadata.description}
              </Card.Text>
            </OverlayTrigger>
          )}

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Creator:</small>
              <OverlayTrigger placement="left" overlay={renderTooltip(tokenData.creator)}>
                <small className="text-truncate font-monospace" style={{ maxWidth: '120px' }}>
                  {FormatUtils.shortenAddress(tokenData.creator)}
                </small>
              </OverlayTrigger>
            </div>

            {tokenData.price > 0 && (
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Price:</small>
                <div className="d-flex align-items-center">
                  <strong>{FormatUtils.formatEthBalance(tokenData.price)} ETH</strong>
                </div>
              </div>
            )}
          </div>
        </Card.Body>

        <Card.Footer className="bg-transparent border-top-0 pt-0">
          <Button
            variant={isOwner ? (tokenData.isForSale ? 'danger' : 'primary') : 'primary'}
            className="w-100"
            onClick={handleActionClick}
          >
            {actionButtonText}
          </Button>
        </Card.Footer>
      </Card>

      {/* Модальное окно редактирования */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit NFT #{tokenId.toString()}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Price (ETH)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={editForm.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {tokenData.isForSale ? 'Update Listing' : 'List for Sale'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
