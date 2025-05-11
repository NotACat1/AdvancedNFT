import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ContractStatistics } from '@components/ContractStatistics';
import { TokenCardsPagination } from '@components/TokenCardsPagination';
import { WalletConnectPrompt } from '@components/WalletConnectPrompt';
import { useMarketplaceTokens } from '@hooks/useMarketplaceTokens';
import placeholder from '@assets/images/placeholder.jpeg';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | Home';
  }, []);

  const { tokens, isLoading, isError, error } = useMarketplaceTokens();

  return (
    <Container>
      {/* Hero Section */}
      <Row className="align-items-center mb-5 py-5">
        <Col md={6}>
          <h1 className="display-4 fw-bold mb-3">
            Discover, Collect & Sell <span className="text-primary">Extraordinary NFTs</span>
          </h1>
          <p className="lead mb-4">
            The world's largest digital marketplace for crypto collectibles and non-fungible tokens
          </p>
          <div className="d-flex gap-3">
            <Button variant="primary" size="lg" as={Link} to="/explore">
              Explore
            </Button>
            <Button variant="outline-primary" size="lg" as={Link} to="/create">
              Create
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <img src={placeholder} alt="NFT Art" className="img-fluid rounded-3 shadow" />
        </Col>
      </Row>

      {/* Stats Section */}
      <ContractStatistics />

      {/* Featured NFTs */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold">Featured NFTs</h2>
        <Button variant="outline-primary" as={Link} to="/explore">
          View All
        </Button>
      </div>

      <WalletConnectPrompt>
        <TokenCardsPagination
          tokens={tokens.slice(0, 12)}
          isLoading={isLoading}
          isError={isError}
          error={error}
          itemsPerPage={12}
        />
      </WalletConnectPrompt>

      {/* CTA Section */}
      <Row className="bg-primary rounded-3 p-5 text-white mb-4">
        <Col md={8}>
          <h2 className="fw-bold">Ready to join our NFT marketplace?</h2>
          <p className="mb-0">
            Create and sell your own NFTs or discover amazing digital artworks from talented artists
            around the world.
          </p>
        </Col>
        <Col md={4} className="d-flex align-items-center justify-content-end">
          <Button variant="light" size="lg" className="px-4" as={Link} to="/explore">
            Get Started
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
