import componentPostItem from './PostItem.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let PostItem = await componentPostItem('PostItem')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let connect =   config['connect']
      let PropTypes = config['PropTypes']   
      let addPost = config['actions']['postActions']['addPost']

      class PostFeed extends Component {
        render() {
          const { posts } = this.props;
      
          return posts.map(post => <PostItem key={post._id} post={post} />);
        }
      }
      
      PostFeed.propTypes = {
        posts: PropTypes.array.isRequired
      };     
          
    
      resolve(PostFeed)
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
