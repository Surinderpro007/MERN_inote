const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


router.post("/", [
  body('name').notEmpty().withMessage('Name is required'), 
  body('email', 'Enter a valid email').isEmail(),         
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async(req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try{

     const user = await User.create({
          name : req.body.name,
          email : req.body.email,
          password : req.body.password
        })
        return res.status(201).json(user)
    } 
    catch(error){
            return res.status(500).json({message : "Internal Server Error"})
    }

//   res.send(req.body); 
});

module.exports = router;
