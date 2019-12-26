"use babel";

import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { stringify } from "query-string";
import apiUrls from "../api-urls.js";
// import Filter from './Filter.jsx';
import ResourceFilter from "./ResourceFilter.jsx";
import PictureItem from "./PictureItem.jsx";
import AudioItem from "./AudioItem.jsx";
import VideoItem from "./VideoItem.jsx";
import Pagination from "./Pagination.jsx";

const PAGE_SIZE = 25;

const SearchTypeMap = {
  ID: "id",
  VideoID: "id",
  ClipID: "clipId",
  Filename: "filename",
  Text: "text"
};

const AssetTypeMap = {
  Pictures: "picture",
  Audios: "audio",
  Videos: "video",
  "Streaming Videos": "aix_video_new"
};

const request = axios.create({ baseURL: apiUrls.asset });
request.interceptors.response.use(
  res => res.data.msg,
  error => {
    const {
      response: { data, statusText }
    } = error;

    return Promise.reject(new Error(data.msg || statusText));
  }
);

const bffRequest = axios.create({ baseURL: apiUrls.bffAsset + "assets" });
bffRequest.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      return res.data.msg;
    }

    throw new Error(res.data.msg);
  },
  error => {
    const {
      response: { data, statusText }
    } = error;

    return Promise.reject(new Error(data.msg || statusText));
  }
);

