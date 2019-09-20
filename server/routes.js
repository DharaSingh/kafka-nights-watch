
// Initialize express router
let router = require('express').Router();



var usercontroller = require('./controllers/user');
// Contact routes
router.route('/user').post(usercontroller.create);
router.route('/user').get(usercontroller.get)


module.exports = router;
