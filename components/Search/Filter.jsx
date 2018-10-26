'use babel'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

const resourceTypes = ['Pictures', 'Audios', 'Videos']
const tags = ['All', 'OCC', 'BE', 'Pilot', 'Darwin', 'Phonics']
const searchTypes = ['ID', 'Filename', 'Text']

export default class Filter extends Component {
  static propTypes = {
    focus: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  state = {
    resourceType: resourceTypes[0],
    tag: tags[0],
    searchType: searchTypes[0],
    search: '',
    showTagsDropdown: false,
  }

  handleResourceTypeChange = (e) => {
    const { searchType } = this.state
    const { value } = e.target
    const changed =
      (value === "Pictures" && searchType === "Text") ||
      (value === "Audios" && searchType === "Filename")
        ? searchTypes[0]
        : searchType

    this.setState({
      resourceType: value,
      searchType: changed,
      showTagsDropdown: false
    })
  }

  handleTagClick = () => {
    const { showTagsDropdown } = this.state
    this.setState({ showTagsDropdown: !showTagsDropdown })
  }

  handleTagChange = (e) => {
    const { resourceType, searchType, tag, search } = this.state
    const value = e.target.innerHTML
    if (search) {
      this.props.onSearch({ resourceType, searchType, tag: value, search })
    }

    this.setState({ tag: value, showTagsDropdown: false })
  }

  handleInputChange = e => {
    this.setState({ search: e.target.value })
  }

  handleSearchTypeChange = (e) => {
    this.setState({ searchType: e.target.value, showTagsDropdown: false })
  }

  handleSearch = () => {
    const { resourceType, searchType, tag, search } = this.state
    if (!search) {
      return false
    }

    this.props.onSearch({ resourceType, searchType, tag, search })
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleSearch()
    }
  }

  componentDidMount() {
    this.input.addEventListener('keydown', this.handleKeyDown)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.focus && this.props.focus) {
      this.input.focus()
    }
  }

  componentWillUnmount() {
    this.input.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    const {
      resourceType,
      tag,
      searchType,
      search,
      showTagsDropdown
    } = this.state

    return (
      <div>
        <div className="search-radios">
          <div className="search-resources">
            {resourceTypes.map(item =>
              <label key={item}>
                <input
                  type="radio"
                  name="resourceType"
                  value={item}
                  checked={item === resourceType}
                  onChange={this.handleResourceTypeChange}
                /> {item}
              </label>
            )}
          </div>
          <div className="search-types">
            {searchTypes.map(item => {
              if (
                (resourceType === "Pictures" && item === "Text") ||
                (resourceType === "Audios" && item === "Filename")
              ) {
                return null
              }

              return (
                <label key={item}>
                  <input
                    type="radio"
                    name="searchType"
                    value={item}
                    checked={item === searchType}
                    onChange={this.handleSearchTypeChange}
                  /> {item}
                </label>
              )
            })}
          </div>
        </div>
        <div className="search-input">
          <div
            className={`search-input-tags ${searchType === 'Filename' && 'show'}`}
          >
            <p onClick={this.handleTagClick}>{tag}</p>
            <ul className={showTagsDropdown ? 'show' : ''}>
              {tags.map(item => (
                <li
                  key={item}
                  className={item === tag ? 'active' : ''}
                  onClick={this.handleTagChange}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <input
            ref={input => this.input = input}
            className="native-key-bindings"
            type="text"
            placeholder="Search"
            tabIndex="1"
            value={search}
            onChange={this.handleInputChange}
          />
          <i onClick={this.handleSearch}></i>
        </div>
      </div>
    )
  }
}
