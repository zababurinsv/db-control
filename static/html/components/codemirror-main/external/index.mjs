import events from '/static/html/components/lib-markdown/external/events.mjs'
import Codemirror from '/static/html/components/component_modules/codemirror/codemirror.mjs'
export default async (v,p,c,obj,r) => {

    let codemirror = new (await Codemirror({_:'codemirror', this:obj.this.shadowRoot}))['class']()
    let editor = await codemirror.init({_:'init', mode:'javascript',this:obj.this.shadowRoot.querySelector('#code')})
    let btnsearch = obj.this.shadowRoot.querySelector('#search'),
      fnext = obj.this.shadowRoot.querySelector('#fnext'),
      fprev = obj.this.shadowRoot.querySelector('#fprev'),
      repl = obj.this.shadowRoot.querySelector('#replace'),
      replall = obj.this.shadowRoot.querySelector('#replall'),
      goto = obj.this.shadowRoot.querySelector('#goto'),
      undo = obj.this.shadowRoot.querySelector('#undo'),
      redo = obj.this.shadowRoot.querySelector('#redo')


    // codemirror.self.CodeMirror.change = async (instance, changeObj) => {
    //         console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>',instance, changeObj)
    // }
    // codemirror.self.CodeMirror.changes = async (from, to, text, removed, origin) => {
    //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>',from, to, text, removed, origin)
    // }
    btnsearch.addEventListener('click', function() {
      console.log('##############',{
        editor:editor,
        "editor.editor":editor.editor,
        "codemirror.self": codemirror.self
      })
        codemirror.self.CodeMirror.commands.find(editor.editor)
    }, false);
    fnext.addEventListener('click', function() {
        codemirror.self.CodeMirror.commands.findNext(editor.editor);
    }, false);
    fprev.addEventListener('click', function() {
        codemirror.self.CodeMirror.commands.findPrev(editor.editor);
    }, false);
    repl.addEventListener('click', function() {
        codemirror.self.CodeMirror.commands.replace(editor.editor);
    }, false);
    replall.addEventListener('click', function() {
        codemirror.self.CodeMirror.commands.replaceAll(editor.editor);
    }, false);
    goto.addEventListener('click', function() {
        codemirror.self.CodeMirror.commands.jumpToLine(editor.editor);
    }, false);
    undo.addEventListener('click', function(){
        editor.editor.undo();
    }, false);
    redo.addEventListener('click', function(){
        editor.editor.redo();
    },false);
}
