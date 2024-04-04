const { get_resend_obj } = require("../config/mail-config");

exports.send_mail_on_registration = async (mail_to, user_name) => {

    await get_resend_obj().emails.send({
        from: process.env.RESEND_EMAIL,
        to: mail_to,
        subject: `Successfully registered ${user_name}`,
        html: '<p>Congrats you have been registered successfully !</p>'
    });
}

exports.send_mail_on_course_creation = async (course_name, course_category, mail_to) => {

    await get_resend_obj().emails.send({
        from: process.env.RESEND_EMAIL,
        to: mail_to,
        subject: `Course ${course_name} registered`,
        html: `<h4>Successfully registered the course ${course_name} of category ${course_category}</h4>`
    })
}

exports.send_mail_on_enrollment = async (course_name, mail_to) => {

    await get_resend_obj().emails.send({
        from: process.env.RESEND_EMAIL,
        to: mail_to,
        subject: `Enrollment in ${course_name} Course`,
        html: `<h4>Successfully enrolled into the ${course_name} course.</h4>`
    })
}