import componentCommentItem from './CommentItem.mjs';

export default  (obj) => {
  return new Promise(async function (resolve, reject) {
    bundle['default'](obj,null, async function (error, config) {
      let CommentItem = await componentCommentItem('CommentItem')
      let template = config['babel']['transform'](`        
      let React =   config['React']
      let Component = config['Component']
      let PropTypes = config['PropTypes']
      
      class CommentFeed extends Component {
        render() {
          const { comments, postId } = this.props;
      
          return comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} postId={postId} />
          ));
        }
      }
      
      CommentFeed.propTypes = {
        comments: PropTypes.array.isRequired,
        postId: PropTypes.string.isRequired
      };

    
      resolve(CommentFeed)
      
            `,config['babel']['availablePresets']['react'])
      eval(template.code)
    })})}
