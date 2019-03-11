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
    DARWIN: { courseType: 1, apiType: 1 },
    LT: { courseType: 2, apiType: 2 },
    PT: { courseType: 3, apiType: 3 },
    OCC: { courseType: 4, apiType: 4 },
    BE: { courseType: 4, apiType: 5 },
    PILOT: { courseType: 4, apiType: 6 },
    PHONICS: { courseType: 5, apiType: 7 },
    BELL: { courseType: 6, apiType: 8 },
    TOURISM: { courseType: 8, apiType: 9 },
    LINGOCHAMP: { courseType: 7, apiType: 10 },
    KION: { courseType: 9, apiType: 11 },
    'KION EXAM': { courseType: 10, apiType: 12 },
  }

  const typeItem = (item, index) => {
    return (
      <span key={index} style={styles.item} onClick={() => handleClick(item)}>
        {item}
      </span>
    )
  }

  const handleClick = type => {
    props.onSelect(types[type])
  }

  return (
    <div className="select-type" style={styles.list}>
      {Object.keys(types).map(typeItem)}
    </div>
  )
}

SelectType.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default SelectType
