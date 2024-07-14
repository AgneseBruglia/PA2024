import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || '';

// Struttra dati per distinguere la tipologia di utente
export enum typeOfUser {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

/**
 * Funzione 'createJwt
 * 
 * Funzione per la creazione del jwt token per l'autenticazione degli utenti.
 * 
 * @param email Email dell'utente di cui generare il jwt
 * @param type Tipo dell'utente di cui generare il jwt
 * @param expirationTime Tempo (espresso in giorni) per cui si vuole che il jwt sia valido
 */
export async function createJwt(email: String, type: typeOfUser, expirationTime: number): Promise<any> {
  const payload = {
    email: email,
    role: type
  };
  const options: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: expirationTime + 'd'
  };
  return {
    successo: true,
    token: jwt.sign(payload, secretKey, options) as string
  }
}
