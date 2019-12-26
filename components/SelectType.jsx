"use babel";

import React from "react";
import PropTypes from "prop-types";
import COURSE_TYPES from "./course-types";

const styles = {
  list: {
    margin: "100px auto",
    width: "50%"
  },
  item: {
    display: "block",
    margin: "20px 0",
    textAlign: "center",
    lineHeight: "40px",
    fontSize: "20px",
    fontWeight: 700,
    border: "1px solid #ccc",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

const SelectType = props => {
  const typeItem = (item, index) => {
    return (
      <span key={index} style={styles.item} onClick={() => handleClick(item)}>
        {item}
      </span>
    );
  };

  const handleClick = type => {
    props.onSelect(COURSE_TYPES[type]);
  };

  const previewCourse = atom.config.get("language-coursescript.previewCourse");

  return (
    <div className="select-type" style={styles.list}>
      {Object.keys(COURSE_TYPES)
        .filter(item => previewCourse[item])
        .map(typeItem)}
    </div>
  );
};

SelectType.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default SelectType;
