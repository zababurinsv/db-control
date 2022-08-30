export default  (obj) => {
    return new Promise(async function (resolve, reject) {
        bundle['default'](obj,null, async function (error, config) {
        let template = config['babel']['transform'](`        
         let React =   config['React']
         let connect =   config['connect']
         let Moment =   config['Moment']
         let PropTypes = config['PropTypes']
         let Component = config['Component']
         let deleteEducation = config['actions']['profileActions']['deleteEducation']
         class Education extends Component {
          onDeleteClick(id) {
            this.props.deleteEducation(id);
          }
        
          render() {
            const education = this.props.education.map(edu => (
              <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td>
                  <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
                  {edu.to === null ? (
                    ' Now'
                  ) : (
                    <Moment format="YYYY/MM/DD">{edu.to}</Moment>
                  )}
                </td>
                <td>
                  <button
                    onClick={this.onDeleteClick.bind(this, edu._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ));
            return (
              <div>
                <h4 className="mb-4">Education Credentials</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Degree</th>
                      <th>Years</th>
                      <th />
                    </tr>
                    {education}
                  </thead>
                </table>
              </div>
            );
          }
        }
        Education.propTypes = {
          deleteEducation: PropTypes.func.isRequired
        };
        resolve(connect(null, { deleteEducation })(Education))
            `,config['babel']['availablePresets']['react'])
            eval(template.code)
        })})}
