import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {generateToken}  from './controller/controller_authentication';
import * as Middleware from './middleware/middleware_chain';
dotenv.config(); 

const app = express();
const port = parseInt(process.env.AUTHENTICATION_SERVICES_PORT as string) || 0;
const host = process.env.AUTHENTICATION_SERVICES_HOST || '';

app.use(express.json());

// Definizione della rotta per creare un nuovo dataset vuoto
app.post('/generate-token', Middleware.verifyInput , async (req: any, res: Response) => {
    console.log('Entrato nella chiamata');
    const result = await generateToken(req, res); 
    res.json(result);
});


app.listen(port, host,() => {
    console.log(`Server running at http://${host}:${port}`);
});
