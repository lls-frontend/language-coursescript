'use babel'

import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const AudioItem = ({ data, onCopy }) => {
  const handleCopy = (e) => {
    const type = e.target.innerHTML.toLowerCase().replace(/\s\w/, s => s.trim().toUpperCase())
    const contents = {
      id: data.id,
      name: data.description,
      code: `Audio(id=${data.id}):${data.description}`,
      trCode: `TR(id=${data.id}):${data.description}`
    }

    onCopy(contents[type] || '')
  }

  return (
    <div className="search-item audio">
      <p>{data.createdAt && dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')}</p>
      <p>{data.id}</p>
      <p>{data.description}</p>
      <div className="search-item-audio">
        <audio src={data.url} controls></audio>
        <div className="search-item-buttons">
          <p>Copy:</p>
          <span onClick={handleCopy}>TR Code</span>
          <span onClick={handleCopy}>Code</span>
          <span onClick={handleCopy}>Name</span>
          <span onClick={handleCopy}>ID</span>
        </div>
      </div>
    </div>
  )
}

AudioItem.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    filename: PropTypes.string,
  })).isRequired,
  onCopy: PropTypes.func.isRequired,
}

export default AudioItem
