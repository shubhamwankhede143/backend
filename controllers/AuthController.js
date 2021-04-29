const User = require('../models/User')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const express = require('express')
var CryptoJS = require("crypto-js");
var validator = require("email-validator");
const asyncRedis = require("async-redis");
const redisClient = require('../redis-client');
const NodeRSA = require('node-rsa');

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.PORT || 6379;

const client = asyncRedis.createClient({
    host: 'redis',
    port: 6379
});

client.on("error", function (error) {
    console.error(error);
});

const init = async (req, res, next) => {
    const publicKey = req.body.publicKey
    const userSecretKey = await randomStr(24, '12345689abcdefghighklmnopqrstuvwxyz')
    const key_public = new NodeRSA(publicKey, 'pkcs8-public')
    const apiEncryptionKey = await key_public.encrypt(userSecretKey, 'base64');
    const requestId = await randomStr(40, '12345689abcdefghighklmnopqrstuvwxyz')

    const userDetails = {
        "requestId": requestId,
        "userSecretKey": userSecretKey
    }

    // await client.set(requestId, JSON.stringify(userDetails));
    await redisClient.setAsync(requestId, JSON.stringify(userDetails));
    return res.json({
        status: true,
        result: {
            apiEncryptionKey: apiEncryptionKey,
            requestId: requestId,
        },
        message: 'Init api called'
    })
};

const getUserDetails = async (req, res) => {
    const id = req.params.userId;
    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).json({
                    status: false,
                    message: "Not found User with id " + id
                });
            else res.json({
                status: true,
                message: 'User data retrieved successfully',
                result: data
            });
        })
        .catch(err => {
            res.status(500)
                .send({ message: "Error retrieving User with id=" + id });
        });
}

const updateUser = async (req, res) => {

    const id = req.params.userId;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    status: false,
                    message: `Cannot update User with id=${id}. Maybe User was not found!`
                });
            } else res.json({
                status: true,
                message: "User updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
}

const register = async (req, res) => {
    var { email, password } = req.body;
    const requestId = req.header('requestId')
    if (!email || !password) {
        return res.json({
            status: false,
            message: 'email or password cant be empty'
        })
    }
    const rawData = await redisClient.getAsync(requestId);
    resultJSON = await JSON.parse(rawData);
    const { userNewSecretKey } = await resultJSON
    email = Decryption(email, userNewSecretKey)
    password = Decryption(password, userNewSecretKey)
    console.log("email :" + email, "password : " + password)

    const check = await validator.validate(email);
    if (!check) {
        return res.json({
            status: false,
            message: 'Invalid email address'
        })
    }
    const user = await User.findOne({ email })
    if (user) {
        return res.json({
            status: true,
            message: 'Email address already exists'
        })
    }
    console.log('Email :' + email + ' ' + 'Password :' + password)
    const social = await JSON.stringify(req.body.socialAccount)

    bcrypt.hash(password, 8, function (err, hash) {
        let user = new User({
            name: req.body.name,
            email: email,
            picture: req.body.picture,
            banner: req.body.banner,
            role: req.body.role,
            socialAccount: social,
            password: hash,
            status: "User Registered"
        })

        user.save()
            .then(user => {
                return res.json({
                    user: user,
                    status: true,
                    message: 'User Added Successfully'
                })
            })
            .catch(error => {
                return res.json({
                    status: false,
                    message: 'Error occured while adding user'
                })
            })
    });
};

const login = async (req, res) => {
    var { email, password } = req.body;
    var requestId = req.header('requestId')

    if (!email || !password) {
        return res.json({
            status: false,
            message: 'email or password cant be empty'
        })
    }
    const value = await client.get(requestId);
    resultJSON = JSON.parse(value);
    const { userSecretKey } = await resultJSON

    email = Decryption(email, userSecretKey)
    password = Decryption(password, userSecretKey)

    console.log('Email :' + email + ' ' + 'Password :' + password)
    const userData = await User.find({ email: email })
        .exec()
        .then(async userDetail => {
            if (userDetail.length < 1) {
                return res.json({
                    status: false,
                    message: 'User not found'
                })
            }
            console.log(userDetail)
            console.log("password :" +password ,"hash : "+userDetail[0].password)
            await bcrypt.compare(password, userDetail[0].password, async(err, result) => {
                console.log(err+"   "+result)
                if(!result){
                    return res.json({
                        status:false,
                        message:'Invalid username or password'
                    })
                }
                else {
                    console.log("password verified successfully")
                    const { _id } = userDetail
                    const user = { name: email }

                    const userNewSecretKey = await randomStr(24, '12345689abcdefghighklmnopqrstuvwxyz')
                    const newApiEncryptionKey = await Encryption(userNewSecretKey, userSecretKey);
                    const newRequestId = await randomStr(40, '12345689abcdefghighklmnopqrstuvwxyz')
                    const userDetails = {
                        "newRequestId": newRequestId,
                        "userNewSecretKey": userNewSecretKey,
                    }

                    await client.set(newRequestId, JSON.stringify(userDetails));
                    const authToken = jwt.sign(user, 'MY SECRET KEY')
                    return res.json({
                        status: true,
                        result: {
                            authToken: authToken,
                            userId: _id,
                            apiEncryptionKey: newApiEncryptionKey,
                            requestId: newRequestId
                        }
                    })

                }
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                status: false,
                error: err,
                message: 'Error in user auth'
            })
        })
    // const userData = await User.findOne({ email })
    // console.log(userData.password)
    // if (!userData) {
    //     return res.json({
    //         status: false,
    //         message: 'Email address not found'
    //     })
    // }
    // console.log("password :"+password)
    // await bcrypt.compare(password, userData.password, function(err, isMatch) {
    //   if (!isMatch) {
    //        res.json({
    //           status: false,
    //           message: 'Invalid password'
    //       })
    //     }
    //   })
}


const getAllUser = async (req, res, next) => {
    var { page, size } = req.body
    const { order, field } = req.body.sortBy
    page = page - 1
    await User.find(req.body.conditions)
        .select("name email banner picture role socialAccount status")
        .sort({ field: order })
        .limit(size)
        .skip(size * page)
        .then((results) => {
            return res.json({
                page: page + 1,
                size: size,
                results: results
            })
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const Encryption = (data, userSecretKey) => {
    let passPhrase = userSecretKey;
    const encryptionData = CryptoJS.AES.encrypt(data, passPhrase).toString();
    return encryptionData;
}

const Decryption = (data, userSecretKey) => {
    let passPhrase = userSecretKey;
    const bytes = CryptoJS.AES.decrypt(data, passPhrase);
    const decryptionData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptionData;
}

function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans +=
            arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

function encrypt(text, userSecretKey) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex') + ':' + iv.toString('hex') + '=' +
        key.toString('hex');
}

function decrypt(text) {
    let iv = Buffer.from((text.split(':')[1]).split('=')[0], 'hex')//will return iv;
    let enKey = Buffer.from(text.split('=')[1], 'hex')//will return key;
    let encryptedText = Buffer.from(text.split(':')[0], 'hex');//returns encrypted Data
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(enKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
    //returns decryptedData
}

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    var valid = emailRegex.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return false;

    return true;
}

module.exports = {
    register, init, getUserDetails, login, getAllUser, updateUser
}