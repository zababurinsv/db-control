export default  (obj) => {
  return new Promise(function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let template = config['babel']['transform'](`
           let PropTypes = config['PropTypes']
           let classnames = config['classnames']
            let React =   config['React']
            const TextFieldGroup = ({
              name,
              placeholder,
              value,
              label,
              error,
              info,
              type,
              onChange,
              disabled
            }) => {
              return (
                <div className="form-group">
                  <input
                    type={type}
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': error
                    })}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                  />
                  {info && <small className="form-text text-muted">{info}</small>}
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
              );
            };
            
            TextFieldGroup.propTypes = {
              name: PropTypes.string.isRequired,
              placeholder: PropTypes.string,
              value: PropTypes.string.isRequired,
              info: PropTypes.string,
              error: PropTypes.string,
              type: PropTypes.string.isRequired,
              onChange: PropTypes.func.isRequired,
              disabled: PropTypes.string
            };
            
            TextFieldGroup.defaultProps = {
              type: 'text'
            };
                     resolve(TextFieldGroup)
            `,config['babel']['availablePresets']['react'])

              eval(template.code)
    })})}


