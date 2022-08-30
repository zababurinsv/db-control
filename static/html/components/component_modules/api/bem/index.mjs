import dom from '/static/html/components/component_modules/api/bem/bemParser.mjs'

export default (self) => {
    return new Promise(async (resolve, reject) => {
        resolve(await dom({
            id: self.querySelectorAll("[id]"),
            classList: self.querySelectorAll("[class]")
        }))
    })
}