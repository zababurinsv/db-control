import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menu_categories = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    image: {
        type: Schema.Types.String,
        required: false
    },
    parent: {
        type: Schema.Types.Number,
        required: false
    },
    user_id: {
        type: Schema.Types.Number,
        required: false
    },
    locale: {
        type: Schema.Types.String,
        required: false
    },
    order: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('menu_categories', menu_categories);
