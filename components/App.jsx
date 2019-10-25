"use babel";

import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import CourscriptPreview from "@laix/coursescript-lib";
import apiUrls from "./api-urls.js";
import SelectType from "./SelectType.jsx";
export default class Preview extends React.Component {
  static propTypes = {
    plainText: PropTypes.string.isRequired,
    showFilename: PropTypes.bool.isRequired,
    onTimeCopy: PropTypes.func.isRequired,
    onCodeCopy: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  state = {
    data: null,
    type: null,
    selectedActivity: "",
    isFetching: false
  };

  fetchList = async (text, type) => {
    const { onError } = this.props;

    this.setState({ isFetching: true });
    try {
      const params = { text, type: type.apiType };
      const { data } = await axios.post(apiUrls.parse, params);

      if (type.courseType === 7) {
        const ids = Object.values(data.indexed_activities).reduce(
          (res, item) => ({
            ...res,
            [item.atom_id]: item.resource_id
          }),
          {}
        );
        const activities_line = Object.keys(data.activities_line).reduce(
          (res, item) => ({
            ...res,
            [ids[item]]: data.activities_line[item]
          }),
          {}
        );
        this.setState({ data: { ...data, activities_line } });
      } else {
        this.setState({ data });
      }
      this.setState({ isFetching: false });
    } catch (error) {
      const { data } = error.response;
      const message = `Line: ${data.line} ${data.message}`;
      onError(new Error(message));
    }
  };

  handleTypeSelect = type => {
    this.setState({ type });
    this.fetchList(this.props.plainText, type);
  };

  handleActivityChange = id => {
    const { activities_line } = this.state.data;
    if (activities_line && activities_line[id]) {
      this.props.onChange(activities_line[id]);
    }
  };

  handleCodeCopy = () => {
    const { course } = this.state.data;
    this.props.onCodeCopy(course);
  };

  handleSelectLineChange = line => {
    const { data } = this.state;
    if (!data || !data.activities_line) {
      return false;
    }

    const selectedActivity = Object.keys(data.activities_line).find(
      item => data.activities_line[item] === line
    );
    if (!selectedActivity) {
      return false;
    }

    this.setState({ selectedActivity });
  };

  componentWillReceiveProps(nextProps) {
    const { plainText } = nextProps;
    const { type } = this.state;
    if (type) {
      this.fetchList(plainText, type);
    }
  }

  componentDidCatch(err) {
    this.props.onError(err);
  }

  render() {
    const { onTimeCopy, showFilename } = this.props;
    const { data, type, selectedActivity, isFetching } = this.state;

    if (isFetching) {
      return <div>Loading...</div>;
    }

    if (type === null) {
      return <SelectType onSelect={this.handleTypeSelect} />;
    }

    // darwin 和 kion
    const showActivityMetadata = [1, 9].includes(type.courseType);

    return (
      <div>
        <CourscriptPreview
          data={data}
          type={type.courseType}
          activeActivityId={selectedActivity}
          showActivityMetadata={showActivityMetadata}
          onActivityChange={this.handleActivityChange}
          onTimeCopy={onTimeCopy}
          onCodeCopy={this.handleCodeCopy}
          showFilename={showFilename}
        />
      </div>
    );
  }
}
