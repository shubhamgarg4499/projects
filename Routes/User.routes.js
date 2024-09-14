const express = require("express");
const router = express.Router();
const { RegisterUser, verifyOtp, sendOtp, userLogin, userLogout, updateMobileNumber, updateAddress, updatePassword, resetPassword, checkPassResetToken, updateprofilepicture } = require('../controllers/user.controller')
const { addProduct, removeProduct, updateProduct, getAllProduct, filterProduct } = require('../controllers/Product.controller');
const { gendercategory, updateCategory, deleteCategory, getAllCategory } = require("../controllers/genderCategory.controllers");
const { createSubCategory, getAllSubCategory, updateSubCategory, deleteSubCategory } = require("../controllers/Subcategory.controller");
const { ReviewRating, getRating, getAllReviews } = require("../controllers/Review&Ratings");
const verifyOTPTime = require("../Middlewares/VerifyOTP");
const asyncHandler = require("../Middlewares/AsyncHandler");
const checkAccessToken = require("../Middlewares/CheckToken.middleware");
const checkIsAdmin = require("../Middlewares/isAdmin");
const { makeUserAdmin, removeUserAdmin } = require("../controllers/manageAdminRole.controller");
const upload = require("../Middlewares/multer");
const createOrders = require("../controllers/orders.controllers");
const { createTopLevelCategory, readAllTopLevelCategories, updateTopLevelcategory, deleteTopLevelcategory } = require("../controllers/category.controller");
const { createchildSubCategory, getAllchildSubCategory, updatechildSubCategory, deletechildSubCategory } = require("../controllers/childSubCategory.controller");
const persistLogin = require("../controllers/PersistLogin.controller");
// const { filterProduct } = require("../controllers/Filter.controller");

router.route('/getAllReviews/review').get(getAllReviews)
router.route('/getAllProduct').get(getAllProduct)
router.route('/product').post(filterProduct)

router.route('/removeAdmin').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), removeUserAdmin)
router.route('/makeAdmin').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), makeUserAdmin)
router.route('/addProduct').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), upload.fields([{ name: 'productImages', maxCount: 5 }]), addProduct)
router.route('/removeProduct').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), removeProduct)
router.route('/updateProduct/').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), updateProduct)



/////////////categories apis starts from here////////////


////////////top level category apis////////////

router.route('/createTopLevelCategory').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), createTopLevelCategory)
router.route('/readAllTopLevelCategories').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), readAllTopLevelCategories)
router.route('/updateTopLevelcategory/:categoryId').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), updateTopLevelcategory)
router.route('/deleteTopLevelcategory/:categoryId').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), deleteTopLevelcategory)


/////////////////////// gender categories apis/////////////
router.route('/createGenderCategory').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), gendercategory)
router.route('/getCategory').post(getAllCategory)
router.route('/updateCategory/:id').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), updateCategory)
router.route('/deleteCategory/:id').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), deleteCategory)


/////////////////sub category apis//////////////////
router.route('/createSubCategory').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), createSubCategory)
router.route('/getSubCategory').post(getAllSubCategory)
router.route('/updateSubCategory/:id').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), updateSubCategory)
router.route('/deleteSubCategory/:id').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), deleteSubCategory)



////////////////child sub categories apis//////////////////


router.route('/createchildSubCategory').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), createchildSubCategory)
router.route('/getAllchildSubCategory').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), getAllchildSubCategory)
router.route('/updatechildSubCategory/:id').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), updatechildSubCategory)
router.route('/deletechildSubCategory/:id').post(asyncHandler(checkAccessToken), asyncHandler(checkIsAdmin), deletechildSubCategory)






router.route('/checkResetPasswordToken?').post(checkPassResetToken)
router.route('/resetPassword').post(resetPassword)
// router.route('/getRatingReview').post(asyncHandler(checkAccessToken), getRatingReview)
router.route('/updateprofilepicture').post(asyncHandler(checkAccessToken), upload.single('profilePicture'), updateprofilepicture)
router.route('/updatepassword').post(asyncHandler(checkAccessToken), updatePassword)
router.route('/postReview').post(asyncHandler(checkAccessToken), ReviewRating)
router.route('/getRating/reviews').post(asyncHandler(checkAccessToken), getRating)
router.route('/createOrders').post(asyncHandler(checkAccessToken), createOrders)



// //////////////////Authentication routes///////////////////////////

router.route('/checkAuthentication').post(persistLogin)
router.route('/sendotp').post(asyncHandler(verifyOTPTime), sendOtp)
router.route('/verifyotp').post(verifyOtp)
router.route('/register').post(RegisterUser)
router.route('/login').post(userLogin)
router.route('/logout').post(asyncHandler(checkAccessToken), userLogout)
router.route('/updateMobileNumber').post(asyncHandler(checkAccessToken), updateMobileNumber)
router.route('/updateAddress').post(asyncHandler(checkAccessToken), updateAddress)
// router.route('/resendotp').post(asyncHandler(verifyOTPTime), reSendOTP)

module.exports = router

