import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import { UserStatistics } from '@components/UserStatistics';
import { WalletConnectPrompt } from '@components/WalletConnectPrompt';
import { TokenCardsPagination } from '@components/TokenCardsPagination';
import { useUserTokens } from '@hooks/useUserTokens';

export const ProfilePage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | My Collection';
  }, []);

  const { address } = useAccount();
  const { tokens, isLoading, isError, error } = useUserTokens(address);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">My NFT Collection</h1>
          <p className="text-muted">View and manage your digital assets</p>
        </Col>
      </Row>

      <WalletConnectPrompt>
        <UserStatistics />

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
