import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {generateToken}  from './controller/controller_authentication';
import * as Middleware from './middleware/middleware_chain';
dotenv.config(); 

const app = express();
const port = parseInt(process.env.AUTHENTICATION_SERVICES_PORT || '3100');
const host = process.env.AUTHENTICATION_SERVICES_HOST || 'authentication-services';

app.use(express.json());

/**
 * Definizione della rotta per generare un jwt
 */
app.post('/generate-token', Middleware.verifyInput, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await generateToken(req, res); 
    res.json(result);
});

/**
 * Inizializzazione dell server sulla porta dedicata
 */
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
