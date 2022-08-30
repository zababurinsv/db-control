export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {

            let template = config['babel']['transform'](`

            let React =   config['React']
            resolve(() => {
              return (
                <div>
                  <img
                    src='./static/html/react/waves-auth/common/spinner.gif'
                    style={{ width: '200px', margin: 'auto', display: 'block' }}
                    alt="Loading..."
                  />
                </div>
              );
            }) 
            `,config['babel']['availablePresets']['react'])
            eval(template.code)
        })})}

