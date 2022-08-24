import mongoose from "mongoose";
const Schema = mongoose.Schema;

const presets__tags = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    class: {
        type: Schema.Types.Number,
        required: false
    },
    preset_id: {
        type: Schema.Types.Number,
        required: true
    },
    tag_id: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('presets__tags', presets__tags);
