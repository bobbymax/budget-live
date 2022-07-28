/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

const CustomPagination = ({
  rows = [],
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

  useEffect(() => {
    if (rows?.length == 0) {
      setTotalPages(0);
    }
  }, [rows]);

  // eslint-disable-next-line no-unused-vars
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
    <>
      <div className="mt-4 btn-group btn-rounded">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage == 1}
          style={{ fontSize: 11, letterSpacing: 2 }}
        >
          <i className="fa fa-arrow-left mr-2"></i>
          PREVIOUS
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage == totalPages}
          style={{ fontSize: 11, letterSpacing: 2 }}
        >
          NEXT
          <i className="fa fa-arrow-right ml-2"></i>
        </button>
      </div>
    </>
  );
};

export default CustomPagination;
