import React, { useState } from 'react';
import { Button, Card, Form, Spinner, Alert, Image } from 'react-bootstrap';
import { usePinata } from '@hooks/usePinata';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  created_by?: string;
}

export const NFTViewer: React.FC = () => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchFromIpfs, getIpfsUrl } = usePinata();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipfsHash.trim()) {
      setError('Please enter an IPFS hash');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setMetadata(null);

      const result = await fetchFromIpfs(ipfsHash);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch NFT data');
      }

      const nftData = result.data as NFTMetadata;

      // Преобразуем ipfs:// ссылку в доступный URL
      if (nftData.image?.startsWith('ipfs://')) {
        nftData.image = getIpfsUrl(nftData.image.replace('ipfs://', ''));
      }

      setMetadata(nftData);
    } catch (err) {
      console.error('Error fetching NFT:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nft-viewer-container p-4">
      <h2 className="mb-4">NFT Viewer</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="ipfsHash">
          <Form.Label>IPFS Hash of NFT Metadata</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Enter IPFS hash (e.g. QmXyZ...)"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              disabled={isLoading}
            />
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'View NFT'}
            </Button>
          </div>
          <Form.Text className="text-muted">
            Enter the IPFS hash of your NFT metadata JSON
          </Form.Text>
        </Form.Group>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {metadata && (
        <Card className="mt-4">
          <Card.Body>
            <div className="text-center mb-3">
              {metadata.image ? (
                <Image
                  src={metadata.image}
                  alt={metadata.name}
                  fluid
                  rounded
                  style={{ maxHeight: '400px' }}
                  className="mb-3"
                />
              ) : (
                <div className="bg-light p-5 text-muted">No image available</div>
              )}
            </div>

            <Card.Title>{metadata.name}</Card.Title>
            <Card.Text>{metadata.description}</Card.Text>

            {metadata.created_by && (
              <div className="mt-2">
                <small className="text-muted">Created by: {metadata.created_by}</small>
              </div>
            )}

            {metadata.attributes?.length > 0 && (
              <div className="mt-3">
                <h5>Attributes</h5>
                <div className="d-flex flex-wrap gap-2">
                  {metadata.attributes.map((attr, index) => (
                    <Card key={index} className="p-2">
                      <strong>{attr.trait_type}:</strong> {attr.value}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
