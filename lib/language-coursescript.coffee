{CompositeDisposable} = require 'atom'
module.exports = InsertID =
  InsertIDView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    atom.commands.add 'atom-text-editor', 'language-coursescript:insert-id': => @InsertID()


  InsertID: ->
    id = (new Date).getTime() * 1000 + window.performance.now() * 1000
    editor = atom.workspace.getActivePaneItem()
    editor.insertText(id.toString())
