export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {
            let template = config['babel']['transform'](`
            let React = config['React'] 
            function out (){return (
                 <footer className="bg-dark text-white mt-5 p-4 text-center">
                  Copyright &copy; {new Date().getFullYear()}
                </footer>
            ); }
            resolve(out)
            `,config['babel']['availablePresets']['react'])
            eval(template.code)

        })})}
