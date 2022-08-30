import mongo from '/static/html/components/component_modules/matcher/matcher/mongoDb.mjs'

export default {
  auction: {
    get: {
      items: {
        bid: () => {
          return mongo['get']({
            input:'mongodb',
            type:'itemsBid',
          },'type')
        }
      }
    }
  }
}