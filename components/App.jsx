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

    try {
      this.setState({ isFetching: true })

      const { data } = await axios.post('http://cms.llsapp.com/v1/coursescript/parse', { text, type })

      this.setState({ data, isFetching: false })
    } catch (error) {
      const { data } = error.response
      const message = `Line: ${data.line} ${data.message}`
      onError(new Error(message))
    }
  }

  handleCursor = id => {
    const { activities_line } = this.state.data
    this.props.onChange(activities_line[id])
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
          <CourscriptPreview data={data} type={type} onActivityChange={this.handleCursor} />
        </div>
      )
    } else {
      return <SelectType onSelect={this.handleTypeSelect} />
    }
  }
}
