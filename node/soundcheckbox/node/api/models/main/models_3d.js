import mongoose from "mongoose";
const Schema = mongoose.Schema;

const models_3d = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    model_src: {
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
    create_date: {
        type: Date,
        default: Date.now
    },
    change_date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('models_3d', models_3d);
