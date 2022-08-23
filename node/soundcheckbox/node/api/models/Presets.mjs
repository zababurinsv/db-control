import mongoose from "mongoose";
const Schema = mongoose.Schema;

const presets = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    JSON: {
        type: Schema.Types.String,
        required: false
    },
    image: {
        type: Schema.Types.String,
        required: false
    },
    user_id: {
        type: Schema.Types.Number,
        required: false
    },
    order: {
        type: Schema.Types.Number,
    }
});

export default mongoose.model('presets', presets);
