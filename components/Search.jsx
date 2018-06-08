'use babel'

import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import SearchItem from './SearchItem.jsx'

const types = [
  { name: 'Picture', value: 'pic' },
  { name: 'Video', value: 'video' },
  { name: 'Audio', value: 'audio' },
]

export default class Search extends React.Component {
  static propTypes = {
    onCopy: PropTypes.func.isRequired
  }

  state = {
    type: types[0].value,
    search: '',
    error: '',
    results: [],
    showTypes: false,
    showResults: false,
    isFetching: false,
  }

  typeItem = (item, index) => {
    return <li key={index} onClick={() => this.handleTypeChange(item)}>{item.name}</li>
  }

  searchItem = (item, index) => {
    const { type } = this.state
    return <SearchItem key={index} data={item} type={type} onCopy={this.handleCopy} />
  }

  renderResults = () => {
    const { isFetching, error, results } = this.state

    if (isFetching) {
      return <p>Search...</p>
    }

    if (error) {
      return <p>ERROR: {error}</p>
    }

    if (!results.length) {
      return <p>Resource not found</p>
    }

    return results.map(this.searchItem)
  }

  handleSearch = async () => {
    const { search, type } = this.state
    if (!search) {
      return false
    }

    try {
      this.setState({ showResults: true, isFetching: true })

      const { data } = await axios.get(`https://cms.llsapp.com/v1/asset/${type}/search?content=${search}`)

      this.setState({ results: data, isFetching: false })
    } catch (error) {
      this.setState({ isFetching: false, error: error.message })
    }
  }

  handleTypeChange = item => {
    this.setState({ type: item.value, showTypes: false })
  }

  handleTypeClick = () => {
    const { showTypes } = this.state
    this.setState({ showTypes: !showTypes })
  }

  handleInputChange = e => {
    this.setState({ search: e.target.value })
  }

  handleCopy = text => {
    this.props.onCopy(text)
  }

  componentDidMount() {
    this.input.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        this.handleSearch()
      }
    })
  }

  render() {
    const { type, search, error, results, showTypes, showResults, isFetching } = this.state
    const activeType = types.find(v => v.value === type)

    return (
      <div className="search">
        <div className="search-input">
          <div className="search-input-types">
            <p onClick={this.handleTypeClick}>{activeType.name}</p>
            <ul className={showTypes ? 'show' : ''}>{types.map(this.typeItem)}</ul>
          </div>
          <input
            ref={input => this.input = input}
            className="native-key-bindings"
            type="text"
            placeholder="Search"
            value={search}
            onChange={this.handleInputChange}
          />
          <i onClick={this.handleSearch}></i>
        </div>
        {showResults && <div className="search-result">{this.renderResults()}</div>}
      </div>
    )
  }
}
