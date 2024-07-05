import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 
const secretKey = process.env.JWT_SECRET_KEY || '';

// I dati che vuoi inserire nel payload del JWT
const payload_user = {
  id: "2",
  name: "Luca",
  surname: "Bellante",
  role: "USER"
};

const payload_admin = {
    id: "1",
    name: "Agnese",
    surname: "Bruglia",
    role: "ADMIN"
  };
  

// USER
const options_user: jwt.SignOptions = {
  algorithm: 'HS256',  
  expiresIn: '24h'     
};
const token_user = jwt.sign(payload_user, secretKey, options_user);
console.log("JWT USER:", token_user);


// ADMIN
const options_admin: jwt.SignOptions = {
    algorithm: 'HS256',  
    expiresIn: '24h'      
  };
const token_admin = jwt.sign(payload_admin, secretKey, options_admin);
console.log("JWT ADMIN:", token_admin);
