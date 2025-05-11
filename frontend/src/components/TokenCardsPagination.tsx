import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Spinner, Alert } from 'react-bootstrap';
import { TokenCard } from '@components/TokenCard';
import { IToken } from '@type/IToken';

interface TokenCardsPaginationProps {
  tokens: IToken[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  itemsPerPage?: number;
  className?: string;
}

export const TokenCardsPagination: React.FC<TokenCardsPaginationProps> = ({
  tokens = [],
  isLoading = false,
  isError = false,
  error = null,
  itemsPerPage = 8,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Вычисляем общее количество страниц при изменении количества токенов
  useEffect(() => {
    const newTotalPages = Math.ceil(tokens.length / itemsPerPage);
    setTotalPages(newTotalPages > 0 ? newTotalPages : 1);

    // Если текущая страница больше общего количества страниц, переходим на последнюю страницу
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [tokens.length, itemsPerPage, currentPage]);

  // Получаем токены для текущей страницы
  const getCurrentPageTokens = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tokens.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div
        className={`d-flex justify-content-center align-items-center ${className}`}
        style={{ minHeight: '300px' }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={className}>
        <Alert variant="danger">{error?.message || 'Failed to load tokens'}</Alert>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div
        className={`d-flex justify-content-center align-items-center ${className}`}
        style={{ minHeight: '300px' }}
      >
        <Alert variant="info">No tokens found</Alert>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Карточки */}
      <Row className="g-4 mb-4">
        {getCurrentPageTokens().map((token) => (
          <Col key={token.tokenId.toString()} xs={12} sm={6} md={4} lg={3}>
            <TokenCard tokenId={token.tokenId} />
          </Col>
        ))}
      </Row>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {/* Показываем первую страницу */}
            {currentPage > 2 && (
              <>
                <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                {currentPage > 3 && <Pagination.Ellipsis disabled />}
              </>
            )}

            {/* Показываем текущую страницу и соседние */}
            {[currentPage - 1, currentPage, currentPage + 1].map(
              (page) =>
                page > 0 &&
                page <= totalPages && (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ),
            )}

            {/* Показываем последнюю страницу */}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
                <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </Pagination.Item>
              </>
            )}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};
