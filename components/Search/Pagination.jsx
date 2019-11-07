"use babel";

import React from "react";
import PropTypes from "prop-types";

const Pagination = ({ current, total, pageSize, onChange }) => {
  const pageCount = Math.ceil(total / pageSize);

  const prevButton = () => {
    const props = {
      className: current === 1 ? "disabled" : undefined,
      onClick: () => current > 1 && onChange(current - 1)
    };

    return <li {...props}>{`<`}</li>;
  };

  const pageButton = page => {
    const props = {
      key: page,
      className: page === current ? "active" : undefined,
      onClick: () => onChange(page)
    };

    return <li {...props}>{page}</li>;
  };

  const nextButton = () => {
    const props = {
      className: current === pageCount ? "disabled" : undefined,
      onClick: () => current < pageCount && onChange(current + 1)
    };

    return <li {...props}>{`>`}</li>;
  };

  if (pageCount < 6) {
    return (
      <ul className="search-pagination">
        {prevButton()}
        {Array(pageCount)
          .fill(null)
          .map((_, index) => pageButton(index + 1))}
        {nextButton()}
      </ul>
    );
  }

  if (current < 5) {
    return (
      <ul className="search-pagination">
        {prevButton()}
        {Array(5)
          .fill(null)
          .map((_, index) => pageButton(index + 1))}
        ...
        {pageButton(pageCount)}
        {nextButton()}
      </ul>
    );
  }

  if (pageCount - current < 4) {
    return (
      <ul className="search-pagination">
        {prevButton()}
        {pageButton(1)}
        ...
        {[-4, -3, -2, -1, 0].map(item => pageButton(pageCount + item))}
        {nextButton()}
      </ul>
    );
  }

  return (
    <ul className="search-pagination">
      {prevButton()}
      {pageButton(1)}
      ...
      {[-2, -1, 0, 1, 2].map(item => pageButton(current + item))}
      ...
      {pageButton(pageCount)}
      {nextButton()}
    </ul>
  );
};

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Pagination;
