const Course = require('../../models/course/course-schema');
const Course_Enrollment = require("../../models/course-enrollment/course-enrollment-schema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../../utilities/custom-error');
const { send_mail_on_course_creation, send_mail_on_enrollment } = require("../../utilities/mail-sender")

exports.testing_route = async (req, res, next) => {

    try {
        return res.status(StatusCodes.OK).json({
            message: "course route was working fine",
            status: true
        })
    } catch (error) {
        console.log(error);
    }

}

exports.create_course = async (req, res, next) => {

    const { course_name, course_category, course_level, course_description, course_price } = req.body;

    if (!course_name || !course_category || !course_level || !course_description || !course_price)
        return next(new CustomError("Provide all the data for course", StatusCodes.BAD_REQUEST, false));

    let create_course = await Course.create({
        course_name,
        course_category,
        course_description,
        course_level,
        course_price
    });

    if (!create_course)
        return next(new CustomError("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, false));

    send_mail_on_course_creation(create_course.course_name, create_course.course_category, req.user.email);

    return res.status(StatusCodes.CREATED).json({
        message: "course created successfully",
        status: true
    });
}

exports.get_course_list = async (req, res, next) => {

    let { upperPriceRange, lowerPriceRange, courseCategory, courseLevel, pageNumber, pageSize } = req.body;

    const match = {};

    if (parseInt(upperPriceRange)) {
        match.course_price = { $lte: upperPriceRange };
    }
    if (parseInt(lowerPriceRange)) {
        match.course_price = { ...match.course_price, $gte: lowerPriceRange };
    }
    if (courseCategory) {
        match.course_category = courseCategory;
    }
    if (courseLevel) {
        match.course_level = courseLevel;
    }

    // Aggregate pipeline
    const pipeline = [
        { $match: match },
        { $skip: (parseInt(pageNumber) - 1) * parseInt(pageSize) },
        { $limit: parseInt(pageSize) }
    ];

    let courses;

    if(Object.keys(match).length !== 0)
        courses = await Course.aggregate(pipeline);
    else
    {
        let skip = (pageNumber - 1) * pageSize;
        courses = await Course.find()
            .skip(skip)
            .limit(pageSize);
    }

    if (courses.length < 1)
        return res.status(StatusCodes.OK).json({
            message: "No courses found", 
            status: false
        });

    return res.status(StatusCodes.OK).json({
        message: "Courses finded",
        courses
    });
}

exports.enroll_in_course = async(req, res, next) => {
    const {course_id} = req.body;

    let verify_course = await Course.findById(course_id);

    if(!verify_course)
        return next(new CustomError("No course found", StatusCodes.NOT_FOUND, false));

    //? verify that user was not already enrolled
    let check_enrollment_status = await Course_Enrollment.findOne({
        user_id: req.user.id,
        course_id
    });

    if(check_enrollment_status)
        return next(new CustomError("Already enrolled in this course", StatusCodes.BAD_REQUEST, false));
    
    //? Making a enrollment in course
    let create_enrollment = await Course_Enrollment.create({
        course_id: course_id,
        user_id: req.user._id,
        user_email: req.user.email,
        user_name: req.user.name
    });

    //? Increasing the enrollment status in course
    if(create_enrollment)
        await Course.findByIdAndUpdate(course_id, {
            $inc: {
                students_attended: 1
            }
        });

    //? Not using await as it can slow down the enrollment process, mail will fire after delay of milli-second
    send_mail_on_enrollment(verify_course.course_name, req.user.email)

    return res.status(StatusCodes.CREATED).json({
        message: "Enrolled in course successfully",
        status: true
    });
}

exports.delete_course = async(req, res, next) => {
    const {course_id} = req.body;

    const delete_course = await Course.findByIdAndDelete(course_id);

    return res.status(StatusCodes.OK).json({
        message: "Deleted the course successfully",
        status: true
    });
}

exports.update_course = async (req, res, next) => {
    const {course_price, course_name, course_description, course_category, course_level, course_id} = req.body;

    const updateDocument = {};
    
    if (course_price) updateDocument.course_price = course_price;
    if (course_name) updateDocument.course_name = course_name;
    if (course_description) updateDocument.course_description = course_description;
    if (course_category) updateDocument.course_category = course_category;
    if (course_level) updateDocument.course_level = course_level;

    let update_course = await Course.findByIdAndUpdate(course_id, updateDocument);

    return res.status(StatusCodes.OK).json({
        message: "course updated successfully",
        status: true
    });
}