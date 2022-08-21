import mongoose from "mongoose";
const Schema = mongoose.Schema;

const equipment = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    description: {
        type: Schema.Types.String,
        required: false
    },
    image: {
        type: Schema.Types.String,
        required: false
    },
    length: {
        type: Schema.Types.Number,
        required: false
    },
    width: {
        type: Schema.Types.Number,
        required: false
    },
    height: {
        type: Schema.Types.Number,
        required: false
    },
    weight: {
        type: Schema.Types.Number,
        required: false
    },
    volume: {
        type: Schema.Types.Number,
        required: false
    },
    power: {
        type: Schema.Types.Number,
        required: false
    },
    user_id: {
        type: Schema.Types.Number,
        required: false
    },
    equip_type: {
        type: Schema.Types.Number,
        required: false
    },
    equip_category: {
        type: Schema.Types.Number,
        required: false
    },
    manufacturer: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('equipment', equipment);
