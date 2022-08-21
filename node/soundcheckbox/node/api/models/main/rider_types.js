import mongoose from "mongoose";
const Schema = mongoose.Schema;

const riders_types = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    user_id: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('riders_types', riders_types);
