import mongoose from "mongoose";
const Schema = mongoose.Schema;


const venues = new Schema({
    id: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    country_code: {
        type: Schema.Types.String,
        required: false
    },
    address: {
        type: Schema.Types.String,
        required: false
    },
    stage_JSON: {
        type: Schema.Types.String,
        required: false
    },
    user_id: {
        type: Schema.Types.String,
        required: false
    }
});

export default mongoose.model('venues', venues);
