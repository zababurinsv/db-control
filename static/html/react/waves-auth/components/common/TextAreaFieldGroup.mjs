export default  (obj) => {
  return new Promise(function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let template = config['babel']['transform'](`
            let React =   config['React']
            let PropTypes = config['PropTypes']
            let classnames = config['classnames']
             const TextAreaFieldGroup = ({
                name,
                placeholder,
                value,
                error,
                info,
                onChange
              }) => {
                return (
                  <div className="form-group">
                    <textarea
                      className={classnames('form-control form-control-lg', {
                        'is-invalid': error
                      })}
                      placeholder={placeholder}
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                    {info && <small className="form-text text-muted">{info}</small>}
                    {error && <div className="invalid-feedback">{error}</div>}
                  </div>
                );
              };

              TextAreaFieldGroup.propTypes = {
                name: PropTypes.string.isRequired,
                placeholder: PropTypes.string,
                value: PropTypes.string.isRequired,
                info: PropTypes.string,
                error: PropTypes.string,
                onChange: PropTypes.func.isRequired
              };
                     resolve(TextAreaFieldGroup)
            `,config['babel']['availablePresets']['react'])

      eval(template.code)
    })})}


