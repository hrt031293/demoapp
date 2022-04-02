var express = require('express');
var router = express.Router();
var userApi = require("../controller/user");
var productApi = require("../controller/product");
const jwt = require('jsonwebtoken');

var verifyToken = function(req,res,next){
    let token;
	if (req.headers.authorization){		
	 	if(req.headers.authorization.split(' ')[0] === 'Bearer') {
        	token = req.headers.authorization.split(' ')[1];
	 	}else{			 
	 		token = null
	 	}
    } else if (req.cookies.Auth ||req.query && req.query.token) {
       	token  = req.cookies.Auth;
    }
	if(token){
		jwt.verify(token, "SECRET", (err,decoded) => {
			if(err){
				if(err.message =="jwt expired"){
					return res.status(200).json({success:false, message:'Token expired, please Signin again'});
				}
				return res.status(200).json({success:false, message:'You are not authenticated user.'});
			} else {
				User.findOne({_id: decoded._id}).then((response) => {
					if(!response || response=='')return res.status(200).send({ success: false, message: 'User not found.'});
					if(response){
								req.user_data = response;
								return next();
					}else{
						return res.status(200).send({ success: false, message: 'User not found or some error has been occured.'});
					}
				}).catch((err) => {
                    console.log("ERROR IN VERIFYING TOKEN", err);
                    return res.status(200).send({ success: false, message: 'Something went wrong, please try after sometime'});
				});
			}
		});
	} else {
		return res.status(200).send({ success: false, message: 'No token provided.'});
	}
};


/* GET apis listing. */
router.post('/adminSignUp', userApi.adminSignUP);
router.post('/userSignUp', userApi.userSignUP);
router.post('/login', userApi.userLogin);
router.get('/usersList',verifyToken, userApi.userList);
router.get('/updateUser/:_id', verifyToken, userApi.updateUser);
router.get('/deleteUser/:_id', verifyToken, userApi.deleteUser);

router.post('/addProduct', verifyToken, productApi.addProduct);
router.get('/productsList', verifyToken, productApi.productList);
router.get('/updateProduct/:_id', verifyToken, productApi.updateProduct);
router.get('/deleteProduct/:_id', verifyToken, productApi.deleteProduct);


module.exports = router;
