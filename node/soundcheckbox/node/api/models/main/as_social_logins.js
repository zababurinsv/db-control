import mongoose from "mongoose";
const Schema = mongoose.Schema;

const as_login_attempts = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    user_id: {
        type: Schema.Types.Number,
        required: true
    },
    provider: {
        type: Schema.Types.String,
        required: false
    },
    provider_id: {
        type: Schema.Types.String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('as_social_logins', as_login_attempts);
