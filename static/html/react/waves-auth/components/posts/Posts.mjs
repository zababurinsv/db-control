import componentSpinner from '../common/Spinner.mjs';
import  componentPostForm from './PostForm.mjs';
import  componentPostFeed from './PostFeed.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let PostForm = await componentPostForm('PostForm')
      let PostFeed = await componentPostFeed('PostFeed')
      let Spinner = await componentSpinner('Spinner')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']
      let getPosts = config['actions']['postActions']['getPosts']
    
                
      class Posts extends Component {
        componentDidMount() {
          this.props.getPosts();
        }
      
        render() {
          const { posts, loading } = this.props.post;
          let postContent;
      
          if (posts === null || loading) {
            postContent = <Spinner />;
          } else {
            postContent = <PostFeed posts={posts} />;
          }
      
          return (
            <div className="feed">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <PostForm />
                    {postContent}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
      
      Posts.propTypes = {
        getPosts: PropTypes.func.isRequired,
        post: PropTypes.object.isRequired
      };
      
      const mapStateToProps = state => ({
        post: state.post
      });
    
    
      resolve(connect(mapStateToProps, { getPosts })(Posts))
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
