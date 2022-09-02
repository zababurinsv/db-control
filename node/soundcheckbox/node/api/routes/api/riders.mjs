import express from "express";
import mongoose from "mongoose";
import {check, validationResult} from "express-validator";
import auth from "../../middleware/auth.mjs";
// import auth from "../../middleware/auth.mjs";
import checkObjectId from "../../middleware/checkObjectId.mjs";
import {User, Riders} from "../../models/mongo/index.mjs";
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
            // console.log('=== POST ====', {
            //     name: req.body.name
            // })
            // const user = await User.findById(req.user.id).select('-password');
            // console.log('=============',{
            //     id: new mongoose.Types.ObjectId,
            //     name: req.body.name,
            //     JSON: req.body.JSON,
            //     create_date: Date.now(),
            //     change_date: Date.now(),
            //     published_date: Date.now(),
            //     status: req.body.status,
            //     user_id: req.body.user_id,
            //     title: req.body.title,
            //     version_number: 1,
            //     origin_version_id: 1,
            //     contact: req.body.contact,
            //     phone: req.body.phone,
            //     email: req.body.email,
            //     band_name: req.body.band_name,
            //     band_logo: req.body.band_logo,
            // })
            const newRiders = new Riders({
                id: new mongoose.Types.ObjectId,
                name: (req.body.name) ? req.body.name: 'test name',
                JSON: req.body.JSON,
                create_date: Date.now(),
                change_date: Date.now(),
                published_date: Date.now(),
                status: req.body.status,
                user_id: (req.body.user_id) ? req.body.user_id : 666,
                title: req.body.title,
                version_number: 1,
                origin_version_id: 1,
                contact: req.body.contact,
                phone: req.body.phone,
                email: req.body.email,
                band_name: req.body.band_name,
                band_logo: req.body.band_logo,
            });
            const riders = await newRiders.save();
            console.log('RIDERS', riders)
            res.status(200).json({ status:'ok', data:riders });
        } catch (err) {
            console.log('error',err.message);
            res.status(500).send({status:'false', error: err});
        }
});

router.get('/:id', async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    try {
        console.log('=== RIDER RESTORE ====', req.params.id);
        const rider = await Riders.findOne({"id": req.params.id});
        res.status(200).json({status: 'ok', data: rider});
    } catch (err) {
        console.log('error',err.message);
        res.status(500).send({status:'false', data: err});
    }
});
//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get('/', async (req, res) => {
    try {
        const riders = await Riders.find().sort({ date: -1 });
        res.status(200).json(riders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
// router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
router.delete('/:id', async (req, res) => {
    try {
        const rider = await Riders.findOne({"id": req.params.id});

        if (!rider) {
            return res.status(404).json({status:"false", data: 'Rider not found' });
        }

        // Check user
        // if (post.user.toString() !== req.user.id) {
        //     return res.status(401).json({ msg: 'User not authorized' });
        // }

        await rider.remove();
        res.json({ status: 'ok', data: rider });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'false', data: err });
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
