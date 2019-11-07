"use babel";

import React, { Component } from "react";
import PropTypes from "prop-types";
import ResourceItem from "./ResourceItem.jsx";

// 资源类型
const types = {
  Pictures: ["Filename", "ID"],
  Audios: ["Text", "ClipID", "Filename"],
  Videos: ["Filename", "Text", "ClipID", "VideoID"],
  "Streaming Videos": ["Filename", "VideoID"],
  Scorer: ["Text", "ClipID", "Filename"]
};

// 音频类型
const AudiosTypes = [
  {
    label: "All",
    value: "All"
  },
  {
    label: "Human",
    value: "Human"
  },
  {
    label: "TTS",
    value: "TTS"
  }
];

// 音频性别类型
const GenderTypes = {
  Human: [
    {
      label: "All",
      value: "All"
    },
    {
      label: "Male",
      value: "Male"
    },
    {
      label: "Female",
      value: "Female"
    },
    {
      label: "Dialogue",
      value: "Dialogue"
    }
  ],
  TTS: [
    {
      label: "All",
      value: "All"
    },
    {
      label: "Male",
      value: "Male"
    },
    {
      label: "Female",
      value: "Female"
    }
  ]
};

const defaultResourceType = Object.keys(types)[0];

class ResourceFilter extends Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    focus: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired
  };

  state = {
    source: "All", // 业务线
    resourceType: defaultResourceType, // 资源类型
    searchType: types[defaultResourceType][0], // 资源对应的子类
    search: "",
    audioType: "All", // 音频的类型
    audioGender: "All" // 音频的性别
  };

  handleSorceChange = (type, value) => {
    if (type === "resourceType") {
      this.setState({
        [type]: value,
        searchType: types[value][0],
        audioType: "All",
        audioGender: "All"
      });
    } else {
      this.setState({
        [type]: value,
        audioType: "All",
        audioGender: "All"
      });
    }
  };

  handleAudiosTypeChange = e => {
    const { value } = e.target;

    this.setState({
      audioType: value,
      audioGender: "All"
    });
  };

  handleGenderTypeChange = e => {
    const { value } = e.target;

    this.setState({
      audioGender: value
    });
  };

  handleInputChange = e => {
    this.setState({ search: e.target.value });
  };

  handleSearch = () => {
    const {
      resourceType,
      searchType,
      source,
      search,
      audioType,
      audioGender
    } = this.state;
    if (!search) {
      return false;
    }

    this.props.onSearch({
      resourceType,
      searchType,
      source,
      search,
      audioType,
      audioGender
    });
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  };

  componentDidMount() {
    this.input.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    this.input.removeEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.focus && this.props.focus) {
      this.input.focus();
    }
  }

  render() {
    const { sources } = this.props;
    const {
      source,
      search,
      searchType,
      resourceType,
      audioType,
      audioGender
    } = this.state;

    // 资源类型
    const resources = Object.keys(types);
    // 资源对应子类
    const searchSource = types[resourceType];

    const showAudiosTypes = resourceType === "Audios";
    const showGenderTypes =
      showAudiosTypes && searchType === "Text" && audioType !== "All";

    return (
      <div className="resource-filter">
        <div className="search-sources-container">
          <ResourceItem
            value={source}
            sources={sources}
            onChange={value => this.handleSorceChange("source", value)}
          />
          <ResourceItem
            value={resourceType}
            sources={resources}
            onChange={value => this.handleSorceChange("resourceType", value)}
          />
          <ResourceItem
            value={searchType}
            sources={searchSource}
            onChange={value => this.handleSorceChange("searchType", value)}
          />
        </div>
        {showAudiosTypes && (
          <div className="search-sources-container">
            {AudiosTypes.map(item => (
              <label key={item}>
                <input
                  type="radio"
                  name="audioType"
                  value={item.value}
                  checked={item.value === audioType}
                  onChange={this.handleAudiosTypeChange}
                />
                {item.label}
              </label>
            ))}
          </div>
        )}
        {showGenderTypes && (
          <div className="search-sources-container">
            {GenderTypes[audioType].map(item => (
              <label key={item}>
                <input
                  type="radio"
                  name="audioGender"
                  value={item.value}
                  checked={item.value === audioGender}
                  onChange={this.handleGenderTypeChange}
                />
                {item.label}
              </label>
            ))}
          </div>
        )}
        <div className="search-input">
          <input
            ref={input => (this.input = input)}
            className="native-key-bindings"
            type="text"
            placeholder="Search"
            tabIndex="1"
            value={search}
            onChange={this.handleInputChange}
          />
          <i onClick={this.handleSearch}></i>
        </div>
      </div>
    );
  }
}

export default ResourceFilter;
