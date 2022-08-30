import msConversion from '/static/html/components/auction-card/modules/msConvert/index.mjs'

export default (obj) => {
  let lime = msConversion(obj['data']['details']['time']*60*1000)
  return `
     <div class="item timestamp_${Date.parse(obj['data']['date_modified'])} ">
       <img style="display: none" class="item_edit timestamp_${Date.parse(obj['data']['date_modified'])}" src="/static/img/icons/edit.svg">
        <label class="details">
            <div class="content">
                <div class="images">
                    <a class="bid">
                        <img  class='imgBid' src="${obj['data']['image']}"  alt="bid">
                    </a>
                </div>
                 <div class="timer">
                       ${lime}
                </div>
                <div class="price">
                  Waves: ${obj['data']['details']['price']}
                </div>
                <div class="name">
                    ~~~~~
                </div>
                <div class="bid">
                    bid
                </div>
            </div>
            <input type="checkbox" class="input" />
            <div class="summary">
            <div class = "button">
                     <button class="bidButton"> ставка </button>
                     <button class="startButton"> старт </button>
            </div>
            <div class="priceSend">
            <div class="info">
                <div>Повышение цены: 0.1 Waves</div>
                <div>Стоимость ставки: 1 Waves</div>
                 <div>Перевод: 0.014 Waves</div>
            </div>
                <div class="priceWinner">
                    <div>
                        Сумма оплаты при выигрыше
                    </div>
                    <div class="outPrice">
                        0
                    </div>
                </div>
            </div>
            </div>
        </label>
    </div>`
}