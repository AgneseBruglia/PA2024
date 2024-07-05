import express, { Request, Response } from 'express';
import { createUser, addDataset, getAllUsers, getDatasets, getAllDataset, updateDataset, insertVideoIntoDataset, deleteDataset,
    visualizeCredits, rechargeCredits 
 } from './routes_db/controller_db';
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

// Route per l'inserimento di un nuovo utente
app.post('/insertUser', Middleware.checkInsertUsers, Middleware.error_handling, async (req: Request, res: Response) => {
    const { name, surname, email, type, residual_tokens } = req.body;
    const newUser = await createUser({ name, surname, email, type, residual_tokens });
    res.json(newUser);
});

app.post('/createDataset', Middleware.createDataset, Middleware.error_handling, async (req: Request, res: Response) => {
    const { dataset_name, id_user } = req.body;
    const result = await addDataset(dataset_name, id_user);
    res.json(result);
});



// Definizione della rotta per recuperare tutti i dataset di un utente
app.get('/getDataset', Middleware.getDataset, Middleware.error_handling, async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;
    if (id_user && dataset_name) {
        const result = await getDatasets(id_user, dataset_name);
        res.json(result);
    } else if (id_user) {
        const result = await getDatasets(id_user);
        res.json(result);
    }
});




// Rotta per aggiornare un dataset
app.post('/updateDataset', Middleware.checkUsers, Middleware.updateDataset, Middleware.error_handling, async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;
    const new_dataset_name = req.query.new_dataset_name as string;
    const result = await updateDataset(id_user, dataset_name, new_dataset_name);
    res.json(result);
});

// Rotta per aggiungere video a un dataset
app.put('/insertVideoIntoDataset', Middleware.checkUsers,Middleware.insertVideo, Middleware.error_handling, async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;
    const new_videos = req.body.new_videos;

    const result = await insertVideoIntoDataset(id_user, dataset_name, new_videos);
    res.json(result);
});

// Rotta DELETE per eliminare un dataset
app.delete('/deleteDataset', Middleware.checkUsers, Middleware.deleteDataset, Middleware.error_handling, async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;

    const result = await deleteDataset(id_user, dataset_name);
    res.json(result);
});



app.get('/credits', Middleware.checkUsers, Middleware.error_handling, async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;

    const result = await visualizeCredits(id_user);
    res.json(result); 
});


//*********************************    AMMINISTRATORE    ************************************ */


app.get('/getAllDataset', async (req: Request, res: Response) => {
    const result = await getAllDataset();
    res.json(result);
});

// Definizione della rotta per recuperare tutti gli utenti(ADMIN)
app.get('/getUsers', async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.status(200).json(users);
});

app.get('/allCredits', async (req: Request, res: Response) => {
    const result = await visualizeCredits();
    res.json(result); 
});


// Rotta PUT per ricaricare i crediti di un utente
app.put('/rechargeCredits', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const tokens_to_charge = parseInt(req.query.tokens_to_charge as string); // Converte tokens_to_charge in numero intero
   
    const result = await rechargeCredits(id_user, tokens_to_charge);
    res.json(result); // Rispondi con il risultato della funzione rechargeCredits
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

/**
 * Funzione 'controllerErrors'
 * 
 * Funzione invocata dai metodi del Controller in caso di errori e che si occupa di invocare
 * il metodo {@link getError} della Factory di errori per costruire oggetti da ritornare al client
 * nel corpo della risposta.
 * 
 * @param enum_error Il tipo di errore da costruire
 * @param err L'effettivo errore sollevato
 * @param res La risposta da parte del server
 */
function controllerErrors(enum_error: EnumError, err: any, res: any) {
    const new_err = getError(enum_error).getErrorObj();
    console.log(err);
    res.status(new_err.status).json(new_err.message);
}
