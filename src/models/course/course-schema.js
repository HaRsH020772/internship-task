const mongoose = require('mongoose');
const validator = require('validator');

const course_schema = new mongoose.Schema({
    course_name: {
        type: String,
        required: [true, "Provide the course name"]
    },
    course_category: {
        type: String,
        enum: ["Frontend", "Backend", "Devops", "Cyber Security"],
        required: [true, "Provide a course category"]
    },
    course_level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advance"],
        required: [true, "Provide a course level"]
    },
    students_attended: {
        type: Number,
        default: 0
    },
    course_description: {
        type: String,
        required: [true, "Provide a course description"]
    },
    course_price: {
        type: Number,
        required: [true, "Provide a course fees"]
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', course_schema);
module.exports = Course;