export default class Search extends Component {
  static propTypes = {
    focus: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  state = {
    filter: {},
    sources: [],
    result: { list: [], count: 0 },
    error: "",
    page: 1,
    showResults: false,
    showCopied: false,
    isFetching: false
  };

  renderResults = () => {
    const { onError } = this.props;
    const {
      filter: { resourceType },
      result,
      error,
      showResults,
      isFetching
    } = this.state;

    if (!showResults) {
      return null;
    }

    if (isFetching) {
      return <p className="search-text">Search...</p>;
    }

    if (error) {
      return <p className="search-text">ERROR: {error}</p>;
    }

    if (result.count === 0) {
      return <p className="search-text">Resource not found</p>;
    }

    return (
      <div className="search-results">
        {result.list.map((item, i) => {
          switch (resourceType) {
            case "Pictures":
              return (
                <PictureItem key={i} data={item} onCopy={this.handleCopy} />
              );
            case "Audios":
            case "Scorer":
              return <AudioItem key={i} data={item} onCopy={this.handleCopy} />;
            case "Videos":
            case "Streaming Videos":
              const props = {
                key: i,
                data: item,
                request: bffRequest,
                onError,
                onCopy: this.handleCopy
              };
              return <VideoItem {...props} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  fetch = async (page, { resourceType, searchType, source, search }) => {
    this.setState({ isFetching: true, showResults: true, error: "" });
    try {
      if (resourceType === "Pictures" && searchType === "ClipID") {
        const res = await request.get(`/picture/${search}`);
        this.setState({
          result: {
            list: res.picture ? [res.picture] : [],
            count: res.picture ? 1 : 0
          }
        });
        return;
      }

      if (resourceType === "Videos" && searchType === "VideoID") {
        const res = await request.get(`/video/${search}`);
        this.setState({
          result: {
            list: res.video ? [res.video] : [],
            count: res.video ? 1 : 0
          }
        });
        return;
      }

      const baseQuery = {
        page,
        page_size: PAGE_SIZE,
        query: search,
        is_tts: resourceType === "Audios" ? -1 : undefined,
        is_delite: resourceType === "Audios" ? -1 : undefined
      };

      if (searchType === "Filename") {
        const res = await request.get(
          `/${resourceType.toLowerCase()}?${stringify({
            ...baseQuery,
            source
          })}`
        );
        this.setState({
          result: {
            list: res[resourceType.toLowerCase()],
            count: res.count
          }
        });
        return;
      }

      const res = await request.get(
        `/search_${resourceType === "Videos" ? "video" : ""}clips?${stringify({
          ...baseQuery,
          source: searchType === "ClipID" ? undefined : source,
          id: searchType === "ClipID" || undefined
        })}`
      );
      const clips = res[resourceType === "Videos" ? "videoClips" : "clips"];

      if (resourceType === "Videos") {
        const services = clips
          .reduce(
            (res, item) =>
              res.includes(item.videoID) ? res : [...res, item.videoID],
            []
          )
          .map(item => request.get(`/video/${item}`));
        const videos = await Promise.all(services);
        this.setState({
          result: {
            list: videos.map(item => item.video),
            count: res.count
          }
        });
        return;
      }

      this.setState({ result: { list: clips, count: res.count } });
    } catch (error) {
      this.setState({ error: error.message, result: { list: [], count: 0 } });
    } finally {
      this.setState({ isFetching: false });
    }
  };

  fetchResource = async (page, filter) => {
    const {
      source,
      resourceType,
      searchType,
      search,
      audioType,
      audioGender
    } = filter;
    this.setState({ isFetching: true, showResults: true, error: "" });

    try {
      // ID 、VideoID 搜索的是资源
      // clipId、text 搜索的是 clips
      const isSearchClips = ["clipId", "text"].includes(
        SearchTypeMap[searchType]
      );
      // || (resourceType === 'Audios' && audioGender !== 'All');

      const commonQuery = {
        page,
        page_size: PAGE_SIZE,
        source: source.replace(/\s+/g, ""),
        search,
        audio_type: audioType,
        orientation: "All",
        locale: "All",
        compress_failed: false,
        score_failed: false,
        type: AssetTypeMap[resourceType],
        search_type: SearchTypeMap[searchType],
        gender: audioGender || "All"
      };

      // https://wiki.liulishuo.work/display/PLAT/CMS+-+Asset#getassets
      const funcMap = {
        Pictures: async () =>
          bffRequest.get(`/picture?${stringify(commonQuery)}`),
        Audios: isSearchClips
          ? async () => bffRequest.get(`/audio/clips?${stringify(commonQuery)}`)
          : async () => bffRequest.get(`/audio?${stringify(commonQuery)}`),
        Videos: isSearchClips
          ? async () => bffRequest.get(`/video/clips?${stringify(commonQuery)}`)
          : async () => bffRequest.get(`/video?${stringify(commonQuery)}`),
        "Streaming Videos": async () =>
          bffRequest.get(`/aix_video_new?${stringify(commonQuery)}`),
        Scorer: isSearchClips
          ? async () => bffRequest.get(`/score/clips?${stringify(commonQuery)}`)
          : async () => bffRequest.get(`/score?${stringify(commonQuery)}`)
      };

      const servise = funcMap[resourceType];
      const res = await servise();

      this.setState({
        result: {
          list: res.list || [],
          count: res.total
        }
      });
    } catch (error) {
      this.setState({ error: error.message, result: { list: [], count: 0 } });
    } finally {
      this.setState({ isFetching: false });
    }
  };

  fetchSources = async () => {
    try {
      const sources = await request.get("/sources");
      this.setState({
        sources: [
          "All",
          ...sources.filter(item => item !== "All" && item !== "None"),
          "None"
        ]
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleSearch = async filter => {
    this.fetchResource(1, filter);
    this.setState({ filter, page: 1 });
  };

  handlePage = page => {
    const { filter } = this.state;
    this.fetchResource(page, filter);
    this.setState({ page });
  };

  handleCopy = text => {
    const { onCopy } = this.props;

    onCopy(text);

    this.setState({ showCopied: true });
    setTimeout(() => {
      this.setState({ showCopied: false });
    }, 1000 * 1.5);
  };

  handleClose = () => this.props.onClose();

  componentDidMount() {
    this.fetchSources();
  }

  render() {
    const { focus } = this.props;
    const { sources, page, result, showCopied } = this.state;

    return (
      <div className="search">
        <ResourceFilter
          sources={sources}
          focus={focus}
          onSearch={this.handleSearch}
        />
        {this.renderResults()}
        {result.count > PAGE_SIZE && (
          <Pagination
            current={page}
            total={result.count}
            pageSize={PAGE_SIZE}
            onChange={this.handlePage}
          />
        )}
        <div className={`copy-feedback ${showCopied ? "show" : ""}`}>
          <i />
          <span>Copied to clipboard</span>
        </div>
        <button
          type="button"
          className="search-close"
          onClick={this.handleClose}
        />
      </div>
    );
  }
}
