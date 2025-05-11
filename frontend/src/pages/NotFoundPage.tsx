import React, { useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EmojiFrown, HouseDoor, Search, ArrowLeft } from 'react-bootstrap-icons';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | 404';
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <Row className="justify-content-center text-center">
        <Col xs={12} className="mb-4">
          <div className="text-primary mb-3">
            <EmojiFrown size={80} />
          </div>
          <h1 className="display-3 fw-bold mb-3">404</h1>
          <h2 className="h3 text-muted mb-4">Oops! Page not found</h2>
          <p className="lead mb-4">The page you're looking for doesn't exist or has been moved.</p>
        </Col>

        <Col xs={12} md={8} lg={6}>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button
              as={Link}
              to="/"
              variant="primary"
              size="lg"
              className="d-flex align-items-center gap-2"
            >
              <HouseDoor size={20} />
              Go Home
            </Button>

            <Button
              as={Link}
              to="/explore"
              variant="outline-primary"
              size="lg"
              className="d-flex align-items-center gap-2"
            >
              <Search size={20} />
              Explore NFTs
            </Button>

            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => window.history.back()}
              className="d-flex align-items-center gap-2"
            >
              <ArrowLeft size={20} />
              Go Back
            </Button>
          </div>
        </Col>
      </Row>

      {/* Optional: Add search or helpful links */}
      <Row className="mt-5 text-center">
        <Col>
          <p className="text-muted">Try searching or check out these popular pages:</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link to="/create" className="btn btn-sm btn-outline-secondary">
              Create NFT
            </Link>
            <Link to="/explore" className="btn btn-sm btn-outline-secondary">
              Marketplace
            </Link>
            <Link to="/faq" className="btn btn-sm btn-outline-secondary">
              FAQ
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
