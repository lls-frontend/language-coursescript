'use babel'

import { CompositeDisposable } from 'atom'
import Url from 'url'
import LanguageCoursescriptView from './language-coursescript-view'

export default {
  coursescriptEditor: null,
  languageCoursescriptView: null,
  subscriptions: null,
  showViewPromise: null,

  activate(state) {
    this.coursescriptEditor = atom.workspace.getActiveTextEditor()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'language-coursescript:insert-id': () => this.insertID(),
      'language-coursescript:preview': () => this.preview()
    }))

    this.subscriptions.add(atom.workspace.addOpener(url => this.opener(url)))

    this.coursescriptEditor.onDidSave(e => {
      if (this.showViewPromise) {
        this.preview()
      }
    })

    window.addEventListener('message', e => {
      if (!e.data) {
        return false
      }

      const line = e.data[0]
      this.coursescriptEditor.setCursorBufferPosition([line - 1, 0])
    }, false)
  },

  deactivate() {
    this.subscriptions.dispose();
    this.languageCoursescriptView.destroy();
  },

  insertID() {
    const id = (new Date).getTime() * 1000 + window.performance.now() * 1000
    const editor = atom.workspace.getActivePaneItem()
    editor.insertText(id.toString())
  },

  preview() {
    if (this.coursescriptEditor) {
      const title = this.coursescriptEditor.getTitle().split('.')
      const fileType = title[title.length - 1]
      if (fileType !== 'course') {
        return false
      }

      this.showView(this.coursescriptEditor.getText())
    }
  },

  showView(text) {
    if (!this.showViewPromise) {
      this.showViewPromise = atom.workspace.open('coursescript://preview', { split: 'right', activatePane: false })
        .then(languageCoursescriptView => {
          if (languageCoursescriptView) {
            this.languageCoursescriptView = languageCoursescriptView
            this.languageCoursescriptView.setView(text)
          }
        })
    } else {
      this.showViewPromise = this.showViewPromise.then(() => this.languageCoursescriptView.setView(text))
    }
  },

  opener(url) {
    if (Url.parse(url).protocol === 'coursescript:') {
      const languageCoursescriptView = new LanguageCoursescriptView(url)

      languageCoursescriptView.onDidPaneDestroy(() => {
        this.showViewPromise = null
      })

      return languageCoursescriptView
    }
  }
}
