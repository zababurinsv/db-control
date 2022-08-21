import mongoose from "mongoose";
const Schema = mongoose.Schema;

const as_login_attempts = new Schema({
    id_login_attempt: {
        type: Schema.Types.Number,
        required: true
    },
    ip_addr: {
        type: Schema.Types.String,
        required: false
    },
    attempt_number: {
        type: Schema.Types.Number,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('as_login_attempts', as_login_attempts);
