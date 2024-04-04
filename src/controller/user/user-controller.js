const User = require('../../models/user/user-schema');
const { StatusCodes } = require("http-status-codes");
const CustomError = require('../../utilities/custom-error');
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../../utilities/media-handler");
const { send_mail_on_registration } = require("../../utilities/mail-sender");
const Course_Enrollment = require("../../models/course-enrollment/course-enrollment-schema");

exports.testing_route = async (req,res,next) => {

    try {
        return res.status(StatusCodes.OK).json({
            message: "user route was working fine",
            status: true
        })
    } catch (error) {
        console.log(error);
    }

};

exports.user_registration = async (req, res, next) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password)
        return next(new CustomError("Provide proper data", StatusCodes.BAD_REQUEST, false));

    let verify_user_existence = await User.findOne({
        email
    });

    if(verify_user_existence)
        return next(new CustomError("Go for login porcedures", StatusCodes.BAD_REQUEST, false));

    let create_user = await User.create({
        name,
        email,
        password
    });

    if(!create_user)
        next(new CustomError("Internal server error, please try again later", StatusCodes.INTERNAL_SERVER_ERROR, false));

    let jwt_token = await create_user.generate_jwt_token();

    //? As emails are notificaitons but to hold the execution is not meaning full here
    send_mail_on_registration(create_user.email, create_user.name);

    return res.status(StatusCodes.CREATED).json({
        message: "user created successfully",
        status: true,
        token: jwt_token
    });
}

exports.user_login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password)
        return next(new CustomError("Please provide proper email and password", StatusCodes.BAD_REQUEST, false));

    //? Find the user from email check it exists or not
    let find_user = await User.findOne({
        email
    }).select("+password");

    if(!find_user)
        return next(new CustomError("No user found please go for registration", StatusCodes.NOT_FOUND, false));

    //? Confirmation for password
    if(!(await find_user.isValidatePassword(password)))
        return next(new CustomError("Wrong credentials", StatusCodes.BAD_REQUEST, false));

    let jwt_token = await find_user.generate_jwt_token();

    return res.status(StatusCodes.OK).json({
        message: "logged in successfully",
        token: jwt_token
    });
}

exports.update_profile = async(req, res, next) => {

    const {email, name} = req.body;

    //? Collect updates
    let updates = {};

    if(email)
        updates.email = email;
    if(name)
        updates.name = name;

    if(req.file)
    {
        //? If there is any existing file then delete that and add new one
        if(req.user.profile.public_id !== "" && req.user.profile.secure_url !== "")
        {
            const confirmDeletion = await deleteFileFromCloudinary(req.user.profile.public_id);

            if(confirmDeletion)
                await User.findByIdAndUpdate({
                    _id: req.user._id
                }, {
                    "profile.public_id": "",
                    "profile.secure_url": ""
                });
        }

        const {public_id, secure_url} = await uploadFileToCloudinary(req, "user", "image");

        let profile = {
            public_id,
            secure_url
        }

        if(!public_id || !secure_url)
            return next(new CustomError("Issues in uploading image try again later", StatusCodes.INTERNAL_SERVER_ERROR, false));

        updates.profile = profile;
    }

    //? Final update to user
    let update_user = await User.findOneAndUpdate(req.user._id, updates);

    if(!update_user)
        return next(new CustomError("Internal server error try again later", StatusCodes.INTERNAL_SERVER_ERROR, false));

    return res.status(StatusCodes.OK).json({
        message: "user data updated successfully",
        status: true
    });
}

exports.view_enrollment = async(req, res, next) => {

    let collect_enrollments = await Course_Enrollment.find({
        user_id: req.user._id
    });

    return res.status(StatusCodes.OK).json({
        message: "Retrieved the enrollments successfully",
        enrollments: collect_enrollments
    });
}