import mongoose from "mongoose";
const Schema = mongoose.Schema;

const events = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: Schema.Types.Number,
        required: false
    },
    description: {
        type: Schema.Types.String,
        required: false
    },
    venue_id: {
        type: Schema.Types.Number,
        required: false
    },
    riders_count: {
        type: Schema.Types.Number,
        required: false
    },
    name: {
        type: Schema.Types.String,
        required: false
    },
    create_date: {
        type: Schema.Types.Date,
        default: Date.now
    },
    change_date: {
        type: Schema.Types.Date,
        required: false
    },
    start_date: {
        type: Schema.Types.Date,
        required: false
    },
    end_date: {
        type: Schema.Types.Date,
        required: false
    }
});

export default mongoose.model('events', events);
