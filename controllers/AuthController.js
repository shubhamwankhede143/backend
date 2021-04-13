const User = require('../models/User')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const express = require('express')
var CryptoJS = require("crypto-js");
var validator = require("email-validator");

//node rsa
const NodeRSA = require('node-rsa');

const init = async (req, res, next) => {
    const publicKey = req.body.publicKey
    const userSecretKey = await randomStr(24, '12345689abcdefghighklmnopqrstuvwxyz')
    const key_public = new NodeRSA(publicKey, 'pkcs8-public')
    const apiEncryptionKey = await key_public.encrypt(userSecretKey, 'base64');
    const requestId = await randomStr(40, '12345689abcdefghighklmnopqrstuvwxyz')
    req.session.requestId = requestId
    req.session.apiEncryptionKey = apiEncryptionKey
    req.session.userSecretKey = userSecretKey
    req.session.save();
    console.log(req.cookies['connect.sid'])
    res.set('cookie', req.cookies['connect.sid']);
    
    return res.json({
        status: true,
        result: {
            apiEncryptionKey: apiEncryptionKey,
            requestId: requestId,
            cookie : req.cookies['connect.sid']
        },
        message: 'Init api called'
    })
};

const getUserDetails = async (req, res) => {
    const apiEncryptionKey = await req.session.apiEncryptionKey
    const requestId = await req.session.requestId
    const userSecretKey = await req.session.userSecretKey
    console.log(req)
    console.log(requestId)
    return res.json({
        apiEncryptionKey: apiEncryptionKey,
        requestId: requestId,
        userSecretKey: userSecretKey
    })
}

const register = async (req, res) => {
    const { email, password } = req.body;
    const requestId = req.header('requestId')
    const userSecret = req.session.userSecretKey;
    // if (!userSecret) {
    //     return res.json({
    //         status: false
    //         , message: 'session closed'
    //     })
    // }

    // if(!requestId || (requestId!= req.session.requestId)){
    //     return res.json({
    //         status:false,
    //         message:'Request id either empty or invalid'
    //     })
    // }

    if (!email || !password) {
        return res.json({
            status: false,
            message: 'email or password cant be empty'
        })
    }

    const check = await validator.validate(req.body.email);
    if(!check){
        res.json({ 
            status:false,
            message:'Invalid email address'
        })
    }

    const user = await User.findOne({ email })
        if (user) {
            return res.json({
                status:true,
                message:'Email address already exists'
            })
          }

    // username = Decryption(username, userSecret)
    // password = Decryption(password, userSecret)
    console.log('Email :' + email + ' ' + 'Password :' + password)

    bcrypt.hash(req.body.password, 8, function (err, hash) {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            picture: req.body.phone,
            role: 'user',
            password: hash,
            description: req.body.description,
            status: req.body.status
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
    const { email, password } = req.body;
    const userSecret = req.session.userSecretKey;
    if (!email || !password) {
        return res.json({
            status: false,
            message: 'email or password cant be empty'
        })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({
            status:true,
            message:'Email address not found'
        })
      }
}

function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    
console.log(validateEmail('anystring@anystring.anystring'));


const Encryption = (data, userSecretKey) => {
    let passPhrase = userSecretKey;
    const encryptionData = CryptoJS.AES.encrypt(data, passPhrase).toString();
    return encryptionData;
}
// 
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
    //returns encryptedData:iv=key
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

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

module.exports = {
    register, init, getUserDetails
}

