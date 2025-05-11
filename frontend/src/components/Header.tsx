import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Image } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useDisconnect, useBalance, useConnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { FormatUtils } from '@utils/FormatUtils';
import logo from '@assets/images/logo.svg';

export const Header: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  const { data: balance } = useBalance({
    address,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    },
  });

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrolledDown = prevScrollPos < currentScrollPos;

      setVisible(
        currentScrollPos < 10 || // Always show at top
          (!isScrolledDown && currentScrollPos > 100), // Show when scrolling up
      );
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const connectWallet = async () => {
    try {
      connect({ connector: metaMask() });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      style={{
        transition: 'transform 0.3s ease-in-out',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Image src={logo} alt="MyNFT Marketplace" height="30" className="me-2" />
          MyNFT Marketplace
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/explore" active={isActive('/explore')}>
              Explore
            </Nav.Link>
            <Nav.Link as={Link} to="/create" active={isActive('/create')}>
              Create
            </Nav.Link>
            <Nav.Link as={Link} to="/my-nft" active={isActive('/my-nft')}>
              My NFT
            </Nav.Link>
          </Nav>

          <Nav>
            {isConnected ? (
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-wallet">
                  {FormatUtils.shortenAddress(address)} |{' '}
                  {FormatUtils.formatEthBalance(balance?.value)} ETH
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={disconnectWallet}>Disconnect</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button variant="primary" onClick={connectWallet} disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
