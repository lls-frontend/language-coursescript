'use babel'

import React from 'react'
import PropTypes from 'prop-types'

const SearchItem = props => {
  const { data, type, onCopy } = props

  const copyButton = (
    <div className="search-item-buttons">
      <span onClick={() => handleCopy('name')}>Copy name</span>
      <span onClick={() => handleCopy('id')}>Copy id</span>
    </div>
  )

  const handleCopy = field => {
    if (field === 'name') {
      onCopy(data.origin_filename)
    } else {
      onCopy(data.resource_id)
    }
  }

  if (type === 'pic') {
    return (
      <div className="search-item pic">
        <div className="image">
          <img src={data.url} alt=""/>
        </div>
        <div className="text">
          <p>{data.origin_filename}</p>
          {copyButton}
        </div>
      </div>
    )
  }
}

SearchItem.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    resource_id: PropTypes.string.isRequired,
    origin_filename: PropTypes.string,
  })).isRequired,
  type: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
}

export default SearchItem
