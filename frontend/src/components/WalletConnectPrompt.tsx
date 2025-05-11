import React from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { WalletFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
import { useAccount, useConnect } from 'wagmi';

interface WalletConnectPromptProps {
  children: React.ReactNode;
  customMessage?: string;
  customTitle?: string;
}

export const WalletConnectPrompt: React.FC<WalletConnectPromptProps> = ({
  children,
  customMessage = 'To interact with this page, you need to connect a crypto wallet.',
  customTitle = 'A wallet connection is required',
}) => {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  if (isConnected) return <>{children}</>;

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <WalletFill size={48} className="text-primary mb-3" />
              <h3>{customTitle}</h3>
            </div>

            <Alert variant="warning" className="d-flex align-items-start">
              <ExclamationTriangleFill className="me-2 mt-1 flex-shrink-0" />
              <div>
                <Alert.Heading>Attention</Alert.Heading>
                <p>{customMessage} We support MetaMask.</p>
              </div>
            </Alert>

            <div className="mt-4">
              <h5 className="mb-3">Available Providers:</h5>
              <div className="d-grid gap-2">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    variant="outline-primary"
                    size="lg"
                    className="d-flex align-items-center justify-content-center"
                  >
                    Connect {connector.name}
                  </Button>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
