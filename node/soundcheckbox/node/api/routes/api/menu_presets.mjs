import express from "express";
import mongoose from "mongoose";
import {check, validationResult} from "express-validator";
import auth from "../../middleware/auth.mjs";
import { User, Menu_presets, Menu_categories, Menu_presets_categories, Menu_presets_tags, Menu_tags } from "../../models/mongo/index.mjs";
// import auth from "../../middleware/auth.mjs";
import checkObjectId from "../../middleware/checkObjectId.mjs";
const router = express.Router();
// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/', async (req, res) => {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        try {
            console.log('============ req.body ============', req.body)
            // console.log('=== POST ====',Date.now(),  Riders)
        //     const user = await User.findById(req.user.id).select('-password');
        //
        //     const Schema = new Menu_presets({
        //         id: new mongoose.Types.ObjectId,
        //         name: req.body.name,
        //         JSON: req.body.JSON,
        //         image: req.body.image,
        //         categories: req.body['categories[]'],
        //         user_id: req.body.user_id,
        //         tags: req.body['tags[]'],
        //         order: req.body.order
        //     });

            const Schema = new Menu_presets({
                id: 6668,
                name: req.body.name,
                JSON: req.body.JSON,
                image: (typeof req.body.image === 'object') ? '': req.body.image,
                user_id: req.body.user_id,
                order: req.body.order
            });

            const result = await Schema.save();
            console.log('=== result ===', result)
            res.status(200).json({status:'ok', data:result});
        } catch (err) {
            console.log('error',err.message, err.message.includes('oundcheckbox.menu_presets index: id_1 dup key'));
            res.status(500).send({status:'false', error: err});
        }
});

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/', async (req, res) => {
    try {
        let result = []
        const menu_presets = await Menu_presets.find();
        const menu_presets_categories = await Menu_presets_categories.find();
        const menu_categories = await Menu_categories.find();
        const menu_presets_tags = await Menu_presets_tags.find();
        const menu_tags = await Menu_tags.find();

        for(let Preset of menu_presets) {
            const preset = Preset
            let tags = []
            const presets_categories = menu_presets_categories.find(item => {
                return item.preset_id.toString() === preset._id.toString()
            })
            if(presets_categories !== undefined) {
                console.log('<<< @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ >>>', presets_categories)
                const categories = menu_categories.find(item => item._id.toString() === presets_categories.category_id.toString())
                const presets_tags = menu_presets_tags.filter(item => preset._id.toString() === item.preset_id.toString());

                for(let item of presets_tags) {
                    let tag = menu_tags.find(tag => tag._id.toString() === item.tag_id.toString())
                    tags.push(tag.name)
                }

                result.push({
                    JSON: preset.JSON,
                    id: preset.id,
                    image: preset.image,
                    name: preset.name,
                    order: preset.order,
                    user_id: preset.user_id,
                    categories: categories.name,
                    tags: tags.join(',')
                });
            }
        }
        res.json(result);
    } catch (err) {
        console.log('ERROR', err)
        res.status(500).send({status: false, message: err});
    }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
// router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//
//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }
//
//         res.json(post);
//     } catch (err) {
//         console.error(err.message);
//
//         res.status(500).send('Server Error');
//     }
// });
//
// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
// router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//
//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }
//
//         Check user
//         if (post.user.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'User not authorized' });
//         }
//
//         await post.remove();
//
//         res.json({ msg: 'Post removed' });
//     } catch (err) {
//         console.error(err.message);
//
//         res.status(500).send('Server Error');
//     }
// });

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
// router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//
//         Check if the post has already been liked
        // if (post.likes.some((like) => like.user.toString() === req.user.id)) {
        //     return res.status(400).json({ msg: 'Post already liked' });
        // }
        //
        // post.likes.unshift({ user: req.user.id });
        //
        // await post.save();
        //
        // return res.json(post.likes);
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).send('Server Error');
    // }
// });

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
// router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//
//         Check if the post has not yet been liked
        // if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
        //     return res.status(400).json({ msg: 'Post has not yet been liked' });
        // }
        //
        // remove the like
        // post.likes = post.likes.filter(
        //     ({ user }) => user.toString() !== req.user.id
        // );
        //
        // await post.save();
        //
        // return res.json(post.likes);
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).send('Server Error');
    // }
// });

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
// router.post(
//     '/comment/:id',
//     auth,
//     checkObjectId('id'),
//     check('text', 'Text is required').notEmpty(),
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//
//         try {
//             const user = await User.findById(req.user.id).select('-password');
//             const post = await Post.findById(req.params.id);
//
//             const newComment = {
//                 text: req.body.text,
//                 name: user.name,
//                 avatar: user.avatar,
//                 user: req.user.id
//             };
//
//             post.comments.unshift(newComment);
//
//             await post.save();
//
//             res.json(post.comments);
//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server Error');
//         }
//     }
// );

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
// router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);

        // Pull out comment
        // const comment = post.comments.find(
        //     (comment) => comment.id === req.params.comment_id
        // );
        // Make sure comment exists
        // if (!comment) {
        //     return res.status(404).json({ msg: 'Comment does not exist' });
        // }
        // Check user
        // if (comment.user.toString() !== req.user.id) {
        //     return res.status(401).json({ msg: 'User not authorized' });
        // }

        // post.comments = post.comments.filter(
        //     ({ id }) => id !== req.params.comment_id
        // );

        // await post.save();

        // return res.json(post.comments);
    // } catch (err) {
    //     console.error(err.message);
    //     return res.status(500).send('Server Error');
    // }
// });

export default router;
