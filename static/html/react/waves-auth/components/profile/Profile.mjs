import componentSpinner from '../common/Spinner.mjs';
import componentProfileHeader from './ProfileHeader.mjs';
import componentProfileAbout from './ProfileAbout.mjs';
import componentProfileCreds from './ProfileCreds.mjs';
import componentProfileGithub from './ProfileGithub.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let ProfileHeader = await componentProfileHeader('ProfileHeader')
      let ProfileAbout = await componentProfileAbout('ProfileAbout')
      let ProfileCreds = await componentProfileCreds('ProfileCreds')
      let ProfileGithub = await componentProfileGithub('ProfileGithub')
      let Spinner = await componentSpinner('Spinner')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let Link = config['Link']
      let getProfileByHandle = config['actions']['profileActions']['getProfileByHandle']
    
          
      class Profile extends Component {
        componentDidMount() {
          if (this.props.match.params.handle) {
            this.props.getProfileByHandle(this.props.match.params.handle);
          }
        }
      
        componentWillReceiveProps(nextProps) {
          if (nextProps.profile.profile === null && this.props.profile.loading) {
            this.props.history.push('/not-found');
          }
        }
      
        render() {
          const { profile, loading } = this.props.profile;
          let profileContent;
      
          if (profile === null || loading) {
            profileContent = <Spinner />;
          } else {
            profileContent = (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <Link to="/profiles" className="btn btn-light mb-3 float-left">
                      Back To Profiles
                    </Link>
                  </div>
                  <div className="col-md-6" />
                </div>
                <ProfileHeader profile={profile} />
                <ProfileAbout profile={profile} />
                <ProfileCreds
                  education={profile.education}
                  experience={profile.experience}
                />
                {profile.githubusername ? (
                  <ProfileGithub username={profile.githubusername} />
                ) : null}
              </div>
            );
          }
      
          return (
            <div className="profile">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">{profileContent}</div>
                </div>
              </div>
            </div>
          );
        }
      }
      
      Profile.propTypes = {
        getProfileByHandle: PropTypes.func.isRequired,
        profile: PropTypes.object.isRequired
      };
      
      const mapStateToProps = state => ({
        profile: state.profile
      });

    
    
      resolve(connect(mapStateToProps, { getProfileByHandle })(Profile))
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
