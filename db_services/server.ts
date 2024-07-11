import express, { Request, Response } from 'express';
import { createUser, addDataset, getAllUsers, getDatasets, getAllDataset, updateDataset, insertVideoIntoDataset, deleteDataset,
    visualizeCredits, rechargeCredits } from './routes_db/controller_db';
import * as Middleware from './middleware/middleware_chains';
import { EnumError, getError } from './factory/errors';
import dotenv from 'dotenv';
import { queue } from './Bull/bull'
import { getUserJobs, getResult } from './routes_db/controller_jobs';
import { completedJobResults } from './Bull/bull';
import { generateJwt } from './routes_db/controller_authentication';

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
app.post('/generate-jwt', Middleware.error_handling, async (req: any, res: Response) => {
    const result = await generateJwt(req, res);
    res.json(result);
});


// Definizione della rotta per creare un nuovo dataset vuoto
app.post('/create-dataset', Middleware.checkPayloadHeader,Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.createDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const dataset_name = req.body.dataset_name;
    console.log('dataset_name: ', dataset_name);
    const email: string = req.decodeJwt.email as string;
    console.log('Email: ', email);
    const result = await addDataset(dataset_name, email, res);
    res.json(result);
});

// Definizione della rotta per recuperare tutti i dataset di un utente
app.get('/dataset', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.getDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    if (email && dataset_name) {
        const result = await getDatasets(email, res, dataset_name);
        res.json(result);
    } else if (email) {
        const result = await getDatasets(email, res);
        res.json(result);
    }
});

// Definizione della rotta per aggiornare un dataset
app.post('/modify-dataset', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.updateDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    const new_dataset_name = req.query.new_dataset_name as string;
    const result = await updateDataset(email, dataset_name, new_dataset_name, res);
    res.json(result);
});

// Definizione della rotta per classificare i video di un dataset
app.post('/inference', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.doInference, Middleware.error_handling, async (req: any, res: Response) => {
    console.log('soreta');
    const dataset_name: string = req.query.dataset_name;
    const model_name: string = req.query.model_name;
    const email = req.decodeJwt.email as string;
    const job = await queue.add({ email: email, dataset_name: dataset_name, model_name: model_name });
    res.json({ job_id: job.id });
});

// Definizione della rotta per ritornare il risultato di un processo in coda in base al suo id
app.get('/result', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.result, Middleware.error_handling, async (req: any, res: Response) => {
    const job_id = req.query.id;
    const jobResult = await getResult(job_id, res);
    res.json(jobResult);
});

// Definizione della rotta per aggiungere un contenuto a un dataset 
app.put('/dataset/insert-videos', Middleware.checkPayloadHeader , Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.insertVideo, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    console.log("/inserVIdeoIntoDataset: ", dataset_name);
    const new_videos = req.body.new_videos;
    const result = await insertVideoIntoDataset(email, dataset_name, new_videos, res);
    res.json(result);
});

// Definizione della rotta per eliminare un dataset
app.delete('/remove-dataset', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.deleteDataset, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    const result = await deleteDataset(email, dataset_name, res);
    res.json(result);
});

// Definizione della rotta per ottenere il numero di token residui per un certo utente
app.get('/tokens', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    const result = await visualizeCredits(res, email);
    res.json(result); 
});

// Definizione della rotta per restituire i processi di un utente
app.get('/user-jobs', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.decodeJwt.email as string;
    console.log('/user-jobs');
    const result = await getUserJobs(email, res);
    res.json(result); 
});



/*********************************    AMMINISTRATORE    ************************************ */

// Definizione della rotta per l'inserimento di un nuovo utente
app.post('/admin/create-user', Middleware.checkPayloadHeader, Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.checkPermission, Middleware.checkInsertUsers, Middleware.error_handling, async (req: any, res: Response) => {
    const { name, surname, email, type, residual_tokens } = req.body;
    const newUser = await createUser({ name, surname, email, type, residual_tokens });
    res.json(newUser);
});

// Definizione della rotta per ottenere tutti i dataset di tutti gli utenti
app.get('/admin/dataset', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await getAllDataset(res);
    res.json(result);
});

// Definizione della rotta per ottenere tutti gli utenti
app.get('/admin/users', Middleware.checkAuthHeader, Middleware.checkGeneral, Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const users = await getAllUsers(res);
    res.json(users);
});

// Definizione della rotta per ricaricare i token di un utente
app.put('/admin/recharge-tokens',Middleware.checkAuthHeader, Middleware.checkJwt, Middleware.checkPermission, Middleware.rechargeCredits, Middleware.error_handling, async (req: any, res: Response) => {
    const email = req.query.email as string;
    const tokens_to_charge = parseInt(req.query.tokens_to_charge as string);
    const result = await rechargeCredits(email, tokens_to_charge, res);
    res.json(result); 
});

// Definizione della rotta per ottenere i tokens di tutti gli utenti
app.get('/admin/tokens', Middleware.checkAuthHeader, Middleware.checkJwt,  Middleware.checkPermission, Middleware.error_handling, async (req: any, res: Response) => {
    const result = await visualizeCredits(res);
    res.json(result); 
});

/** 
 * Gestione delle rotte non previste
 */ 
app.get('*', Middleware.other_route, Middleware.error_handling);
app.post('*', Middleware.other_route, Middleware.error_handling);
app.put('*', Middleware.other_route, Middleware.error_handling);
app.delete('*', Middleware.other_route, Middleware.error_handling);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
