'use babel'

import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const PictureItem = ({ data, onCopy }) => {
  const handleCopy = (e) => {
    const type = e.target.innerHTML.split(' ').pop().toLowerCase()
    const contents = {
      id: data.id,
      name: data.filename,
      code: `Pic(id=${data.id}):${data.filename}`,
    }

    onCopy(contents[type] || '')
  }

  const date = data.createdAt
    ? dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')
    : null

  return (
    <div className="search-item pic">
      <div className="left">
        <img src={data.url} alt=""/>
      </div>
      <div className="right">
        <p>{date}</p>
        <p>{data.filename}</p>
        <p>{data.id}</p>
        <div className="search-item-buttons">
          <span onClick={handleCopy}>Copy Code</span>
          <span onClick={handleCopy}>Copy Name</span>
          <span onClick={handleCopy}>Copy ID</span>
        </div>
      </div>
    </div>
  )
}

PictureItem.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    filename: PropTypes.string,
  })).isRequired,
  onCopy: PropTypes.func.isRequired,
}

export default PictureItem
