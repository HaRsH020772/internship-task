const resend = require('resend');

exports.get_resend_obj = () => {
    return new resend.Resend(process.env.RESEND_API_TOKEN)
}