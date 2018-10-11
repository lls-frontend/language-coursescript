'use babel'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import SearchList from './SearchList.jsx'

const types = [
  { name: 'Picture', value: 'pics' },
  { name: 'Video', value: 'videos' },
  { name: 'Audio', value: 'audios' },
]

const querySchema = {
  GET_PICS: gql`
    query pics($content: String!, $page: Int!, $limit: Int!) {
      pics(content: $content, page: $page, limit: $limit) {
        resource_id
        origin_filename
        url
        created_at_sec
      }
    }
  `,
  GET_VIDEOS: gql`
    query videos($content: String!, $page: Int!, $limit: Int!) {
      videos(content: $content, page: $page, limit: $limit) {
        resource_id
        origin_filename
        filename
        url
        clips {
          resource_id
          text
          start_at
        }
        created_at_sec
      }
    }
  `,
  GET_AUDIOS: gql`
    query audios($content: String!, $page: Int!, $limit: Int!) {
      audios(content: $content, page: $page, limit: $limit) {
        resource_id
        text
        url
        created_at_sec
      }
    }
  `
}

class Search extends Component {
  static propTypes = {
    focus: PropTypes.bool.isRequired,
    onCopy: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    type: types[0].value,
    query: querySchema[`GET_${types[0].value.toUpperCase()}`],
    search: '',
    content: '',
    page: 1,
    showTypes: false,
    showResults: false,
  }

  handleSearch = () => {
    const { search } = this.state
    if (!search) {
      return false
    }

    this.setState({ content: search, page: 1, showResults: true })
  }

  handleTypeChange = item => {
    this.setState({
      type: item.value,
      query: querySchema[`GET_${item.value.toUpperCase()}`],
      search: '',
      content: '',
      page: 1,
      showTypes: false,
      showResults: false,
    })
  }

  handleTypeClick = () => {
    const { showTypes } = this.state
    this.setState({ showTypes: !showTypes })
  }

  handleInputChange = e => {
    this.setState({ search: e.target.value })
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleSearch()
    }
  }

  handleResults = ({ loading, error, data }) => {
    if (loading) {
      return <p className="search-text">Search...</p>
    }

    if (error) {
      return <p className="search-text">ERROR: {error.message}</p>
    }

    const { type, page } = this.state
    const res = data[type]
    if (!res.length && page === 1) {
      return <p className="search-text">Resource not found</p>
    }

    const props = {
      type,
      page,
      data: res,
      onCopy: this.props.onCopy,
      onPrev: this.handlePrev,
      onNext: this.handleNext,
    }

    return <SearchList {...props} />
  }

  handlePrev = () => {
    const { page } = this.state
    if (page === 1) {
      return false
    }
    this.setState({ page: page - 1 })
  }

  handleNext = () => {
    const { page } = this.state
    this.setState({ page: page + 1 })
  }

  handleClose = () => {
    this.props.onClose()
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
    const { type, search, content, query, page, showTypes, showResults } = this.state
    const activeType = types.find(v => v.value === type)

    return (
      <div className="search">
        <div className="search-input">
          <div className="search-input-types">
            <p onClick={this.handleTypeClick}>{activeType.name}</p>
            <ul className={showTypes ? 'show' : ''}>
            {
              types.map((item, index) => (
                <li key={index} onClick={() => this.handleTypeChange(item)}>
                  {item.name}
                </li>
              ))
            }
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
        {showResults && (
          <Query query={query} variables={{ content, page, limit: 25 }}>
            {this.handleResults}
          </Query>
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

const client = new ApolloClient({
  uri: 'https://cms.llsapp.com/v1/graphql/asset'
})

const App = props => (
  <ApolloProvider client={client}>
    <Search {...props} />
  </ApolloProvider>
)

App.propTypes = {
  onCopy: PropTypes.func.isRequired
}

export default App
