export default  (obj) => {
  return new Promise(function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {

      let template = config['babel']['transform'](`  
  
            let connect = config['connect']
            let PropTypes = config['PropTypes']      
            let React = config['React'] 
            let Link = config['Link'] 
       class Landing extends config['React'].Component {
        componentDidMount() {
          if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
          }
        }
        render() {
          return (
              <div className="landing">
                <div className="dark-overlay landing-inner text-light">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <h1 className="display-3 mb-4">Connector</h1>
                        <p className="lead">
                          {' '}
                          Create a profile/portfolio, share posts and get help
                          from other
                        </p>
                        <hr />
                        <Link to="/register" className="btn btn-lg btn-info mr-2">
                          Sign Up
                        </Link>
                        <Link to="/login" className="btn btn-lg btn-light">
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
          );
        }
      }
          Landing.propTypes = { auth: PropTypes.object.isRequired };
          const mapStateToProps = state => ({ auth: state.auth });
          resolve(connect(mapStateToProps)(Landing))
     
     
            `,config['babel']['availablePresets']['react'])
      eval(template.code)

    })})}