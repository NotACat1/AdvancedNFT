import React from 'react';
import { Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useMarketplaceTokens } from '@hooks/useMarketplaceTokens';
import { TokenCardsPagination } from '@components/TokenCardsPagination';
import { TokenCard } from '@components/TokenCard';

export const MarketplaceGrid: React.FC = () => {
  const { tokens, isLoading, isError, error } = useMarketplaceTokens();

  if (isError) {
    return (
      <>
        <Alert variant="danger">Error loading tokens: {error?.message}</Alert>
        <Button onClick={() => window.location.reload()} variant="primary">
          Try Again
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h2 className="mb-3 mb-md-0">NFT Marketplace</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading NFTs...</p>
        </div>
      ) : (
        <TokenCardsPagination
          tokens={tokens}
          isLoading={isLoading}
          isError={isError}
          error={error}
          itemsPerPage={12}
        />
      )}
    </>
  );
};
