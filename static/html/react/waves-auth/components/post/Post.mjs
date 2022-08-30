import componentCommentForm from './CommentForm.mjs';
import componentCommentFeed from './CommentFeed.mjs';
import componenPostItem from '../posts/PostItem.mjs';
import componentSpinner from '../common/Spinner.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let CommentForm = await componentCommentForm('CommentForm')
      let CommentFeed = await componentCommentFeed('CommentFeed')
      let PostItem = await componenPostItem('PostItem')
      let Spinner = await componentSpinner('Spinner')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let Link = config['Link']
      
      let getPost = config['actions']['postActions']['getPost']
    
                  
      class Post extends Component {
        componentDidMount() {
          this.props.getPost(this.props.match.params.id);
        }
      
        render() {
          const { post, loading } = this.props.post;
          let postContent;
      
          if (post === null || loading || Object.keys(post).length === 0) {
            postContent = <Spinner />;
          } else {
            postContent = (
              <div>
                <PostItem post={post} showActions={false} />
                <CommentForm postId={post._id} />
                <CommentFeed postId={post._id} comments={post.comments} />
              </div>
            );
          }
      
          return (
            <div className="post">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <Link to="/feed" className="btn btn-light mb-3">
                      Back To Feed
                    </Link>
                    {postContent}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
      
      Post.propTypes = {
        getPost: PropTypes.func.isRequired,
        post: PropTypes.object.isRequired
      };
      
      const mapStateToProps = state => ({
        post: state.post
      });

    
      resolve(connect(mapStateToProps, { getPost })(Post))
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
