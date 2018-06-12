'use babel'

import { Emitter } from 'atom'
import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/Search.jsx'

export default class LanguageCoursescriptSearch {
  constructor() {
    this.emitter = new Emitter()
    this.element = document.createElement('div')
    this.element.classList.add('language-coursescript-search')

    ReactDOM.render(<App onCopy={this.handleCopy.bind(this)} />, this.element)

    document.addEventListener('click', this.handleClose)
  }

  handleCopy(text) {
    atom.clipboard.write(text)
    this.emitter.emit('destroy')
  }

  handleClose = (e) => {
    if (!this.element.contains(e.target)) {
      this.emitter.emit('destroy')
    }
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element)
    this.element.remove()
    document.removeEventListener('click', this.handleClose)
  }

  onDestroy(cb) {
    this.emitter.on('destroy', cb)
  }

  getElement() {
    return this.element
  }
}
