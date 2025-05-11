import React, { useEffect } from 'react';
import { Container, Accordion, ListGroup } from 'react-bootstrap';
import { ShieldLockFill } from 'react-bootstrap-icons';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | Privacy Policy';
  }, []);

  const privacySections = [
    {
      id: 'information-collected',
      title: '1. Information We Collect',
      content: (
        <div>
          <p>We collect the following types of information when you use our platform:</p>

          <h5 className="mt-3">Information You Provide</h5>
          <ul className="list-unstyled">
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>
                <strong>Wallet Address:</strong> Your public blockchain wallet address
              </span>
            </li>
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>
                <strong>Contact Information:</strong> Email address for account notifications
              </span>
            </li>
            <li className="d-flex">
              <span className="me-2">•</span>
              <span>
                <strong>Profile Data:</strong> Username, avatar, and other profile information
              </span>
            </li>
          </ul>

          <h5 className="mt-4">Automatically Collected Information</h5>
          <ul className="list-unstyled">
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>
                <strong>Usage Data:</strong> Pages visited, features used, and interaction metrics
              </span>
            </li>
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>
                <strong>Device Information:</strong> IP address, browser type, and operating system
              </span>
            </li>
            <li className="d-flex">
              <span className="me-2">•</span>
              <span>
                <strong>Transaction Data:</strong> On-chain transaction history and smart contract
                interactions
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'information-use',
      title: '2. How We Use Information',
      content: (
        <ListGroup variant="flush" className="border rounded">
          <ListGroup.Item className="d-flex align-items-start py-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
              <ShieldLockFill className="text-primary" />
            </div>
            <div>
              <h6 className="mb-1">Service Provision</h6>
              <p className="mb-0">To operate, maintain, and improve our platform's functionality</p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-start py-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
              <ShieldLockFill className="text-primary" />
            </div>
            <div>
              <h6 className="mb-1">Transaction Processing</h6>
              <p className="mb-0">To facilitate NFT purchases, sales, and transfers</p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-start py-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
              <ShieldLockFill className="text-primary" />
            </div>
            <div>
              <h6 className="mb-1">Security & Fraud Prevention</h6>
              <p className="mb-0">To detect and prevent fraudulent activity</p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-start py-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
              <ShieldLockFill className="text-primary" />
            </div>
            <div>
              <h6 className="mb-1">Legal Compliance</h6>
              <p className="mb-0">To comply with applicable laws and regulations</p>
            </div>
          </ListGroup.Item>
        </ListGroup>
      ),
    },
    {
      id: 'information-sharing',
      title: '3. Sharing of Information',
      content: (
        <div>
          <div className="alert alert-warning mb-4">
            <p className="mb-0">
              <strong>Blockchain Note:</strong> All NFT transactions are recorded on the public
              blockchain and cannot be deleted.
            </p>
          </div>

          <h5>We may share information with:</h5>
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">Service Providers</h6>
                  <p className="card-text">
                    Third parties who assist with platform operations (hosting, analytics, customer
                    support)
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">Legal Authorities</h6>
                  <p className="card-text">
                    When required by law or to protect our rights and safety
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">Business Transfers</h6>
                  <p className="card-text">
                    In connection with mergers, acquisitions, or asset sales
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">With Your Consent</h6>
                  <p className="card-text">When you explicitly authorize specific sharing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      title: '4. Security Measures',
      content: (
        <div>
          <h5>Our Security Practices</h5>
          <div className="row mt-3">
            <div className="col-md-4 mb-3">
              <div className="text-center p-3 border rounded h-100">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-2">
                  <ShieldLockFill size={24} className="text-primary" />
                </div>
                <h6>Encryption</h6>
                <p className="mb-0">Data in transit using TLS 1.2+ encryption</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-center p-3 border rounded h-100">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-2">
                  <ShieldLockFill size={24} className="text-primary" />
                </div>
                <h6>Access Controls</h6>
                <p className="mb-0">Strict employee access limitations</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-center p-3 border rounded h-100">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-2">
                  <ShieldLockFill size={24} className="text-primary" />
                </div>
                <h6>Regular Audits</h6>
                <p className="mb-0">Security assessments and penetration testing</p>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <h6>Your Responsibilities</h6>
            <p className="mb-0">
              While we implement robust security measures, you must protect your wallet credentials
              and enable all available security features (like two-factor authentication where
              available).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'your-rights',
      title: '5. Your Privacy Rights',
      content: (
        <div>
          <h5>Depending on your jurisdiction, you may have the right to:</h5>
          <Accordion defaultActiveKey="0" flush className="mt-3">
            <Accordion.Item eventKey="0" className="border-top-0 border-start-0 border-end-0">
              <Accordion.Header>Access Your Information</Accordion.Header>
              <Accordion.Body>Request a copy of personal data we hold about you</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Correct Inaccuracies</Accordion.Header>
              <Accordion.Body>
                Update or correct information that is incomplete or inaccurate
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Delete Your Data</Accordion.Header>
              <Accordion.Body>
                Request deletion of personal data, where permissible by law
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Opt-Out of Marketing</Accordion.Header>
              <Accordion.Body>
                Unsubscribe from promotional communications at any time
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="mt-4 p-3 bg-light rounded">
            <p className="mb-2">
              <strong>Note:</strong> Some rights may be limited due to our blockchain-based service
              model where certain data (like transaction history) is immutable and cannot be altered
              or deleted.
            </p>
            <p className="mb-0">
              To exercise these rights, please contact our Data Protection Officer.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Container className="py-4 privacy-page">
      <div className="d-flex flex-column flex-lg-row gap-4">
        {/* Main Content */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-4">
            <ShieldLockFill className="me-2 text-primary" size={28} />
            <div>
              <h1 className="mb-0">Privacy Policy</h1>
              <p className="text-muted mb-0">
                Last updated:{' '}
                {new Date('2025-06-20').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="alert alert-primary mb-4">
            <p className="mb-0">
              <strong>Transparency Matters:</strong> This policy explains how we collect, use, and
              protect your information in our decentralized NFT marketplace. By using our services,
              you acknowledge the unique privacy considerations of blockchain technology.
            </p>
          </div>

          {privacySections.map((section) => (
            <section key={section.id} id={section.id} className="mb-5 pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">{section.title}</h2>
              </div>
              <div className="border-start border-3 ps-3 border-primary">{section.content}</div>
            </section>
          ))}

          <div className="bg-light rounded p-4 mt-5">
            <h5 className="mb-3">Contact Our Privacy Team</h5>
            <p>For privacy-related inquiries or to exercise your rights:</p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:notacat.mail@gmail.com">notacat.mail@gmail.com</a>
              </li>
              <li className="mb-2">
                <strong>Data Protection Officer:</strong> Privacy Team, MyNFT
              </li>
              <li>
                <strong>Response Time:</strong> We aim to respond within 30 days
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};
