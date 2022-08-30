export default {
  body: (obj) => {
    return `
      <div class="auction-data__table_body_tr">
          <div class="auction-data__table_body_td assetId"><span>${obj.assetId}</span></div>
          <div class="auction-data__table_body_td timestamp"><span>${obj.timestamp}</span></div>
          <div class="auction-data__table_body_td description"><span>${obj.description}</span></div>
          <div class="auction-data__table_body_td name"><span>${obj.name}</span></div>
          <div class="auction-data__table_body_td proofs"><span>${obj.proofs}</span></div>
          <div class="auction-data__table_body_td sender"><span>${obj.sender}</span></div>
      </div>
    `}
}