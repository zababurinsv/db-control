import mongoose from "mongoose";
const Schema = mongoose.Schema;

const as_user_details = new Schema({
    id_user_details: {
        type: Schema.Types.Number,
        required: true
    },
    user_id: {
        type: Schema.Types.Number,
        required: true
    },
    first_name: {
        type: Schema.Types.String,
        required: false
    },
    last_name: {
        type: Schema.Types.String,
        required: false
    },
    phone: {
        type: Schema.Types.String,
        required: false
    },
    address: {
        type: Schema.Types.String,
        required: false
    },
    band_name: {
        type: Schema.Types.String,
        required: false
    },
    band_logo: {
        type: Schema.Types.String,
        required: false
    },
    public_details: {
        type: Schema.Types.String,
        required: false
    },
    private_details: {
        type: Schema.Types.String,
        required: false
    },
    is_rentcompany: {
        type: Schema.Types.Number,
        required: false
    },
    company_name: {
        type: Schema.Types.String,
        required: false
    },
    basic_location: {
        type: Schema.Types.String,
        required: false
    },
    basic_location_name: {
        type: Schema.Types.String,
        required: false
    },
    basic_location_radius: {
        type: Schema.Types.Number,
        required: false
    }
});

export default mongoose.model('as_user_details', as_user_details);
