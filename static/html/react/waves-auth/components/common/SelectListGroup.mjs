export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {

        let template = config['babel']['transform'](`
            let React =   config['React']
            let PropTypes = config['PropTypes']
            let classnames = config['classnames']
            const SelectListGroup = ({ name, value, error, info, onChange, options }) => {
              const selectOptions = options.map(option => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ));
              return (
                <div className="form-group">
                  <select
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': error
                    })}
                    name={name}
                    value={value}
                    onChange={onChange}
                  >
                    {selectOptions}
                  </select>
                  {info && <small className="form-text text-muted">{info}</small>}
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
              );
            };
            
            SelectListGroup.propTypes = {
              name: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
              info: PropTypes.string,
              error: PropTypes.string,
              onChange: PropTypes.func.isRequired,
              options: PropTypes.array.isRequired
            };

                     resolve(SelectListGroup)
            `,config['babel']['availablePresets']['react'])

            eval(template.code)
        })})}


