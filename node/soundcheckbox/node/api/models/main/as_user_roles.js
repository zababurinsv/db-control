import mongoose from "mongoose";
const Schema = mongoose.Schema;

const as_user_roles = new Schema({
    role_id: {
        type: Schema.Types.Number,
        required: true
    },
    role: {
        type: Schema.Types.String,
        required: false
    }
});

export default mongoose.model('as_user_roles', as_user_roles);
