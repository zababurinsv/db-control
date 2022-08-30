import componentTextFieldGroup from '../common/TextFieldGroup.mjs';

export default  (obj) => {
  return new Promise(function (resolve, reject) {

    bundle['default'](obj,null, async function (error, config) {
      let TextFieldGroup = await componentTextFieldGroup('TextFieldGroup')
      let template = config['babel']['transform'](`     
      let React =   config['React']
      let connect =  config['connect']
      let PropTypes = config['PropTypes']
      let Component = config['React']['Component']
      let registerUser = config['actions']['authActions']['registerUser']
      let withRouter = config['reactRouter']['withRouter']
      class Register extends Component {
        constructor() {
          super();
          this.onSubmit = this.onSubmit.bind(this);
          this.onChange = this.onChange.bind(this);
          this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
          };
        }
        componentDidMount() {
          if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
          }
        }
        componentWillReceiveProps(nextProps) {
          if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
          }
        }
          onChange (e) {
          this.setState({ [e.target.name]: e.target.value });
        }
        onSubmit(e){
          e.preventDefault();
      
          const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
          };
          this.props.registerUser(newUser, this.props.history);
        }
        render() {
          const { errors } = this.state;
          return (
            <div className="register">
              <div className="container">
                <div className="row">
                  <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Sign Up</h1>
                    <p className="lead text-center">
                      Create your account
                    </p>
                    <form noValidate onSubmit={this.onSubmit}>
                      <TextFieldGroup
                        placeholder="Name"
                        name="name"
                        value={this.state.name}
                        onChange={this.onChange}
                        error={errors.name}/>
                      <TextFieldGroup
                        placeholder="Email"
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
                        error={errors.password} />
                      <TextFieldGroup
                        placeholder="Confirm Password"
                        name="password2"
                        type="password"
                        value={this.state.password2}
                        onChange={this.onChange}
                        error={errors.password2}/>
                      <input type="submit" className="btn btn-info btn-block mt-4" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }

      Register.propTypes = {
        registerUser: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired
      };

      const mapStateToProps = state => ({
        auth: state.auth,
        errors: state.errors
      });
      resolve(connect(mapStateToProps, { registerUser })(withRouter(Register)))
            `,config['babel']['availablePresets']['react'])
      eval(template.code)



    })})}