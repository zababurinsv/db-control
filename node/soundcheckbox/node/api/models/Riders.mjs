import mongoose from "mongoose";
const Schema = mongoose.Schema;

const riders = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    JSON: {
        type: Schema.Types.String,
        required: false
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    change_date: {
        type: Date,
        default: Date.now
    },
    published_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Schema.Types.String,
        required: false
    },
    user_id: {
        type: Schema.Types.String,
        enum : ['new', 'sent', 'proposed', 'accepted', 'discussed', 'deleted', 'public'],
        default: 'new'
    },
    title: {
        type: Schema.Types.String,
        required: false
    },
    version_number: {
        type: Schema.Types.Number,
        required: false
    },
    origin_version_id: {
        type: Schema.Types.Number,
        required: false
    },
    contact: {
        type: Schema.Types.String,
        required: false
    },
    phone: {
        type: Schema.Types.String,
        required: false
    },
    email: {
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
});

export default mongoose.model('riders', riders);
