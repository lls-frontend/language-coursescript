'use babel'

import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  list: {
    margin: '100px auto',
    width: '50%'
  },
  item: {
    display: 'block',
    margin: '20px 0',
    textAlign: 'center',
    lineHeight: '40px',
    fontSize: '20px',
    fontWeight: 700,
    border: '1px solid #ccc',
    borderRadius: '10px',
    cursor: 'pointer'
  }
}

const SelectType = props => {
  const types = {
    DARWIN: 1,
    LT: 2,
    PT: 3,
    OCC: 4
  }

  const typeItem = (item, index) => {
    return <span key={index} style={styles.item} onClick={() => handleClick(item)}>{item}</span>
  }

  const handleClick = type => {
    props.onSelect(types[type])
  }

  return <div className="select-type" style={styles.list}>{Object.keys(types).map(typeItem)}</div>
}

SelectType.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default SelectType
