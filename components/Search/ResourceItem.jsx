"use babel";
import React, { Component } from "react";
import PropTypes from "prop-types";

class ResourceItem extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    sources: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  };

  state = {
    showDropdown: false
  };

  handleSourceClick = () => {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
  };

  handleSourceChange = value => {
    this.props.onChange(value);
    this.setState({ showDropdown: false });
  };

  render() {
    const { value, sources = [] } = this.props;
    const { showDropdown } = this.state;

    return (
      <div className={`sources-container`}>
        <div onClick={this.handleSourceClick}>{value}</div>
        <ul className={showDropdown ? "show" : ""}>
          {sources.map(item => (
            <li
              key={item}
              className={item === value ? "active" : ""}
              onClick={() => this.handleSourceChange(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ResourceItem;
