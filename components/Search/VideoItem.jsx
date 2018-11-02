'use babel'

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import Pagination from './Pagination.jsx'

const PAGE_SIZE = 20

export default class VideoItem extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string,
      filename: PropTypes.string,
      url: PropTypes.string,
      videoClipsCount: PropTypes.number,
      videoClips: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        startTime: PropTypes.number,
        endTime: PropTypes.number,
        caption: PropTypes.string,
      })),
    }).isRequired,
    request: PropTypes.object.isRequired,
    onCopy: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  state = {
    clips: [],
    clipPage: 1,
    isFetching: false,
    isCopying: false,
  }

  renderClips = () => {
    const { data } = this.props
    const { clips, clipPage, isFetching } = this.state

    if (isFetching) {
      return <p>Fetching clips</p>
    }

    if (!clips.length) {
      return <p>No clip</p>
    }

    return (
      <Fragment>
        <ul>
          {clips.map(item => (
            <li key={item.id} onClick={() => this.handleClipClick(item)}>
              <span>{(item.startTime / 1000).toFixed(3)}s</span>
              -
              <span>{(item.endTime / 1000).toFixed(3)}s</span>
              {item.caption}
            </li>
          ))}
        </ul>
        <Pagination
          current={clipPage}
          total={data.videoClipsCount}
          pageSize={PAGE_SIZE}
          onChange={this.handleClipPageChange}
        />
      </Fragment>
    )
  }

  handleCopy = async e => {
    const { data, request, onCopy, onError } = this.props
    const { isCopying } = this.state
    const type = e.target.innerHTML.split(' ').pop().toLowerCase()

    if (type === 'clips') {
      if (isCopying) {
        return false
      }

      this.setState({ isCopying: true })
      try {
        const res = await request.get(
          `/video/${data.id}?page=1&page_size=${data.videoClipsCount}`
        )
        const clips = res.video.videoClips
          .map(item => `VideoClip(id=${item.id}): ${item.caption}`)
          .join('\n')
        onCopy(
          `Video(id=${data.id}): ${data.filename}\n${clips}`
        )
      } catch (error) {
        onError(error)
      } finally {
        this.setState({ isCopying: false })
      }
    } else {
      const contents = {
        id: data.id,
        name: data.filename,
      }

      onCopy(contents[type] || '')
    }
  }

  handleClipPageChange = async page => {
    const { data, request, onError } = this.props
    const { clipPage, isFetching } = this.state
    if (clipPage === page || isFetching) {
      return false
    }

    this.setState({ clipPage: page, isFetching: true })
    try {
      const res = await request.get(
        `/video/${data.id}?page=${page}&page_size=${PAGE_SIZE}`
      )
      this.setState({ clips: res.video.videoClips })
    } catch (error) {
      onError(error)
    } finally {
      this.setState({ isFetching: false })
    }
  }

  handleClipClick = clip => {
    this.video.currentTime = clip.startTime / 1000
    this.video.play()
  }

  componentDidMount() {
    const { data } = this.props
    if (data.videoClips && data.videoClips.length) {
      this.setState({ clips: data.videoClips })
    }
  }

  render() {
    const { data } = this.props
    const { clips, isCopying } = this.state
    const date = data.createdAt
      ? dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')
      : null

    return (
      <div className="search-item video">
        <p>{date} {data.id}</p>
        <p>{data.filename}</p>
        <div className="search-item-video">
          <div className="left">
            <video
              ref={video => this.video = video}
              src={data.url}
              controls
            />
            <div className="search-item-buttons">
              {clips.length > 0 &&
                <span
                  className={isCopying && 'loading'}
                  onClick={this.handleCopy}
                >
                  Copy Clips
                </span>
              }
              <span onClick={this.handleCopy}>Copy Name</span>
              <span onClick={this.handleCopy}>Copy ID</span>
            </div>
          </div>
          <div className="right">{this.renderClips()}</div>
        </div>
      </div>
    )
  }
}
