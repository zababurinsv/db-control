import componentTextFieldGroup from '../common/TextFieldGroup.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let TextFieldGroup = await componentTextFieldGroup('TextFieldGroup')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let Component = config['Component']
      let loginUser = config['actions']['authActions']['loginUser']
       let store = config['store']
           
        class Login extends Component {
          constructor() {
            super();
            this.onSubmit = this.onSubmit.bind(this);
            this.onChange = this.onChange.bind(this);
            this.state = {
              email: '',
              password: '',
              errors: {}
            };
          }
        
          componentDidMount() {
            if (this.props.auth.isAuthenticated) {
              this.props.history.push('/dashboard');
            }
          }
        
          componentWillReceiveProps(nextProps) {
            if (nextProps.auth.isAuthenticated) {
              this.props.history.push('/dashboard');
            }
        
            if (nextProps.errors) {
              this.setState({ errors: nextProps.errors });
            }
          }
          onSubmit(e){
            e.preventDefault();
            console.log('!!!!!!!!!!!!!!!!!!!!!!!eee!!!!!', this)
            const userData = {
              email: this.state.email,
              password: this.state.password
            };
        
            this.props.loginUser(userData);
          }
        
          onChange(e){
          console.log('!!!!!!!!!!!!!!!!!!!!!!!eee!!!!!', this)
            this.setState({ [e.target.name]: e.target.value });
          }
          render() {
            const { errors } = this.state
        
            return (
              <div className="login">
                <div className="container">
                  <div className="row">
                    <div className="col-md-8 m-auto">
                      <h1 className="display-4 text-center">Log In</h1>
                      <p className="lead text-center">
                        Sign in to your account
                      </p>
                      <form onSubmit={this.onSubmit}>
                        <TextFieldGroup
                          placeholder="Email Address"
                          name="email"
                          type="email"
                          value={this.state.email}
                          onChange={this.onChange}
                          error={errors.email}
                        />
        
                        <TextFieldGroup
                          placeholder="Password"
                          name="password"
                          type="password"
                          value={this.state.password}
                          onChange={this.onChange}
                          error={errors.password}
                        />
                        <input type="submit" className="btn btn-info btn-block mt-4" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }

      Login.propTypes = {
        loginUser: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired
      };

       let mapStateToProps = (state) => ({
 
        auth: state.auth,
        errors: state.errors
      });
      resolve(connect(mapStateToProps, { loginUser })(Login))
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
