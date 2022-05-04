/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const CustomPagination = ({
  total = 0,
  itemsPerPage = 15,
  currentPage = 1,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemsPerPage > 0) {
      setTotalPages(Math.ceil(total / itemsPerPage));
    }
  }, [total, itemsPerPage]);

  const paginationItems = useMemo(() => {
    const pages = [];

    const totalSub = totalPages > 15 ? Math.ceil(totalPages / 5) : totalPages;

    for (let i = 1; i <= totalSub; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i == currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pages;
  }, [totalPages, currentPage]);

  if (totalPages == 0) return null;

  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage == 1}
      />
      {paginationItems}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage == totalPages}
      />
    </Pagination>
  );
};

export default CustomPagination;
