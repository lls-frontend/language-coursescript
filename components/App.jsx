"use babel";

import React from "react";
import PropTypes from "prop-types";
import CourscriptPreview, { formatCamelCase } from "@laix/coursescript-lib";
import CourscriptPreviewSprout from '@laix/coursescript-lib-sprout'
import SelectType from "./SelectType.jsx";
import { bffRequest } from "./request";

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

  /**
   * 迁移到了 bff 层接口
   * apiDoc: https://wiki.liulishuo.work/display/PLAT/CMS+-+Atom#postpreview
   * @param {string} text 当前的 coursescript 文本字符串
   * @param {string} type 对应 sku 的课程名
   * @return {any} 对应课程的 json 数据
   */
  fetchPreviewData = async (text, type) => {
    const params = {
      text,
      type: type.courseName
    };
    const data = await bffRequest.post("preview", params);

    return data;
  };

  fetchData = async (text, type) => {
    const { onError } = this.props;
    this.setState({ isFetching: true });

    try {
      const data = await this.fetchPreviewData(text, type);

      if (type.courseType === 7) {
        const ids = Object.values(data.indexedActivities).reduce(
          (res, item) => ({
            ...res,
            [item.atomId]: item.resourceId
          }),
          {}
        );
        const activitiesLine = Object.keys(data.activitiesLine).reduce(
          (res, item) => ({
            ...res,
            [ids[item]]: data.activitiesLine[item]
          }),
          {}
        );
        this.setState({ isFetching: false, data: { ...data, activitiesLine } });
      } else {
        this.setState({ data, isFetching: false });
      }
    } catch (error) {
      const message = error.message;
      onError(new Error(message));
    }
  };

  handleTypeSelect = type => {
    this.setState({ type });
    this.fetchData(this.props.plainText, type);
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
      this.fetchData(plainText, type);
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
    // sprout aix lingokids
    if ([5, 15, 16, 17].includes(type.courseType)) {
      return <div>
        <CourscriptPreviewSprout
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
    }
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
