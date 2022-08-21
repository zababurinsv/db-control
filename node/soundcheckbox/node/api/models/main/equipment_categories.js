import mongoose from "mongoose";
const Schema = mongoose.Schema;

const equipment_categories = new Schema({
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
    },
    parent_id: {
        type: Schema.Types.Number,
        required: false
    },
    order_index: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('equipment_categories', equipment_categories);
