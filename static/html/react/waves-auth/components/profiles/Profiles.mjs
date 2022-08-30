import componentProfileItem from './ProfileItem.mjs';
import componentSpinner from '../common/Spinner.mjs';

export default  (obj) => {
  return new Promise(function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let ProfileItem = await componentProfileItem('ProfileItem')
      let Spinner = await componentSpinner('Spinner')
      let template = config['babel']['transform'](`   
      let React =   config['React']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let Component = config['Component']
      let getProfiles = config['actions']['profileActions']['getProfiles']
        
      class Profiles extends Component {
        componentDidMount() {
          this.props.getProfiles();
        }

        render() {
          const { profiles, loading } = this.props.profile;
          let profileItems;

          if (profiles === null || loading) {
            profileItems = <Spinner />;
          } else {
            if (profiles.length > 0) {
              profileItems = profiles.map(profile => (
                  <ProfileItem key={profile._id} profile={profile} />
              ));
            } else {
              profileItems = <h4>No profiles found...</h4>;
            }
          }
          return (
              <div className="profiles">
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <h1 className="display-4 text-center">Developer Profiles</h1>
                      <p className="lead text-center">
                        Browse and connect with developers
                      </p>
                      {profileItems}
                    </div>
                  </div>
                </div>
              </div>
          );
        }
      }

      Profiles.propTypes = {
        getProfiles: PropTypes.func.isRequired,
        profile: PropTypes.object.isRequired
      };

      const mapStateToProps = state => ({
        profile: state.profile
      });
      resolve(connect(mapStateToProps, { getProfiles })(Profiles))
        
            `,config['babel']['availablePresets']['react'])

      eval(template.code)


    })})}