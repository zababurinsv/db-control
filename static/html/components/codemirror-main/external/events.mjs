export default async (v,p,c,obj,r) => {
    
    
    // 
    // async function selected(event) {
        // event.preventDefault()
        // let md = await fetch(`${location.origin}/markdown/${event.target.value}.md`)  
        // md = await md.text()
        // self.innerText = md 
        // self.value = md
        // updateUI()
    // }
    // function download() {
        // let name = prompt('Введите название файла', 'default');
        // let dir = idbfs.FS.readdir("/data")  
        // let filename = `${name}.md`
        // let text = ''
        // if(dir.find(item => item === 'data.md')) {
            // text =  idbfs.FS.readFile("/data/data.md",{ encoding: "utf8" });
        // }
        // var element = document.createElement('a');
        // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        // element.setAttribute('download', filename);
        // element.style.display = 'none';
        // document.body.appendChild(element);
        // element.click();
        // document.body.removeChild(element);
    // }
    // function upload(event) {
        // console.log(event.path[0].files[0])
        // let reader = new FileReader();
        // reader.readAsText(event.path[0].files[0]);
// 
        // reader.onload = function() {
            // self.innerText = reader.result 
            // self.value = reader.result 
            // updateUI()
        //   };
        // 
        //   reader.onerror = function() {
            // console.log(reader.error);
        //   };
    // }
// 
    // obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
    // obj.this.shadowRoot.querySelector('.markdown__button_download').addEventListener("click", download);
    // obj.this.shadowRoot.querySelector('.markdown__button_upload').addEventListener("change", upload);
    // obj.this.shadowRoot.querySelector('.markdown__button_select').addEventListener("change", selected);
}