'use babel'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Filter from './Filter.jsx'
import PictureItem from './PictureItem.jsx'
import AudioItem from './AudioItem.jsx'
import VideoItem from './VideoItem.jsx'
import Pagination from './Pagination.jsx'

const PAGE_SIZE = 25

const request = axios.create({ baseURL: 'https://cms.llsapp.com/v1/asset/' })
request.interceptors.response.use(
  res => res.data.msg,
  error => {
    const {
      response: { data, statusText },
    } = error;

    return Promise.reject(new Error(data.msg || statusText));
  }
);

export default class Search extends Component {
  static propTypes = {
    focus: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  state = {
    filter: {},
    result: { list: [], count: 0 },
    error: '',
    page: 1,
    showResults: false,
    isFetching: false,
  }

  renderResults = () => {
    const { onCopy, onError } = this.props
    const {
      filter: { resourceType },
      result,
      error,
      showResults,
      isFetching
    } = this.state

    if (!showResults) {
      return null
    }

    if (isFetching) {
      return <p className="search-text">Search...</p>
    }

    if (error) {
      return <p className="search-text">ERROR: {error}</p>
    }

    if (result.count === 0) {
      return <p className="search-text">Resource not found</p>
    }

    return (
      <div className="search-results">
        {result.list.map(item => {
          switch (resourceType) {
            case 'Pictures':
              return <PictureItem data={item} onCopy={onCopy} />
            case 'Audios':
              return <AudioItem data={item} onCopy={onCopy} />
            case 'Videos':
              const props = { data: item, request, onCopy, onError }
              return <VideoItem {...props} />
            default:
              return null
          }
        })}
      </div>
    )
  }

  fetch = async (page, { resourceType, searchType, tag, search }) => {
    this.setState({ isFetching: true, showResults: true, error: '' })
    try {
      if (resourceType === 'Pictures' && searchType === 'ID') {
        const res = await request.get(`/picture/${search}`)
        this.setState({
          result: {
            list: res.picture ? [res.picture] : [],
            count: res.picture ? 1 : 0
          }
        })
        return
      }

      const baseQuery = { page, page_size: PAGE_SIZE, query: search }

      if (searchType === 'Filename') {
        const query = { ...baseQuery, tag: tag.toLowerCase() }
        const queryString = Object.keys(query)
          .map(item => `${item}=${query[item]}`)
          .join('&')

        const res = await request.get(
          `/${resourceType.toLowerCase()}?${queryString}`
        )
        this.setState({
          result: {
            list: res[resourceType.toLowerCase()],
            count: res.count
          }
        })
        return
      }

      const query = { ...baseQuery, id: searchType === 'ID' || undefined }
      const queryString = Object.keys(query)
        .map(item => query[item] && `${item}=${query[item]}`)
        .filter(item => item)
        .join('&')

      const res = await request.get(
        `/search_${
          resourceType === 'Videos' ? 'video' : ''
        }clips?${queryString}`
      )
      const clips = res[resourceType === 'Videos' ? 'videoClips' : 'clips']

      if (resourceType === 'Videos') {
        const services = clips
          .reduce((res, item) => {
            if (res.includes(item.videoID)) {
              return res
            }

            return [...res, item.videoID]
          }, [])
          .map(item => request.get(`/video/${item}`))
        const videos = await Promise.all(services)
        this.setState({
          result: {
            list: videos.map(item => item.video),
            count: res.count
          }
        })
        return
      }

      this.setState({ result: { list: clips, count: res.count } })
    } catch (error) {
      this.setState({ error: error.message })
    } finally {
      this.setState({ isFetching: false })
    }
  }

  handleSearch = async (filter) => {
    this.fetch(1, filter)
    this.setState({ filter, page: 1 })
  }

  handlePage = (page) => {
    const { filter } = this.state

    this.fetch(page, filter)
    this.setState({ page })
  }

  handleClose = () => this.props.onClose()

  render() {
    const { focus } = this.props
    const { page, result } = this.state

    return (
      <div className="search">
        <Filter focus={focus} onSearch={this.handleSearch} />
        {this.renderResults()}
        {result.count > PAGE_SIZE && (
          <Pagination
            current={page}
            total={result.count}
            pageSize={PAGE_SIZE}
            onChange={this.handlePage}
          />
        )}
        <button
          type="button"
          className="search-close"
          onClick={this.handleClose}
        />
      </div>
    )
  }
}
