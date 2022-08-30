import events from '/static/html/components/lib-markdown/external/events.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import Codemirror from '/static/html/components/component_modules/codemirror/codemirror.mjs'
export default async (v,p,c,obj,r) => {
  store({
    input:'page-scroll',
    this:obj['this'],
    obj: obj,
    type:'obj'
  }, 'set', 'type')


  let codemirror = new (await Codemirror({_:'codemirror', this:obj.this.shadowRoot}))['class']()
  let editor = await codemirror.init({_:'init', mode:'javascript',this:obj.this.shadowRoot.querySelector('#code')})
  let btnsearch = obj.this.shadowRoot.querySelector('#search'),
    fnext = obj.this.shadowRoot.querySelector('#fnext'),
    fprev = obj.this.shadowRoot.querySelector('#fprev'),
    repl = obj.this.shadowRoot.querySelector('#replace'),
    replall = obj.this.shadowRoot.querySelector('#replall'),
    goto = obj.this.shadowRoot.querySelector('#goto'),
    undo = obj.this.shadowRoot.querySelector('#undo'),
    redo = obj.this.shadowRoot.querySelector('#redo'),
    save = obj.this.shadowRoot.querySelector('#save'),
    getLast = obj.this.shadowRoot.querySelector('#getLast'),
    run = obj.this.shadowRoot.querySelector('#run'),
    result  = obj.this.shadowRoot.querySelector('#result'),
    script =  obj.this.shadowRoot.querySelector('#script');


  let codemirrorResult = new (await Codemirror({_:'codemirror', this:obj.this.shadowRoot}))['class']()
  let editorResult = await codemirror.init({_:'init',mode:'application/json', this:obj.this.shadowRoot.querySelector('#result')})
  // let ST = await Stjs.ST({_:'ST', this:obj['this']})

  // let json = new (await Json())['class']()

  // console.assert(false)
  // let selected = await json.select(data)
  // let jsonTemplate = await json.transformWith(template, false, selected)
  // console.assert(false, jsonTemplate)
  // let root = await json.root(jsonTemplate)
  // console.assert(false,root)
  // JSON.stringify($scope.code, null, 4);
  //  objects = sel.objects();
  // console.assert(false, objects)


  editor.editor.on('drop', function(data, e) {
    var file;
    var files;
    // Check if files were dropped
    files = e.dataTransfer.files;
    if (files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      file = files[0];
      alert('File: ' + file.name);
      return false;
    }
  })
  btnsearch.addEventListener('click', function() {
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
  save.addEventListener('click', function(){
    let value = editor.editor.getValue()
    sessionStorage.setItem('CodeMirror', value);

    // ST.select(data)
    //     .transformWith(template)
    //     .root()
  },false);
  getLast.addEventListener('click', function(){
    let value = sessionStorage.getItem('CodeMirror');
    editor.editor.setValue(value)
  },false);
  run.addEventListener('click', async ()=>{
    let value = editor.editor.getValue()
    let runScript = document.createElement('script');
    runScript.type = 'module';

    // let result = document.body.querySelector('codemirror-main').shadowRoot.querySelector('#result')
    // result.innerHTML = object

    let test = `
(async ()=>{
    ${value}
    let verifyData = false;
    let verifyTemplate = false;
    if(typeof data !== "undefined"){
        verifyData = true;
    }
    if(typeof template !== "undefined"){
        verifyTemplate = true
    }
    if(verifyData === true && verifyTemplate === true){

        document.dispatchEvent(new CustomEvent('CodeMirror', {
            detail: {
                _:'transform',
                data:data,
                template:template
            }
        }))
    }else{

        document.dispatchEvent(new CustomEvent('CodeMirror', {
            detail: {
                _:'response',
                data:${value}
            }
        }))
        
    }
})()`;
    runScript.innerHTML = test
    script.appendChild(runScript)

  },false);

  document.addEventListener('CodeMirror',async (event)=>{
    if(event.detail._ === 'transform'){
      // let selected = await json.select(event.detail.data)
      // let jsonTemplate = await json.transformWith(event.detail.template, false, selected)
      // let root = await json.root(jsonTemplate)
      editorResult.editor.setValue(JSON.stringify(root,null, 4))

    }else{
      editorResult.editor.setValue(`${event.detail.data()}`)
    }

    script.innerHTML = ''
  })
  // console.assert(false, editor)
  // await Menu(obj)
  // await monopoly(obj)

}