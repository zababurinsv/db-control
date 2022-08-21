import mongoose from "mongoose";
const Schema = mongoose.Schema;

const equipment_types = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    order_index: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('equipment_types', equipment_types);
