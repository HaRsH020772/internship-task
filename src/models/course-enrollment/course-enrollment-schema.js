const mongoose = require('mongoose');

const course_enrollment_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String, 
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }
}, {
    timestamps: true
});

const Course_Enrollment = mongoose.model('Course_Enrollment', course_enrollment_schema);
module.exports = Course_Enrollment;