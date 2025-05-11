import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { WalletConnectPrompt } from '@components/WalletConnectPrompt';
import { MintForm } from '@components/MintForm';

export const MintPage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | Create NFT';
  }, []);

  return (
    <Container>
      <WalletConnectPrompt>
        <MintForm />
      </WalletConnectPrompt>
    </Container>
  );
};
