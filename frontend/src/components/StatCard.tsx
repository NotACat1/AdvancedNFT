import React from 'react';
import { Card } from 'react-bootstrap';

export interface IStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: string;
  className?: string;
}

export const StatCard: React.FC<IStatCardProps> = ({
  title,
  value,
  icon,
  variant = 'primary',
  className = '',
}) => {
  return (
    <Card className={`text-center ${className}`}>
      <Card.Body>
        <div className={`text-${variant} mb-2`}>{icon}</div>
        <h6 className="text-muted">{title}</h6>
        <h4 className="mb-0">{value}</h4>
      </Card.Body>
    </Card>
  );
};
