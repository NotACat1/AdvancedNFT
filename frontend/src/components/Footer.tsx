import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Github, EnvelopeFill, HeartFill } from 'react-bootstrap-icons';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="text-white">About MyNFT</h5>
            <p className="text-light">
              The premier marketplace for unique digital collectibles and NFTs. Built with{' '}
              <HeartFill color="red" /> on Ethereum.
            </p>
          </Col>

          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-white">Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/explore"
                className="text-light p-0 mb-1"
                active={isActive('/explore')}
              >
                Explore
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/create"
                className="text-light p-0 mb-1"
                active={isActive('/create')}
              >
                Create
              </Nav.Link>
              <Nav.Link as={Link} to="/faq" className="text-light p-0" active={isActive('/faq')}>
                FAQ
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-white">Legal</h5>
            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/terms"
                className="text-light p-0 mb-1"
                active={isActive('/terms')}
              >
                Terms
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/privacy"
                className="text-light p-0 mb-1"
                active={isActive('/privacy')}
              >
                Privacy
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/license"
                className="text-light p-0"
                active={isActive('/license')}
              >
                License
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={4}>
            <h5 className="text-white">Connect With Us</h5>
            <div className="d-flex gap-3 mb-3">
              <a
                href="https://github.com/NotACat1"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={24} />
              </a>
              <a
                href="mailto:notacat.mail@gmail.com"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <EnvelopeFill size={24} />
              </a>
            </div>
            <p className="text-light mb-0">
              © {currentYear} MyNFT Marketplace. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
