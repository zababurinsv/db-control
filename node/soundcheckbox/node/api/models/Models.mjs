import mongoose from "mongoose";
const Schema = mongoose.Schema;

const models = new Schema({
    id: {
        type: Schema.Types.ObjectId,
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

export default mongoose.model('models', models);
