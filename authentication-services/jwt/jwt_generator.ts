import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 
const secretKey = process.env.JWT_SECRET_KEY || '';

export enum typeOfUser {
  ADMIN = 'ADMIN',
  USER = 'USER'
}



export async function createJwt(email: String, type: typeOfUser, expirationTime:number): Promise<any>{
  const payload= {
    email: email,
    role: type
  };

  const options: jwt.SignOptions = {
    algorithm: 'HS256',  
    expiresIn: expirationTime + 'h'       
  };
  return {
    successo: true,
    token: jwt.sign(payload, secretKey, options) as string
  }
  
}


