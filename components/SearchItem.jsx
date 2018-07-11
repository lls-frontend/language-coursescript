'use babel'

import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const SearchItem = props => {
  const { data, type, onCopy } = props

  const copyButton = (
    <div className="search-item-buttons">
      {type === 'videos' && data.clips && data.clips.length > 0 &&
        <span onClick={() => handleCopy('clips')}>Copy Clips</span>
      }
      <span onClick={() => handleCopy('name')}>Copy name</span>
      <span onClick={() => handleCopy('id')}>Copy id</span>
    </div>
  )

  const handleCopy = field => {
    let text = data.resource_id
    if (field === 'name') {
      text = data.origin_filename || data.text
    } else if (field === 'clips') {
      text = `Video(id=${data.resource_id}): ${data.filename}\n` + data.clips.map(item => (
        `VideoClip(id=${item.resource_id}): ${item.spoken_text}`
      )).join('\n')
    }

    onCopy(text)
  }

  const handleClipClick = clip => {
    const time = clip.start_at / 1000
    this.video.currentTime = time
    this.video.play()
  }

  const renderVideoClips = videoClips => {
    const clips = videoClips && videoClips.length ? videoClips.sort(((a, b) => {
      if (a.start_at > b.start_at) return 1
      if (a.start_at < b.start_at) return -1
      return 0
    })) : []

    return clips.map(item => {
      return (
        <li key={item.resource_id} onClick={() => handleClipClick(item)}>
          {item.spoken_text}
        </li>
      )
    })
  }

  const date = data.created_at_sec
    ? dayjs(data.created_at_sec * 1000).format('YYYY-MM-DD HH:mm')
    : null

  switch (type) {
    case 'pics':
      return (
        <div className="search-item pic">
          <div className="left">
            <img src={data.url} alt=""/>
          </div>
          <div className="right">
            <p>{date}</p>
            <p>{data.origin_filename}</p>
            {copyButton}
          </div>
        </div>
      )
    case 'videos':
      return (
        <div className="search-item video">
          <p>{date} {data.origin_filename}</p>
          <div className="search-item-video">
            <div className="left">
              <video ref={video => this.video = video} src={data.url} controls></video>
              {copyButton}
            </div>
            <ol className="right">{renderVideoClips(data.clips)}</ol>
          </div>
        </div>
      )
    case 'audios':
      return (
        <div className="search-item audio">
          <p>{date}</p>
          <p>{data.text}</p>
          <div className="search-item-audio">
            <audio src={data.url} controls></audio>
            {copyButton}
          </div>
        </div>
      )
    default:
      return null
  }
}

SearchItem.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    resource_id: PropTypes.string.isRequired,
    text: PropTypes.string,
    origin_filename: PropTypes.string,
  })).isRequired,
  type: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
}

export default SearchItem
