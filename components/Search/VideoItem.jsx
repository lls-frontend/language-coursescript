"use babel";

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { CDN_URL } from "../const";
import Pagination from "./Pagination.jsx";

const PAGE_SIZE = 20;

export default class VideoItem extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string,
      fileName: PropTypes.string,
      url: PropTypes.string,
      source: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      clipsCount: PropTypes.number,
      clips: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          startTime: PropTypes.number,
          endTime: PropTypes.number,
          text: PropTypes.string
        })
      )
    }).isRequired,
    request: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  state = {
    clips: [],
    clipPage: 1,
    isFetching: false,
    isCopying: false
  };

  renderClips = () => {
    const { data } = this.props;
    const { clips, clipPage, isFetching } = this.state;

    if (isFetching) {
      return <p>Fetching clips</p>;
    }

    if (!clips.length) {
      return <p>No clip</p>;
    }

    return (
      <Fragment>
        <ul>
          {clips.map(item => (
            <li key={item.id} onClick={() => this.handleClipClick(item)}>
              <span>{(item.startTime / 1000).toFixed(3)}s</span>-
              <span>{(item.endTime / 1000).toFixed(3)}s</span>
              {item.text}
            </li>
          ))}
        </ul>
        <Pagination
          current={clipPage}
          total={data.clipsCount}
          pageSize={PAGE_SIZE}
          onChange={this.handleClipPageChange}
        />
      </Fragment>
    );
  };

  handleCopy = async e => {
    const { data, request, onCopy, onError } = this.props;
    const { isCopying } = this.state;
    const type = e.target.innerHTML
      .split(" ")
      .pop()
      .toLowerCase();

    if (type === "clips") {
      if (isCopying) {
        return false;
      }

      this.setState({ isCopying: true });
      try {
        const res = await request.get(
          `/assets/video/${data.id}/clips?page=1&page_size=${data.clipsCount}`
        );
        const clips = res
          .map(item => `VideoClip(id=${item.id}): ${item.text}`)
          .join("\n");
        onCopy(`Video(id=${data.id}): ${data.fileName}\n${clips}`);
      } catch (error) {
        onError(error);
      } finally {
        this.setState({ isCopying: false });
      }
    } else {
      const contents = {
        id: data.id,
        name: data.fileName
      };

      onCopy(contents[type] || "");
    }
  };

  handleClipPageChange = async page => {
    const { data, request, onError } = this.props;
    const { clipPage, isFetching } = this.state;
    if (clipPage === page || isFetching) {
      return false;
    }

    this.setState({ clipPage: page, isFetching: true });
    try {
      const res = await request.get(
        `/assets/video/${data.id}/clips?page=${page}&page_size=${PAGE_SIZE}`
      );

      this.setState({ clips: res });
    } catch (error) {
      onError(error);
    } finally {
      this.setState({ isFetching: false });
    }
  };

  handleClipClick = clip => {
    this.video.currentTime = clip.startTime / 1000;
    this.video.play();
  };

  componentDidMount() {
    const { data } = this.props;
    if (data.clips && data.clips.length) {
      this.setState({ clips: data.clips });
    }
  }

  render() {
    const { data } = this.props;
    const { clips, isCopying } = this.state;

    const createdAt = data.createdAt
      ? dayjs(data.createdAt.slice(0, 39)).format("YYYY-MM-DD HH:mm")
      : "";
    const updatedAt = data.updatedAt
      ? dayjs(data.updatedAt.slice(0, 39)).format("YYYY-MM-DD HH:mm")
      : null;

    const url = data.url.startsWith("http")
      ? data.url
      : `${CDN_URL}${data.url}`;

    return (
      <div className="search-item video">
        {createdAt && <p>createdAt: {createdAt}</p>}
        {updatedAt && <p>updatedAt: {updatedAt}</p>}
        <p>{data.fileName}</p>
        {data.source && <p>{data.source}</p>}
        <div className="search-item-video">
          <div className="left">
            <video ref={video => (this.video = video)} src={url} controls />
            <div className="search-item-buttons">
              <p>Copy:</p>
              {clips.length > 0 && (
                <span
                  className={isCopying ? "loading" : undefined}
                  onClick={this.handleCopy}
                >
                  Clips
                </span>
              )}
              <span onClick={this.handleCopy}>Name</span>
              <span onClick={this.handleCopy}>ID</span>
            </div>
          </div>
          <div className="right">{this.renderClips()}</div>
        </div>
      </div>
    );
  }
}
