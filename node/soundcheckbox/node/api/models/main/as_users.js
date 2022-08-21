import mongoose from "mongoose";
const Schema = mongoose.Schema;

const as_users = new Schema({
    user_id: {
        type: Schema.Types.Number,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: false
    },
    username: {
        type: Schema.Types.String,
        required: false
    },
    password: {
        type: Schema.Types.String,
        required: false
    },
    confirmation_key: {
        type: Schema.Types.String,
        required: false
    },
    confirmed: {
        type: Schema.Types.String,
        required: false
    },
    password_reset_key: {
        type: Schema.Types.String,
        required: false
    },
    password_reset_confirmed: {
        type: Schema.Types.String,
        required: false
    },
    password_reset_timestamp: {
        type: Schema.Types.Number,
        required: false
    },
    register_date: {
        type: Schema.Types.Date,
        required: false
    },
    user_role: {
        type: Schema.Types.Number,
        required: false
    },
    last_login: {
        type: Schema.Types.Date,
        required: false
    },
    banned: {
        type: Schema.Types.String,
        required: false
    },
});

export default mongoose.model('as_users', as_users);
