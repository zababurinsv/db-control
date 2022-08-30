export default (view, property, color, substrate, relation)=>{
    return  new Promise(async (resolve, reject) => {
        let colorMap = [
            'Aqua',
            'Black',
            'Blue',
            'fuchsia',
            'gray',
            'green',
            'lime',
            'maroon',
            'navy',
            'olive',
            'orange',
            'purple',
            'red',
            'silver',
            'teal',
            'yellow'
        ]
        
        let props = {}
        if(property === 'add your name'){
            props = 'add your name'
        }
        function options(view, property, color, substrate, relation){
           let options = ''
            for(let key in colorMap){
                if(property.color == key){
                    options = options + `<option selected="selected">${colorMap[key]}</option>`
                }else{
                    options = options + `<option>${colorMap[key]}</option>`
                }
            }
            return options
        }
        
        resolve(`
       <div id="player${substrate.id}input" class="player-input">
                    <label for="player${substrate.id}name" class="player-label">
                        <div class="option">
                            <input type="text" id="player${substrate.id}name" title="Player name" maxlength="16" class="player-input" placeholder="Player ${substrate.id}" />
                            <select id="player${substrate.id}color" title="Player color">
                                ${options(view, property, color, substrate, relation)}
                            </select>
                            <select id="player${substrate.id}ai" title="Choose whether this player is controled by a human or by the computer.">
                                <option value="0" selected="selected">Human</option>
                                <option value="1">AI (Test)</option>
                                <option value="2">Net</option>
                            </select>
                        </div>
                    </label>
                </div>
      `)
    })
}