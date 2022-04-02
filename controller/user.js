const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var User = require("../model/user");

let userControllerObject = {};


userControllerObject.adminSignUP = async (req, res) => {
    let {name, email, password, number} = req.body;

    if(!name || !email || !password){
        return res.status(200).send({success: false, message: "Please ensure that you have entered name, email and password"});
    }
    let foundUser = await User.findOne({email});

    if(foundUser) {
        return res.status(200).send({success: false, message: "This Email is already registered"});
    } else {
        let foundAdmin = await User.findOne({type: 'admin'});

        if(foundAdmin){
            return res.status(200).send({success: false, message: "There is already one admin, we can have only one admin"});
        } else {
            const saltRounds = 10;

            const hashed = bcrypt.hashSync(password, saltRounds);


            let userObj = {
                name,
                email,
                password: hashed,
                number,
                type: 'admin'
            }

            User.save(userObj).then(savedUser => {
                return res.status(200).send({success: true, message: "Admin has been saved"}); 
            }).catch(err => {
                console.log("ERROR IN SAVING ADMIN", err);
                return res.status(200).send({success: false, message: "There is some error in saving admin, please contact customer support"}); 
            })
        }
    }
}


userControllerObject.userSignUP = async (req, res) => {
    let {name, email, password, number} = req.body;

    if(!name || !email || !password){
        return res.status(200).send({success: false, message: "Please ensure that you have entered name, email and password"});
    }
    let foundUser = await User.findOne({email});

    if(foundUser) {
        return res.status(200).send({success: false, message: "This Email is already registered"});
    } else {
        const saltRounds = 10;

        const hashed = bcrypt.hashSync(password, saltRounds);


        let userObj = {
            name,
            email,
            password: hashed,
            number,
            type: 'user'
        }

        User.save(userObj).then(savedUser => {
            return res.status(200).send({success: true, message: "User has been saved"}); 
        }).catch(err => {
            console.log("ERROR IN SAVING USER", err);
            return res.status(200).send({success: false, message: "There is some error in saving user, please contact customer support"}); 
        })
    }
}

userControllerObject.userLogin = async (req, res) => {
    let {email, password} = req.body;

    if(!email || !password){
        return res.status(200).send({success: false, message: "Please ensure that you have entered email and password"});
    }
    let foundUser = await User.findOne({email});

    if(!foundUser) {
        return res.status(200).send({success: false, message: "This Email is not registered. Please signup first"});
    } else {

        if(foundUser.type === 'user' && foundUser.deleted === true){
            return res.status(200).send({success: false, message: "This user has been deleted, please contact admin"});
        } else {
            let savedPassword = foundUser.password;
            let passwordMatch =bcrypt.compareSync(passwoord, savedPassword);
            if(passwordMatch){
                let jwtToken = jwt.sign({
                    _id     		: foundUser._id,
                    email   		: foundUser.email,
                    name    		: foundUser.name,
                    type            : foundUser.type,
                    exp     		: parseInt((new Date().getTime()+3600000)/1000)
                }, "SECRET");
                return res.status(200).json({success: true, token: jwtToken, message: "Login Successfully"});
            } else {
                return res.status(200).send({success: false, message: "Invalid credentials"});
            }
        }
    }
}


userControllerObject.userList = async (req, res) => {

    let userList = await User.find({deleted: false});

    if(userList.length) {
        return res.status(200).json({success: true, data: userList});
    } else {
        return res.status(200).send({success: false, message: "No user present"});
    }
}


userControllerObject.updateUser = async (req, res) => {
    let {name, number} = req.body;
    let user_id = req.params.id;

    let foundUser = await User.findOne({_id: user_id});
    
    if(foundUser){
        User.updateOne({name, number}).then(updatedUser => {
            return res.status(200).json({success: true, message: "User has been updated"});
        }).catch(err => {
            console.log("ERROR IN UPDATING USER", err);
            return res.status(200).send({success: false, message: "There is error in updating user, please contact customer support"});
        })
    } else {
        return res.status(200).send({success: false, message: "No such user present"});
    }
}


userControllerObject.deleteUser = async (req, res) => {
    let user_id = req.params.id;

    let foundUser = await User.findOne({_id: user_id});
    
    if(foundUser){
        User.updateOne({deleted: true}).then(updatedUser => {
            return res.status(200).json({success: true, message: "User has been deleted"});
        }).catch(err => {
            console.log("ERROR IN DELETING USER", err);
            return res.status(200).send({success: false, message: "There is error in deleting user, please contact customer support"});
        })
    } else {
        return res.status(200).send({success: false, message: "No such user present"});
    }
}
module.exports = userControllerObject;
