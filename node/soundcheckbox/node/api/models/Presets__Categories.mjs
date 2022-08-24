import mongoose from "mongoose";
const Schema = mongoose.Schema;

const presets__categories = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    preset_id: {
        type: Schema.Types.Number,
        required: true
    },
    category_id: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('presets__categories', presets__categories);
