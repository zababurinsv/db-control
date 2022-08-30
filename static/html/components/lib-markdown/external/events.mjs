export default async (v,p,c,obj,r) => {
  // obj.system.worker_main['markdown__string_menu_codemirror_search'].addEventListener('click', function() {
  //  console.log('~~~~~~~~~~~~~~',  p)
    // p.execCommand("find")
  // }, false);
  // obj.system.worker_main['markdown__string_menu_codemirror_fnext'].addEventListener('click', function() {
    // p.commands.findNext(p.editor);
    // p.execCommand("findNext")
  // }, false);
  // obj.system.worker_main['markdown__string_menu_codemirror_fprev'].addEventListener('click', function() {
    // p.commands.findPrev(p.editor);
  // }, false);
  // obj.system.worker_main['markdown__string_menu_codemirror_replace'].addEventListener('click', function() {
    // p.execCommand("replace")
    // p.commands.replace(p.editor);
  // }, false);
  // obj.system.worker_main['markdown__string_menu_codemirror_replall'].addEventListener('click', function() {
    // p.commands.replaceAll(p.editor);
  // }, false);
  // obj.system.worker_main['markdown__string_menu_codemirror_goto'].addEventListener('click', function() {
    // p.commands.jumpToLine(p.editor);
  // }, false);
  obj.system.worker_main['markdown__string_menu_codemirror_undo'].addEventListener('click', function(){
    p.undo();
  }, false);
  obj.system.worker_main['markdown__string_menu_codemirror_redo'].addEventListener('click', function(){
    p.redo();
  },false);
}