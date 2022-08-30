import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import queue from '/static/html/components/component_modules/queue/queue.mjs'
let Class = class Type {
    constructor(self) {
        this.button = this.button.bind(this)
        this.player = this.player.bind(this)
        this.end = this.end.bind(this)
        document.addEventListener('typeScript-end', this.end)
    }
    button(console = true,property='a',color = 'black', substrat={_:'button'},relation='button'  ){
        return queue(console, property,color,substrat,relation)
    }
    player(console = true,property='a',color = 'black', substrat={_:'player'},relation='player'  ){
        return queue(console, property,color,substrat,relation)
    }
    end(event){
        queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{

            colorlog(true, 'stat','stat',data, 'статистика')

        })
    }
    get self() {
        return object
    }
}


export default Class