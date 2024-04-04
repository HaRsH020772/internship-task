const express = require('express');
const router = express.Router();
const try_catch = require("../../middlewares/error-handler");
const { isLoggedIn, roleRestrictions } = require("../../middlewares/user-auth");
const { testing_route, create_course, get_course_list, enroll_in_course, delete_course, update_course } = require('../../controller/course/course-controller');

router.route('/testing').get(testing_route);
router.route('/list-courses').post(isLoggedIn, try_catch(get_course_list));

//& Admin secured API's
router.route('/create-course').post(isLoggedIn, roleRestrictions('admin'), try_catch(create_course));
router.route('/delete-course').post(isLoggedIn, roleRestrictions('admin'), try_catch(delete_course));
router.route('/update-course').post(isLoggedIn, roleRestrictions('admin'), try_catch(update_course));

//& Course enrollment
router.route('/enroll').post(isLoggedIn, try_catch(enroll_in_course));

module.exports = router;