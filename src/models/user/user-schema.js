const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select: false,
        validate: {
            validator: function(value) {
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
                return passwordRegex.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one digit, and one special character'
        }
    },
    profile: {
        public_id: {
            type: String,
            default: ""
        },
        secure_url: {
            type: String,
            default: ""
        }
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    }
}, {
    timestamps: true
})

//& encryption of password
user_schema.pre('save', async function (next) {
    
    if (!this.isModified('password'))
        return next();

    this.password = await bcrypt.hash(this.password, 10);
});

//& Password validation
user_schema.methods.isValidatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

//& JWT token generation
user_schema.methods.generate_jwt_token = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
}

const User = mongoose.model('User', user_schema);

module.exports = User;