import React, { useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { FileTextFill } from 'react-bootstrap-icons';
import { useContractStats } from '@hooks/useContractStats';
import { FormatUtils } from '@utils/FormatUtils';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'MyNFT | Terms of Service';
  }, []);

  const { stats } = useContractStats();
  const maxRoyaltyFee = FormatUtils.parseFeeToPercent(stats?.stats.maxRoyaltyFee || BigInt(0));
  const marketplaceFee = FormatUtils.parseFeeToPercent(stats?.stats.marketplaceFee || BigInt(0));

  const termsSections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: (
        <p className="mb-0">
          By accessing or using MyNFT Marketplace ("Service"), you agree to be bound by these Terms
          of Service ("Terms"). These Terms constitute a legally binding agreement between you and
          MyNFT. If you disagree with any part of these Terms, you may not access the Service. We
          reserve the right to modify these Terms at any time, with changes becoming effective upon
          posting. Your continued use constitutes acceptance of the modified Terms.
        </p>
      ),
    },
    {
      id: 'responsibilities',
      title: '2. User Responsibilities',
      content: (
        <ListGroup variant="flush" className="border rounded">
          <ListGroup.Item className="d-flex align-items-start py-3">
            <span className="badge bg-primary me-3 mt-1">1</span>
            <div>
              <h6 className="mb-1">Age Requirement</h6>
              <p className="mb-0">
                You must be at least 18 years old or the age of majority in your jurisdiction to use
                this Service.
              </p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-start py-3">
            <span className="badge bg-primary me-3 mt-1">2</span>
            <div>
              <h6 className="mb-1">Account Security</h6>
              <p className="mb-0">
                You are solely responsible for maintaining the confidentiality and security of your
                account credentials.
              </p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-start py-3">
            <span className="badge bg-primary me-3 mt-1">3</span>
            <div>
              <h6 className="mb-1">Prohibited Conduct</h6>
              <p className="mb-0">
                You may not use the Service for any illegal purpose or in violation of any laws in
                your jurisdiction.
              </p>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-start py-3">
            <span className="badge bg-primary me-3 mt-1">4</span>
            <div>
              <h6 className="mb-1">User Interactions</h6>
              <p className="mb-0">
                You are solely responsible for your interactions with other users and any content
                you post or share.
              </p>
            </div>
          </ListGroup.Item>
        </ListGroup>
      ),
    },
    {
      id: 'ownership',
      title: '3. NFT Ownership',
      content: (
        <div>
          <p>
            Purchasing an NFT through our Service grants you ownership of that specific token on the
            blockchain, represented by a unique cryptographic hash. However:
          </p>
          <ul className="list-unstyled">
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>
                NFT ownership does not automatically grant copyright or intellectual property rights
                to the underlying content
              </span>
            </li>
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>
                Some NFTs may include additional licenses - check the specific NFT's details for
                more information
              </span>
            </li>
            <li className="d-flex">
              <span className="me-2">•</span>
              <span>
                You may display the NFT for personal, non-commercial use unless otherwise specified
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'fees',
      title: '4. Fees and Payments',
      content: (
        <div>
          <p>All transactions on MyNFT Marketplace may be subject to the following fees:</p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Service Fee</td>
                  <td>Charged by MyNFT for platform usage</td>
                  <td>{marketplaceFee}% of sale price</td>
                </tr>
                <tr>
                  <td>Gas Fee</td>
                  <td>Blockchain network processing fee</td>
                  <td>Variable (ETH network)</td>
                </tr>
                <tr>
                  <td>Royalty Fee</td>
                  <td>Paid to content creators on secondary sales</td>
                  <td>{maxRoyaltyFee}% (set by creator)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted">
            Note: All fees are non-refundable once the transaction is confirmed on the blockchain.
          </p>
        </div>
      ),
    },
    {
      id: 'liability',
      title: '5. Limitation of Liability',
      content: (
        <div>
          <p>
            To the maximum extent permitted by law, MyNFT Marketplace and its affiliates shall not
            be liable for:
          </p>
          <ul className="list-unstyled">
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>Any indirect, incidental, special, consequential or punitive damages</span>
            </li>
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>Loss of profits, revenue, data, or business interruption</span>
            </li>
            <li className="mb-2 d-flex">
              <span className="me-2">•</span>
              <span>Unauthorized access to or alteration of your transmissions or data</span>
            </li>
            <li className="d-flex">
              <span className="me-2">•</span>
              <span>Any bugs, viruses, or other harmful components in the Service</span>
            </li>
          </ul>
          <p>
            Our total liability in any matter related to the Service is limited to the greater of
            (a) $100 or (b) the amount you paid us in the 12 months preceding the event giving rise
            to liability.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Container className="py-4 terms-page">
      <div className="d-flex flex-column flex-lg-row gap-4">
        {/* Main Content */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-4">
            <FileTextFill className="me-2 text-primary" size={28} />
            <div>
              <h1 className="mb-0">Terms of Service</h1>
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

          <div className="alert alert-info mb-4">
            <p className="mb-0">
              <strong>Important:</strong> These Terms govern your use of MyNFT Marketplace. By using
              our Service, you agree to these Terms. Please read them carefully.
            </p>
          </div>

          {termsSections.map((section) => (
            <section key={section.id} id={section.id} className="mb-5 pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">{section.title}</h2>
              </div>
              <div className="border-start border-3 ps-3 border-primary">{section.content}</div>
            </section>
          ))}

          <div className="bg-light rounded p-4 mt-5">
            <h5 className="mb-3">Contact Us</h5>
            <p className="mb-2">If you have any questions about these Terms, please contact us:</p>
            <ul className="list-unstyled">
              <li className="mb-1">
                <strong>Email:</strong>{' '}
                <a href="mailto:notacat.mail@gmail.com">notacat.mail@gmail.com</a>
              </li>
              <li>
                <strong>Discord:</strong>{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Join our community
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};
