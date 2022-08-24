import express from "express";
import mongoose from "mongoose";
import {check, validationResult} from "express-validator";
import auth from "../../middleware/auth.mjs";
import User from "../../models/User.mjs";
import Riders from "../../models/Riders.mjs";
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
            console.log('=== POST ====',Date.now(),  Riders)
        //     const user = await User.findById(req.user.id).select('-password');
        //
            const newRiders = new Riders({
                id: new mongoose.Types.ObjectId,
                name: 'riders',
                JSON: 'JSON',
                create_date: Date.now(),
                change_date: Date.now(),
                published_date: Date.now(),
                status: 'ok',
                user_id: 'accepted',
                title: 'title',
                version_number: 1,
                origin_version_id: 1,
                contact: '+79531437072',
                phone: '+79531437072',
                email: 'zababurins@vk.com',
                band_name: 'band',
                band_logo: 'dfsef3434f34f3',
            });
            console.log('@@@@@@@@@@@', newRiders)
            const riders = await newRiders.save();
            console.log('RIDERS', riders)
            res.status(200).json(riders);
            // res.status(200).send({status: 'ok'});
        } catch (err) {
            console.log('error',err.message);
            res.status(500).send({status:'false', error: err});
        }
});

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/', async (req, res) => {
    try {
        const riders = await Riders.find().sort({ date: -1 });
        res.json(riders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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