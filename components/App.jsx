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
    onError: PropTypes.func,
  };

  state = {
    data: null,
    type: null,
    isFetching: false
  };

  handleTypeSelect = type => {
    this.setState({ type })
    this.fetchList(type)
  }

  fetchList = async type => {
    this.setState({ isFetching: true })

    const { plainText, onError } = this.props
    try {
      const { data } = await axios.post('http://cms.llsapp.com/v1/coursescript/parse', {
        text: plainText,
        type
      })

      this.setState({ data, isFetching: false })
    } catch (error) {
      const { data } = error.response
      const message = `Line: ${data.line} ${data.message}`
      onError(new Error(message))
    }
  }

  handleCursor = active => {
    const { courseList } = this.state;
    if (courseList[active]) {
      window.postMessage(courseList[active][0], '*');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { type } = this.state
    this.fetchList(type)
  }

  componentDidCatch(err) {
    this.props.onError(err)
  }

  render() {
    const { data, isFetching, type } = this.state;

    if (isFetching) {
      return <div>Loading...</div>
    }

    if (type !== null) {
      return (
        <div style={{padding: 20}}>
          <CourscriptPreview data={data} type={type} />
        </div>
      )
    } else {
      return <SelectType onSelect={this.handleTypeSelect} />
    }
  }
}
