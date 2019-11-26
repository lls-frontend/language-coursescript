"use babel";

import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { CDN_URL } from "../const";

const AudioItem = ({ data, onCopy }) => {
  const handleCopy = e => {
    const type = e.target.innerHTML
      .toLowerCase()
      .replace(/\s\w/, s => s.trim().toUpperCase());
    const contents = {
      id: data.id,
      name: data.text,
      code: `Audio(id=${data.id}):${data.text}`,
      trCode: `TR(id=${data.id}):${data.text}`
    };

    onCopy(contents[type] || "");
  };

  const url = (data.url || "").startsWith("http")
    ? data.url
    : `${CDN_URL}${data.url || ""}`;

  const createdAt = data.createdAt
    ? dayjs(data.createdAt).format("YYYY-MM-DD HH:mm")
    : "";
  const updatedAt = data.updatedAt
    ? dayjs(data.updatedAt).format("YYYY-MM-DD HH:mm")
    : null;

  return (
    <div className="search-item audio">
      {createdAt && <p>createdAt: {createdAt}</p>}
      {updatedAt && <p>updatedAt: {updatedAt}</p>}
      <p>{data.id}</p>
      <p>{data.text}</p>
      <p>{data.source}</p>
      <div className="search-item-audio">
        <audio src={url} controls />
        <div className="search-item-buttons">
          <p>Copy:</p>
          <span onClick={handleCopy}>TR Code</span>
          <span onClick={handleCopy}>Code</span>
          <span onClick={handleCopy}>Name</span>
          <span onClick={handleCopy}>ID</span>
        </div>
      </div>
    </div>
  );
};

AudioItem.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string,
    id: PropTypes.string.isRequired,
    source: PropTypes.string,
    text: PropTypes.string,
    fileName: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  }).isRequired,
  onCopy: PropTypes.func.isRequired
};

export default AudioItem;
