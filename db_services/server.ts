import express, { Request, Response } from 'express';
import { createUser, addDataset, getAllUsers, getDatasets, getAllDataset, updateDataset, insertVideoIntoDataset, deleteDataset,
    visualizeCredits, rechargeCredits } from './routes_db/controller_db';
import * as Middleware from './middleware/middleware_chains';
import { EnumError, getError } from './factory/errors';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use((err: Error, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError) {
        const new_err = getError(EnumError.MalformedPayload).getErrorObj();
        res.status(new_err.status).json(new_err.message);
    }
    next();
});

// Definizione della rotta per creare un nuovo dataset vuoto
app.post('/createDataset', Middleware.checkGeneral, Middleware.createDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const dataset_name = req.body.dataset_name;
    console.log('dataset_name: ', dataset_name);
    const email: string = req.decodeJwt.email as string;
    console.log('Email: ', email);
    const result = await addDataset(dataset_name, email);
    res.json(result);
});

// Definizione della rotta per recuperare tutti i dataset di un utente
app.get('/getDataset', Middleware.checkGeneral, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    if (email && dataset_name) {
        const result = await getDatasets(email, dataset_name);
        res.json(result);
    } else if (email) {
        const result = await getDatasets(email);
        res.json(result);
    }
});

// Definizione della rotta per aggiornare un dataset
app.post('/updateDataset', Middleware.checkGeneral, Middleware.updateDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    const new_dataset_name = req.query.new_dataset_name as string;
    const result = await updateDataset(email, dataset_name, new_dataset_name);
    res.json(result);
});

// Definizione della rotta per aggiungere un contenuto a un dataset
app.put('/insertVideoIntoDataset', Middleware.checkGeneral, Middleware.insertVideo, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    console.log("/inserVIdeoIntoDataset: ", dataset_name);
    const new_videos = req.body.new_videos;
    const result = await insertVideoIntoDataset(email, dataset_name, new_videos);
    res.json(result);
});

// Definizione della rotta per eliminare un dataset
app.delete('/deleteDataset', Middleware.checkGeneral, Middleware.deleteDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    const result = await deleteDataset(email, dataset_name);
    res.json(result);
});

// Definizione della rotta per ottenere il numero di token residui per un certo utente
app.get('/getTokens', Middleware.checkGeneral, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const result = await visualizeCredits(email);
    res.json(result); 
});

/*********************************    AMMINISTRATORE    ************************************ */

// Definizione della rotta per l'inserimento di un nuovo utente
app.post('/insertUser', Middleware.checkGeneral, Middleware.checkPermission, Middleware.checkInsertUsers, Middleware.error_handling, async (req: any, res: Response) => {
    const { name, surname, email, type, residual_tokens } = req.body;
    const newUser = await createUser({ name, surname, email, type, residual_tokens });
    res.json(newUser);
});

// Definizione della rotta per ottenere tutti i dataset di tutti gli utenti
app.get('/getAllDataset', Middleware.checkGeneral, Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await getAllDataset();
    res.json(result);
});

// Definizione della rotta per ottenere tutti gli utenti
app.get('/getUsers', Middleware.checkGeneral, Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const users = await getAllUsers();
    res.json(users);
});

// Definizione della rotta per ottenere i token residui di tutti gli utenti
app.get('/allCredits', Middleware.checkGeneral, Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await visualizeCredits();
    res.json(result); 
});

// Definizione della rotta per ricaricare i token di un utente
app.put('/rechargeTokens', Middleware.checkJwt, Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.query.email as string;
    const tokens_to_charge = parseInt(req.query.tokens_to_charge as string);
    const result = await rechargeCredits(email, tokens_to_charge);
    res.json(result); 
});

app.get('/getAllTokens', Middleware.checkJwt, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await visualizeCredits();
    res.json(result); 
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
