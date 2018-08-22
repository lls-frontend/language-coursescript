'use babel';

import atom from 'atom';
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import CourscriptPreview from '@lls/coursescript-lib';
import SelectType from './SelectType.jsx';

export default class Preview extends React.Component {
  static propTypes = {
    plainText: PropTypes.string.isRequired,
    onTimeCopy: PropTypes.func.isRequired,
    onCodeCopy: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    data: null,
    type: null,
    isFetching: false
  };

  handleTypeSelect = type => {
    this.setState({ type })
    this.fetchList(this.props.plainText, type)
  }

  fetchList = async (text, type) => {
    const { onError } = this.props

    this.setState({ isFetching: true })
    try {
      const params = {
        text,
        type: type.apiType,
      }
      const { data } = await axios.post('http://cms.llsapp.com/v1/coursescript/parse', params)

      this.setState({ data, isFetching: false })
    } catch (error) {
      const { data } = error.response
      const message = `Line: ${data.line} ${data.message}`
      onError(new Error(message))
    }
  }

  handleActivityChange = id => {
    const { activities_line } = this.state.data
    this.props.onChange(activities_line[id])
  }

  handleCodeCopy = () => {
    const { course } = this.state.data
    this.props.onCodeCopy(course)
  }

  componentWillReceiveProps(nextProps) {
    const { plainText } = nextProps
    const { type } = this.state
    if (type) {
      this.fetchList(plainText, type)
    }
  }

  componentDidCatch(err) {
    this.props.onError(err)
  }

  render() {
    const { onTimeCopy } = this.props
    const { data, isFetching, type } = this.state

    if (isFetching) {
      return <div>Loading...</div>
    }

    if (type === null) {
      return <SelectType onSelect={this.handleTypeSelect} />
    }

    return (
      <div>
        <CourscriptPreview
          data={data}
          type={type.courseType}
          showActivityMetadata={type.courseType === 1}
          onActivityChange={this.handleActivityChange}
          onTimeCopy={onTimeCopy}
          onCodeCopy={this.handleCodeCopy}
        />
      </div>
    )
  }
}
