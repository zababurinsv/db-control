import mongoose from "mongoose";
const Schema = mongoose.Schema;

const riders_types = new Schema({
    rider_id: {
        type: Schema.Types.Number,
        required: true
    },
    type_id: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('riders_types', riders_types);
