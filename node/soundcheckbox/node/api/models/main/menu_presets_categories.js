import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menu_presets_categories = new Schema({
    preset_id: {
        type: Schema.Types.Number,
        required: true
    },
    category_id: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('menu_presets_categories', menu_presets_categories);
