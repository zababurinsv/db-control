export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let deleteComment = config['actions']['postActions']['deleteComment']
    
                    
      class CommentItem extends Component {
        onDeleteClick(postId, commentId) {
          this.props.deleteComment(postId, commentId);
        }
      
        render() {
          const { comment, postId, auth } = this.props;
      
          return (
            <div className="card card-body mb-3">
              <div className="row">
                <div className="col-md-2">
                  <a href="profile.html">
                    <img
                      className="rounded-circle d-none d-md-block"
                      src={comment.avatar}
                      alt=""
                    />
                  </a>
                  <br />
                  <p className="text-center">{comment.name}</p>
                </div>
                <div className="col-md-10">
                  <p className="lead">{comment.text}</p>
                  {comment.user === auth.user.id ? (
                    <button
                      onClick={this.onDeleteClick.bind(this, postId, comment._id)}
                      type="button"
                      className="btn btn-danger mr-1"
                    >
                      <i className="fas fa-times" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        }
      }
      
      CommentItem.propTypes = {
        deleteComment: PropTypes.func.isRequired,
        comment: PropTypes.object.isRequired,
        postId: PropTypes.string.isRequired,
        auth: PropTypes.object.isRequired
      };
      
      const mapStateToProps = state => ({
        auth: state.auth
      });


    
      resolve(connect(mapStateToProps, { deleteComment })(CommentItem))
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
