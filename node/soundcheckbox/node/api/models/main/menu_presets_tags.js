import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menu_presets_tags = new Schema({
    preset_id: {
        type: Schema.Types.Number,
        required: true
    },
    tag_id: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('menu_presets_tags', menu_presets_tags);
