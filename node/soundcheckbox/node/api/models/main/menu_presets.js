import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menu_presets = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    JSON: {
        type: Schema.Types.String,
        required: true
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
        required: false
    },
});

export default mongoose.model('menu_presets', menu_presets);
