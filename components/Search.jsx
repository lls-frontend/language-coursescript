'use babel'

import React from 'react'
import PropTypes from 'prop-types'
import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import SearchItem from './SearchItem.jsx'

const types = [
  { name: 'Picture', value: 'pics' },
  { name: 'Video', value: 'videos' },
  { name: 'Audio', value: 'audios' },
]

export default class Search extends React.Component {
  static propTypes = {
    onCopy: PropTypes.func.isRequired
  }

  state = {
    type: types[0].value,
    search: '',
    query: null,
    showTypes: false,
    showResults: false,
  }

  renderResults = (loading, error, data) => {
    if (loading) {
      return <p>Search...</p>
    }

    if (error) {
      return <p>ERROR: {error.message}</p>
    }

    const { type } = this.state
    const res = data[type]
    if (!res.length) {
      return <p>Resource not found</p>
    }

    return res.map((item, index) => (
      <SearchItem key={index} data={item} type={type} onCopy={this.props.onCopy} />
    ))
  }

  handleSearch = () => {
    const { search, type } = this.state
    if (!search) {
      return false
    }

    const query = gql`{
      ${type}(content: "${search}") {
        resource_id, filename, url
      }
    }`

    this.setState({ query, showResults: true })
  }

  handleTypeChange = item => {
    this.setState({ type: item.value, search: '', showTypes: false, showResults: false })
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

  componentDidMount() {
    this.input.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    this.input.removeEventListener('keydown', this.handleKeyDown)
  }

  render() {
    const { type, search, query, showTypes, showResults } = this.state
    const activeType = types.find(v => v.value === type)

    return (
      <div className="search">
        <div className="search-input">
          <div className="search-input-types">
            <p onClick={this.handleTypeClick}>{activeType.name}</p>
            <ul className={showTypes ? 'show' : ''}>
            {
              types.map((item, index) => (
                <li key={index} onClick={() => this.handleTypeChange(item)}>{item.name}</li>
              ))
            }
            </ul>
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
        {showResults && query && (
          <Query query={query}>
          {({ loading, error, data }) => (
            <div className="search-result">{this.renderResults(loading, error, data)}</div>
          )}
          </Query>
        )}
      </div>
    )
  }
}

const client = new ApolloClient({ uri: 'https://cms.llsapp.com/v1/graphql/asset' })

const App = props => (
  <ApolloProvider client={client}>
    <Search {...props} />
  </ApolloProvider>
)

App.propTypes = {
  onCopy: PropTypes.func.isRequired
}

export default App
