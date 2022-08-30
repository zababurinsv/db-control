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
        if (relation === 'contract') {

            resolve(`
        <div class="item">
            <div class="info">
                <label for="name">
                    <p class="preview">Параметры Аккаунта</p>
                    <input id="name" type="text" placeholder="введите название аккаунта">
                    <div class="description">
                        <textarea class="description" placeholder="Description Account"></textarea>
                        <span class="symbol" >maximum symbols: 256</span>
                    </div>
                    <button  class="name">Run Test</button>
                </label>
            </div>
        </div>
        `)
        } else {
            resolve(`
        <div class="item">
            <div class="info">
                <label for="name">
                    <p class="preview">Параметры Аккаунта</p>
                    <input id="name" type="text" placeholder="введите название аккаунта">
                    <div class="description">
                        <textarea class="description" placeholder="Description Account"></textarea>
                        <span class="symbol" >maximum symbols: 256</span>
                    </div>
                    <button  class="name">Run Test</button>
                </label>
            </div>
            <div class="player">
                <p class="player"></p>
                <div class="container">
                    <div class="player-game">
                        <div class="player-game">
                            <img class="player" src="">
                        </div>
                        <div class="game-info">
                            <ul class="game-info">
                                <li class="game-info status">Status</li>
                            </ul>
                        </div>
                    </div>
                    <div class="player-external">
                        <ul class="player-game-info">
                            <li class="player-game-info id">ID</li>
                            <li class="player-game-info name">Name</li>
                            <li class="player-game-info date">Date</li>
                            <li class="player-game-info feeAssetId">Fee Asset Id</li>
                            <li class="player-game-info issuer">issuer</li>
                            <li class="player-game-info description">Description</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `)
        }
    })
}