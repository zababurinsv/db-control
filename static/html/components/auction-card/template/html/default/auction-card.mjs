import msConversion from '/static/html/components/auction-card/modules/msConvert/index.mjs'

export default (obj) => {
  let lime = msConversion(obj['data']['details']['time']*60*1000)
  return `
      <div class="item timestamp_${Date.parse(obj['data']['date_modified'])} ">
          <div class="front">
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
              </label>
          </div>
        <div class="back" style="visibility: hidden">
            <label class="details">
                <div class="content">
      <!--                        <div class="back__arrow_round"></div>-->
                    <div class="content__data"></div>
                    <div class="bid">bid</div>
                </div>
                <input type="checkbox" class="input" />
                <div class="summary">
                    <div class = "button">
                        <button class="bidButton"> ставка </button>
                        <button class="sellButton"> детали </button>
                    </div>
                </div>
            </label>
        </div>
      </div>`
}