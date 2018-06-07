'use babel'

import React from 'react'

const types = [
  { name: 'Picture', value: 'pic' },
  { name: 'Video', value: 'video' },
  { name: 'Audio', value: 'audio' },
]

export default class Search extends React.Component {
  state = {
    type: types[0].value,
    search: '',
    showTypes: false
  }

  typeItem = (item, index) => {
    return <li key={index} onClick={() => this.handleTypeChange(item)}>{item.name}</li>
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

  handleSearch = () => {
    const { search } = this.state
    console.log(search)
  }

  componentDidMount() {
    this.input.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        this.handleSearch()
      }
    })
  }

  render() {
    const { type, search, showTypes } = this.state
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
      </div>
    )
  }
}
