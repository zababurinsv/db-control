import componentTextFieldGroup from '../common/TextFieldGroup.mjs';
import componentExperience from './Experience.mjs';
import componentEducation from './Education.mjs';
import componentProfileActions from './ProfileActions.mjs';
import componentSpinner from '../common/Spinner.mjs';

export default  (obj) => {
    return new Promise(async function (resolve, reject) {


        bundle['default'](obj,null, async function (error, config) {
            let TextFieldGroup = await componentTextFieldGroup('TextFieldGroup')
            let Experience = await componentExperience('Experience')
            let Education = await componentEducation('Education')
            let ProfileActions = await componentProfileActions('ProfileActions')
            let Spinner = await componentSpinner('ProfileActions')
                let profile = {}
            let template = config['babel']['transform'](`      
      let profile = null  
      let React =   config['React']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let Component = config['Component']
      let Link = config['Link']
      let getCurrentProfile = config['actions']['profileActions']['getCurrentProfile']
      let deleteAccount = config['actions']['profileActions']['deleteAccount']
        class Dashboard extends Component {
          componentDidMount() {
            this.props.getCurrentProfile();
          }
        
          onDeleteClick(e) {
            this.props.deleteAccount();
          }
        
          render() {
            const { user } = this.props.auth;
            const { profile, loading } = this.props.profile;
            let dashboardContent;
            if (profile === null || loading) {
              dashboardContent = <Spinner />;
            } else {
              // Check if logged in user has profile data
              if (Object.keys(profile).length > 0) {
                dashboardContent = (
                  <div>
                    <p className="lead text-muted">
                      Welcome <Link to={\`/profile/${profile.handle}\`}>{user.name}</Link>
                    </p>
                    <ProfileActions />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                    <div style={{ marginBottom: '60px' }} />
                    <button
                      onClick={this.onDeleteClick.bind(this)}
                      className="btn btn-danger"
                    >
                      Delete My Account
                    </button>
                  </div>
                );
              } else {
                // User is logged in but has no profile
                dashboardContent = (
                  <div>
                    <p className="lead text-muted">Welcome {user.name}</p>
                    <p>You have not yet setup a profile, please add some info</p>
                    <Link to="/create-profile" className="btn btn-lg btn-info">
                      Create Profile
                    </Link>
                  </div>
                );
              }
            }
        
            return (
              <div className="dashboard">
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <h1 className="display-4">Dashboard</h1>
                      {dashboardContent}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
   
        Dashboard.propTypes = {
          getCurrentProfile: PropTypes.func.isRequired,
          deleteAccount: PropTypes.func.isRequired,
          auth: PropTypes.object.isRequired,
          profile: PropTypes.object.isRequired
        };
        
        const mapStateToProps = state => ({
          profile: state.profile,
          auth: state.auth
        });
   
        resolve( connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard))
            `,config['babel']['availablePresets']['react'])
            eval(template.code)
        })})}
