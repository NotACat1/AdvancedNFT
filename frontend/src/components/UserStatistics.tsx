import React from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Person, Wallet, CurrencyExchange, Bag, CashCoin } from 'react-bootstrap-icons';
import { useUserStats } from '@hooks/useUserStats';
import { StatCard } from '@components/StatCard';
import { FormatUtils } from '@utils/FormatUtils';

export const UserStatistics: React.FC = () => {
  const { userStats, isLoading, isError, error } = useUserStats();

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (isError) {
    return <Alert variant="danger">{error?.message}</Alert>;
  }

  if (!userStats) {
    return <Alert variant="info">No user statistics available</Alert>;
  }

  return (
    <div className="mb-4">
      <h4 className="mb-4">
        <Person className="me-2" />
        Your Statistics
      </h4>
      <Row>
        <Col md={4} className="mb-3">
          <StatCard
            title="NFTs Owned"
            value={userStats.tokensOwned.toString()}
            icon={<Wallet size={24} />}
          />
        </Col>
        <Col md={4} className="mb-3">
          <StatCard
            title="NFTs Sold"
            value={userStats.tokensSold.toString()}
            icon={<Bag size={24} />}
          />
        </Col>
        <Col md={4} className="mb-3">
          <StatCard
            title="NFTs Purchased"
            value={userStats.tokensPurchased.toString()}
            icon={<Bag size={24} />}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-3">
          <StatCard
            title="Total Spent"
            value={`${FormatUtils.formatEthBalance(userStats.totalSpent)} ETH`}
            icon={<CurrencyExchange size={24} />}
            variant="danger"
          />
        </Col>
        <Col md={6} className="mb-3">
          <StatCard
            title="Total Earned"
            value={`${FormatUtils.formatEthBalance(userStats.totalEarned)} ETH`}
            icon={<CashCoin size={24} />}
            variant="success"
          />
        </Col>
      </Row>
    </div>
  );
};
