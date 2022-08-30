export default  (obj) => {
    return new Promise(async function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {

        let template = config['babel']['transform'](`        
          let React =   config['React']
          resolve(() => {
              return (
                <div>
                  <h1 className="display-4">Page Not Found</h1>
                  <p>Sorry, this page does not exist</p>
                </div>
              );
            })
      
            `,config['babel']['availablePresets']['react'])
            eval(template.code)
        })})}
