const express = require('express');
const router = express.Router();
const try_catch = require("../../middlewares/error-handler");
const { isLoggedIn } = require("../../middlewares/user-auth");
const upload = require("../../middlewares/file-handler");
const { testing_route, user_registration, user_login, update_profile, view_enrollment } = require('../../controller/user/user-controller');

router.route('/testing').get(testing_route);

//& Login and Registration route
router.route('/register').post(try_catch(user_registration));
router.route('/login').post(try_catch(user_login));

//& Profile Update
router.route('/').put(isLoggedIn, upload.single('file'), try_catch(update_profile));

//& View enrollment
router.route('/list-enrollment').get(isLoggedIn, try_catch(view_enrollment));

module.exports = router;