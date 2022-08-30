export default  (obj) => {
    return new Promise(function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {

            let template = config['babel']['transform'](`
            let React =   config['React']
            let PropTypes = config['PropTypes']
            let connect = config['connect']
            let Route = config['Route']
            let Redirect = config['Redirect']
        const PrivateRoute = ({ component: Component, auth, rest }) => (
              <Route
                {...rest}
                render={props =>
                  auth.isAuthenticated === true ? (
                    <Component {...props} />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
            );
            
            PrivateRoute.propTypes = {
              auth: PropTypes.object.isRequired
            };
            
            const mapStateToProps = state => ({
              auth: state.auth
            });

                     resolve(connect(mapStateToProps)(PrivateRoute))
            `,config['babel']['availablePresets']['react'])

            eval(template.code)
        })})}



