import React from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import {
  Collection,
  Cart,
  CurrencyExchange,
  GraphUp,
  Percent,
  ClockHistory,
} from 'react-bootstrap-icons';
import { useContractStats } from '@hooks/useContractStats';
import { StatCard } from '@components/StatCard';
import { FormatUtils } from '@utils/FormatUtils';

export const ContractStatistics: React.FC = () => {
  const { stats, isLoading, isError, error } = useContractStats();

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (isError) {
    return <Alert variant="danger">{error?.message}</Alert>;
  }

  if (!stats) {
    return <Alert variant="info">No contract statistics available</Alert>;
  }

  return (
    <div className="mb-4">
      <h4 className="mb-4">
        <GraphUp className="me-2" />
        Marketplace Statistics
      </h4>
      <Row>
        <Col md={3} className="mb-3">
          <StatCard
            title="Total NFTs"
            value={stats.totalNFTs.toString()}
            icon={<Collection size={24} />}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="NFTs On Sale"
            value={stats.totalOnSale.toString()}
            icon={<Cart size={24} />}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Volume"
            value={`${FormatUtils.formatEthBalance(stats.stats.totalSalesVolume)} ETH`}
            icon={<CurrencyExchange size={24} />}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Transactions"
            value={stats.stats.totalTransactions.toString()}
            icon={<ClockHistory size={24} />}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <StatCard
            title="Marketplace Fee"
            value={`${FormatUtils.parseFeeToPercent(stats.stats.marketplaceFee, 3)}%`}
            icon={<Percent size={20} />}
            className="mt-2"
          />
        </Col>
        <Col md={6}>
          <StatCard
            title="Max Royalty Fee"
            value={`${FormatUtils.parseFeeToPercent(stats.stats.maxRoyaltyFee, 3)}%`}
            icon={<Percent size={20} />}
            className="mt-2"
          />
        </Col>
      </Row>
    </div>
  );
};
