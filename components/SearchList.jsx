'use babel'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchItem from './SearchItem.jsx'

export default class SearchList extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    page: PropTypes.number.isRequired,
    onCopy: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
  }

  state = {
    noMorePage: false
  }

  handleNext = () => {
    if (this.state.noMorePage) {
      return false
    }
    this.props.onNext()
  }

  componentDidMount() {
    const { data, onPrev } = this.props
    if (data.length < 25) {
      this.setState({ noMorePage: true })
      if (data.length === 0) {
        onPrev()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { data, page } = this.props
    if (page < prevProps.page && prevProps.data.length) {
      this.setState({ noMorePage: false })
    }
    if (data.length < 25 && !this.state.noMorePage) {
      this.setState({ noMorePage: true })
    }
  }

  render() {
    const { type, data, page, onCopy, onPrev } = this.props
    const { noMorePage } = this.state

    return (
      <div>
        <div className="search-results">
        {
          data.map(item => (
            <SearchItem key={item.id} data={item} type={type} onCopy={onCopy} />
          ))
        }
        </div>
        <ul className="search-pagination">
          <li className={page === 1 ? 'disabled' : ''} onClick={onPrev}>{`<<`} Previous</li>
          <li className={noMorePage ? 'disabled' : ''} onClick={this.handleNext}>Next >></li>
        </ul>
      </div>
    )
  }
}
