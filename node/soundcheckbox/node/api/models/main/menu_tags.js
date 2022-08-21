import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menu_tags = new Schema({
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
    locale: {
        type: Schema.Types.String,
        required: false
    },
    class: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('menu_tags', menu_tags);
