"use babel";

import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import CourscriptPreview, { formatCamelCase } from "@laix/coursescript-lib";
import apiUrls from "./api-urls.js";
import SelectType from "./SelectType.jsx";
const env = atom.config.get("language-coursescript.useStagingApi")
  ? "staging"
  : "prod";

const isStaging = env === "staging";
const parseUrl = isStaging ? `${apiUrls.bffAsset}preview` : apiUrls.parse;

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
      const params = {
        text,
        type: !isStaging ? type.apiType : type.courseName
      };

      const { data } = await axios.post(parseUrl, params);

      if (isStaging) {
        if (data.code === 1) {
          const message = data.msg; //`Line: ${"undefined"} ${res.msg}`;
          onError(new Error(message));
          return;
        }
      }

      const res = isStaging ? data.msg : formatCamelCase(data);

      if (type.courseType === 7) {
        const ids = Object.values(res.activitiesLine).reduce(
          (res, item) => ({
            ...res,
            [item.atom_id]: item.resourceId
          }),
          {}
        );
        const activitiesLine = Object.keys(res.activitiesLine).reduce(
          (res, item) => ({
            ...res,
            [ids[item]]: res.activitiesLine[item]
          }),
          {}
        );
        this.setState({ data: { ...data, activitiesLine } });
      } else {
        this.setState({ data: res });
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
    const { activitiesLine } = this.state.data;
    if (activitiesLine && activitiesLine[id]) {
      this.props.onChange(activitiesLine[id]);
    }
  };

  handleCodeCopy = () => {
    const { course } = this.state.data;
    this.props.onCodeCopy(course);
  };

  handleSelectLineChange = line => {
    const { data } = this.state;
    if (!data || !data.activitiesLine) {
      return false;
    }

    const selectedActivity = Object.keys(data.activitiesLine).find(
      item => data.activitiesLine[item] === line
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
