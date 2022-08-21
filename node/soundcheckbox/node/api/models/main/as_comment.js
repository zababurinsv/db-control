import mongoose from "mongoose";
const Schema = mongoose.Schema;

const as_comment = new Schema({
    comment_id: {
        type: Schema.Types.Number,
        required: true
    },
    posted_by: {
        type: Schema.Types.Number,
        required: false
    },
    posted_by_name: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    post_time: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('as_comment', as_comment);
