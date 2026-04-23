import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    id: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{9}$/, 'please enter 9-digites for the ID']
    },
    className: { type: String, required: true },
    lastLocation: {
        coordinates: {
            longitude: { degrees: String, minutes: String, seconds: String },
            latitude: { degrees: String, minutes: String, seconds: String }
        },
        time: { type: Date, default: Date.now }
    }
});
export default mongoose.model("student", studentSchema);
