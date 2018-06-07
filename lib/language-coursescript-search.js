'use babel'

import { Emitter } from 'atom'
import React from 'react'
import ReactDOM from 'react-dom'
import Search from '../components/Search.jsx'

export default class LanguageCoursescriptSearch {
  constructor() {
    this.emitter = new Emitter()
    this.element = document.createElement('div')
    this.element.classList.add('language-coursescript-search')

    ReactDOM.render(<Search />, this.element)

    document.addEventListener('click', this.handleClose)
  }

  handleClose = e => {
    if (!this.element.contains(e.target)) {
      this.emitter.emit('willDestroy')
    }
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element)
    this.element.remove()
    document.removeEventListener('click', this.handleClose)
  }

  onWillDestroy(cb) {
    this.emitter.on('willDestroy', cb)
  }

  getElement() {
    return this.element
  }
}
