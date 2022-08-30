export default  (obj) => {
    return new Promise(async function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {
        let template = config['babel']['transform'](`        

        let React =   config['React']
        let Link =   config['Link']
              
        const ProfileActions = () => {
          return (
            <div className="btn-group mb-4" role="group">
              <Link to="/edit-profile" className="btn btn-light">
                <i className="fas fa-user-circle text-info mr-1" /> Edit Profile
              </Link>
              <Link to="/add-experience" className="btn btn-light">
                <i className="fab fa-black-tie text-info mr-1" />
                Add Experience
              </Link>
              <Link to="/add-education" className="btn btn-light">
                <i className="fas fa-graduation-cap text-info mr-1" />
                Add Education
              </Link>
            </div>
          );
        };


        resolve(ProfileActions)
            `,config['babel']['availablePresets']['react'])
            eval(template.code)
        })})}
