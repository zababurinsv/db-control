export default (obj) => {
return `
      <div class = "item timestamp_${Date.parse(obj['data']['date_modified'])}">
          <label class="details">
              <div class="content">
                  <div class="images">
                      <a class="bid">
                          <img  class='imgBid' src="${obj['data']['image']}" alt="bid">
                      </a>
                  </div>
                  <div class="timer">
                  ${obj['data']['details']['time']}
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
               <div class="button">
                  <button class="delete"> удалить </button>
                  <button class="change"> изменить </button>
                  </div>
              </div>
          </label>
      </div>`
}