import React, { useState } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

const Pagination = ({ currentPage, totalOrders, pageSize, onPageChange }) => {
  const [inputPage, setInputPage] = useState("");

  const totalPages = totalOrders ? Math.ceil(totalOrders / pageSize) : 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const targetPage = parseInt(inputPage);
    if (!isNaN(targetPage)) {
      handlePageChange(targetPage);
    }
    setInputPage("");
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const sidePages = 1;

    const shouldShowLeftEllipsis = currentPage > sidePages + 2;
    const shouldShowRightEllipsis = currentPage < totalPages - sidePages - 1;

    // First page
    pageButtons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        1
      </button>
    );

    if (shouldShowLeftEllipsis) {
      pageButtons.push(<span key="left-ellipsis">...</span>);
    }

    // Middle pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (shouldShowRightEllipsis) {
      pageButtons.push(<span key="right-ellipsis">...</span>);
    }

    // Last page
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="flex  items-center justify-center gap-x-5 mt-4">
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-md flex items-center gap-x-1 hover:bg-green disabled:opacity-50"
        >
          <MdKeyboardArrowRight /> قبلی
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-green flex items-center gap-x-1  disabled:opacity-50"
        >
          بعدی
          <MdKeyboardArrowLeft />
        </button>
      </div>

      <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="1"
          className="w-16 px-2 py-1 border border-blue-300 focus:outline-none rounded-md"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          <IoSearchOutline size={24} />
        </button>
      </form>
    </div>
  );
};

export default Pagination;
