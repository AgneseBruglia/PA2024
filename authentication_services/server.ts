import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {generateToken}  from './controller/controller_authentication';
import * as Middleware from './middleware/middleware_chain';
dotenv.config(); 

const app = express();
const port = parseInt(process.env.AUTHENTICATION_SERVICES_PORT as string);
const host = process.env.AUTHENTICATION_SERVICES_HOST;

app.use(express.json());

// Definizione della rotta per creare un nuovo dataset vuoto
app.post('/generate-token', Middleware.verifyInput, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await generateToken(req, res); 
    res.json(result);

});


app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});
