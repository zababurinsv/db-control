export default  (obj) => {
  return new Promise(function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {

      let template = config['babel']['transform'](`
            let React =   config['React']
            let PropTypes = config['PropTypes']
            let classnames = config['classnames']
            const InputGroup = ({
              name,
              placeholder,
              value,
              error,
              icon,
              type,
              onChange
            }) => {
              return (
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className={icon} />
                    </span>
                  </div>
                  <input
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': error
                    })}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
              );
            };
            
            InputGroup.propTypes = {
              name: PropTypes.string.isRequired,
              placeholder: PropTypes.string,
              value: PropTypes.string.isRequired,
              icon: PropTypes.string,
              error: PropTypes.string,
              type: PropTypes.string.isRequired,
              onChange: PropTypes.func.isRequired
            };
            
            InputGroup.defaultProps = {
              type: 'text'
            };

                     resolve(InputGroup)
            `,config['babel']['availablePresets']['react'])

      eval(template.code)
    })})}



