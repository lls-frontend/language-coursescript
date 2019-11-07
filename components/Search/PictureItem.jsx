'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { CDN_URL } from '../const';

const PictureItem = ({ data, onCopy }) => {
  const handleCopy = e => {
    const type = e.target.innerHTML
      .split(' ')
      .pop()
      .toLowerCase();
    const contents = {
      id: data.id,
      name: data.fileName,
      code: `Pic(id=${data.id}):${data.fileName}`
    };

    onCopy(contents[type] || '');
  };

  const date = data.createdAt
    ? dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')
    : null;

  const url = data.url.startsWith('http') ? data.url : `${CDN_URL}${data.url}`;

  return (
    <div className="search-item pic">
      <div className="left">
        <img src={url} alt="" />
      </div>
      <div className="right">
        <p>{date}</p>
        <p>{data.fileName}</p>
        <p>{data.id}</p>
        <div className="search-item-buttons">
          <p>Copy:</p>
          <span onClick={handleCopy}>Code</span>
          <span onClick={handleCopy}>Name</span>
          <span onClick={handleCopy}>ID</span>
        </div>
      </div>
    </div>
  );
};

PictureItem.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string,
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    fileName: PropTypes.string
  }).isRequired,
  onCopy: PropTypes.func.isRequired
};

export default PictureItem;
