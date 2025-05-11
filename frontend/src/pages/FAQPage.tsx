import React, { useState, useEffect } from 'react';
import { Container, Accordion, Form } from 'react-bootstrap';
import { QuestionCircleFill, Search } from 'react-bootstrap-icons';
import { useContractStats } from '@hooks/useContractStats';
import { FormatUtils } from '@utils/FormatUtils';

export const FAQPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { stats } = useContractStats();
  const maxRoyaltyFee = FormatUtils.parseFeeToPercent(stats?.stats.maxRoyaltyFee || BigInt(0));

  useEffect(() => {
    document.title = 'MyNFT | FAQ';
  }, []);

  const faqItems = [
    {
      question: 'What exactly is an NFT?',
      answer: [
        'NFT (Non-Fungible Token) is a unique digital certificate of ownership stored on the blockchain.',
        'Unlike cryptocurrencies where each token is identical, each NFT has distinct properties that make it one-of-a-kind.',
        'NFTs can represent digital art, collectibles, music, videos, or even real-world assets.',
      ],
      category: 'Basics',
    },
    {
      question: 'How do I create and mint an NFT on your platform?',
      answer: [
        "Navigate to the 'Create' section",
        'Upload your digital file (JPG, PNG, GIF, MP4, etc.)',
        'Add compelling details: name, description, properties',
        'Set your pricing strategy (fixed price, auction, etc.)',
        'Configure royalties (earn % on future sales)',
        'Review and confirm the minting transaction',
        "Note: You'll need ETH in your wallet to cover gas fees",
      ],
      category: 'Creation',
    },
    {
      question: 'Which cryptocurrency wallets do you support?',
      answer: [
        'We support all Ethereum-compatible wallets including:',
        'Browser extensions: MetaMask, Coinbase Wallet',
        'Mobile wallets: Trust Wallet, Rainbow',
        'WalletConnect compatible wallets',
        'Hardware wallets: Ledger, Trezor',
        "We're continuously adding support for more wallets.",
      ],
      category: 'Wallets',
    },
    {
      question: 'What fees should I expect when using your marketplace?',
      answer: [
        'Our fee structure is transparent:',
        '🖼️ Minting Fees:',
        'Platform service fee: 1%',
        'Blockchain gas fees: variable (depends on network congestion)',
        '💰 Transaction Fees:',
        'Seller pays: 2.5% of sale price',
        'Buyer pays: gas fees only',
        '♾ Royalties:',
        'Creators earn 5-10% on secondary sales (configurable)',
      ],
      category: 'Fees',
    },
    {
      question: 'How does the selling process work?',
      answer: [
        'To sell your NFT:',
        'Connect your wallet',
        "Visit your 'My Collection' page",
        'Select the NFT you wish to sell',
        'Choose between:',
        'Fixed price listing',
        'Timed auction',
        'Set your terms (price, duration)',
        'Sign the transaction',
        'Once sold, funds will be automatically deposited to your wallet.',
      ],
      category: 'Selling',
    },
    {
      question: 'Can I edit or cancel my NFT listing?',
      answer: [
        'Yes, you have full control:',
        '✏️ To edit:',
        'Navigate to your active listings',
        "Click 'Edit' to update price or sale type",
        'This requires a new transaction',
        '❌ To cancel:',
        'Go to your listings',
        "Click 'Cancel' and confirm",
        'Note: Small gas fee applies for cancellation',
        '⚠️ Important: You cannot cancel a listing that has active bids',
      ],
      category: 'Management',
    },
    {
      question: 'How do royalties work for creators?',
      answer: [
        'Our platform empowers creators with ongoing earnings:',
        '💎 Royalty Features:',
        `Set your royalty percentage (${maxRoyaltyFee}% recommended)`,
        'Earn automatically on all secondary sales',
        'Payments are instant and handled by smart contracts',
        'Royalties are forever encoded in the NFT',
        "No action required - it's automatic",
      ],
      category: 'Creators',
    },
    {
      question: 'What blockchain does your platform use?',
      answer: [
        "We're built on Ethereum, the most secure and widely-adopted blockchain for NFTs.",
        'Key advantages:',
        'Ethereum Mainnet: Maximum security and liquidity',
        'Future plans to support Layer 2 solutions for lower fees',
        'All NFTs are ERC-721 standard (the gold standard)',
        'Interoperable with all major marketplaces',
      ],
      category: 'Technology',
    },
    {
      question: 'How do I ensure my NFT purchase is authentic?',
      answer: [
        'We implement multiple verification layers:',
        '🔍 Verification Process:',
        'Check the blue verification badge on creator profiles',
        'Review transaction history on the blockchain',
        'Confirm the contract address matches our official one',
        'Look for consistent ownership history',
        'Report suspicious items using our verification tool',
        'Our moderation team constantly monitors for fraudulent items.',
      ],
      category: 'Security',
    },
    {
      question: 'What file types and sizes do you support?',
      answer: [
        'Supported Media Formats:',
        '🖼 Images: JPG, PNG, GIF (Max 10MB)',
        '🎨 Vector: SVG (Max 10MB)',
        'For best results:',
        'Use high-quality source files',
        'Optimal dimensions for images: 2000-5000px',
      ],
      category: 'Technical',
    },
  ];

  const handleAccordionToggle = (eventKey: string) => {
    setActiveKey(activeKey === eventKey ? null : eventKey);
  };

  const toggleAll = () => {
    setActiveKey(activeKey === null ? faqItems.map((_, i) => i.toString()) : null);
  };

  const categories = ['All', ...new Set(faqItems.map((item) => item.category))];

  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h1 className="mb-3 mb-md-0 d-flex align-items-center">
          <QuestionCircleFill className="me-2 text-primary" size={28} />
          Frequently Asked Questions
        </h1>

        <div className="d-flex gap-2">
          <button onClick={toggleAll} className="btn btn-outline-primary">
            {activeKey === null ? 'Expand All' : 'Collapse All'}
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8 mb-3 mb-md-0">
          <div className="position-relative">
            <Form.Control
              type="search"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-4"
            />
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          </div>
        </div>
        <div className="col-md-4">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <Accordion
          activeKey={activeKey}
          onSelect={handleAccordionToggle}
          className="custom-accordion mb-5"
          flush
          alwaysOpen
        >
          {filteredItems.map((item, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={index}
              className="mb-3 border-0 rounded-3 overflow-hidden shadow-sm"
            >
              <Accordion.Header className="bg-light p-3">
                <div className="d-flex align-items-center w-100">
                  <span className="fw-semibold fs-5 me-3">{item.question}</span>
                  <span className="badge bg-primary ms-auto">{item.category}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-4 bg-white">
                {Array.isArray(item.answer) ? (
                  <ul className="list-unstyled">
                    {item.answer.map((point, i) => (
                      <li key={i} className="mb-2 d-flex">
                        <span className="me-2">•</span>
                        <span dangerouslySetInnerHTML={{ __html: point }} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{item.answer}</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No questions found matching your search</h4>
          <button
            className="btn btn-link"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="bg-light rounded p-4 mt-4">
        <h4 className="mb-3">Still have questions?</h4>
        <p className="mb-0">
          Contact our support team at{' '}
          <a href="mailto:notacat.mail@gmail.com" className="text-primary">
            notacat.mail@gmail.com
          </a>
          or join our{' '}
          <a href="#" className="text-primary">
            Discord community
          </a>
          .
        </p>
      </div>
    </Container>
  );
};
