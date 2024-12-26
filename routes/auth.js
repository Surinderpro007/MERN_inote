const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const JWT_SECRET = "surinderisago0dboy"


// /api/auth/createuser no logo required
router.post("/createuser", [
  body('name').notEmpty().withMessage('Name is required'), 
  body('email', 'Enter a valid email').isEmail(),         
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async(req, res) => {
  const result = validationResult(req);

  // If there are errors, return the errors
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try{

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

     const user = await User.create({
          name : req.body.name,
          email : req.body.email,
          password : hashedPassword
        })
        const data= {
          user:{
            id:user.id
          }

        }
        const authToken = jwt.sign(data , JWT_SECRET)
        console.log(authToken)
        // return res.status(201).json(user)
        return res.status(201).json({authToken})
    } 
    catch(error){
            return res.status(500).json({message : "User with this emial already exist"})
    }

//   res.send(req.body); 
});

//  authenicate a login /api/auth/login no logo required

router.post("/login", [
  body('email', 'Enter a valid email').isEmail(),         
  body('password').isLength({ min: 8 }).exists()
], async(req, res) => {
  const result = validationResult(req);

  // If there are errors, return the errors
const error = await validationResult(req)

    // If there are errors, return the errors
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
      }

      const {email,password} = req.body
      try{

        const user = await User.findOne({email})
        if(!user){
          return res.status(400).json({error : "Try to login with valid email and password"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
          return res.status(400).json({error : "Try to login with valid email and password" })
      }
      const payload= {
        user:{
          id:user.id
        }

      }
      const authToken = jwt.sign(payload , JWT_SECRET)
      res.json(authToken)
    }
   catch(error){
    console.error(error.message)
    return res.status(500).json({message : "Internal server error"})

   }
      
})

module.exports = router;
