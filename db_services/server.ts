import express, { Request, Response } from 'express';
import { createUser, addDataset, getAllUsers, getDatasets, getAllDataset, updateDataset, insertVideoIntoDataset, deleteDataset,
    visualizeAllUserCredits, rechargeCredits 
 } from './routes_db/controller_db';

const app = express();
const port = 3000;

app.use(express.json());

// Route per l'inserimento di un nuovo utente
app.post('/insertUser', async (req: Request, res: Response) => {
    const { name, surname, email, type, residual_tokens } = req.body;

    try {
        const newUser = await createUser({ name, surname, email, type, residual_tokens });
        res.json(newUser);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/createDataset', async (req: Request, res: Response) => {
    const { dataset_name, id_user } = req.body;

    try {
        const result = await addDataset(dataset_name, id_user);
        res.json(result);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Definizione della rotta per recuperare tutti gli utenti
app.get('/getUsers', async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero degli utenti' });
    }
});

// Definizione della rotta per recuperare tutti i dataset di un utente
app.get('/getDatasets', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;

    try {
        if (id_user && dataset_name) {
            const result = await getDatasets(id_user, dataset_name);
            res.json(result);
        } else if (id_user) {
            const result = await getAllDataset();
            res.json(result);
        } else {
            res.status(400).json({ error: 'Parametri mancanti: id_user' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Rotta per aggiornare un dataset
app.post('/updateDataset', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;
    const new_dataset_name = req.query.new_dataset_name as string;

    try {
        if (id_user && dataset_name && new_dataset_name) {
            const result = await updateDataset(id_user, dataset_name, new_dataset_name);
            res.json(result);
        } else {
            res.status(400).json({ error: 'Parametri mancanti: id_user, dataset_name, new_dataset_name' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Rotta per aggiungere video a un dataset
app.put('/insertVideoIntoDataset', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;
    const new_videos = req.body.new_videos;

    try {
        if (id_user && dataset_name && new_videos) {
            const result = await insertVideoIntoDataset(id_user, dataset_name, new_videos);
            res.json(result);
        } else {
            res.status(400).json({ error: 'Parametri mancanti: id_user, dataset_name, new_videos' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

// Rotta DELETE per eliminare un dataset
app.delete('/deleteDataset', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;

    try {
        if (id_user && dataset_name) {
            const result = await deleteDataset(id_user, dataset_name);
            res.json(result);
        } else {
            res.status(400).json({ error: 'Parametri mancanti: id_user, dataset_name' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/credits', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const type = req.query.type as string; // Se type è presente nella query string

    try {
        const result = await visualizeAllUserCredits(id_user, type);
        res.json(result); // Rispondi con il risultato della funzione visualizeAllUserCredits
    } catch (error:any) {
        res.status(500).json({ successo: false, errore: error.message }); // Gestione degli errori
    }
});

// Rotta PUT per ricaricare i crediti di un utente
app.put('/rechargeCredits', async (req: Request, res: Response) => {
    const id_user = req.query.id_user as string;
    const tokens_to_charge = parseInt(req.query.tokens_to_charge as string); // Converte tokens_to_charge in numero intero

    try {
        const result = await rechargeCredits(id_user, tokens_to_charge);
        res.json(result); // Rispondi con il risultato della funzione rechargeCredits
    } catch (error:any) {
        res.status(500).json({ successo: false, errore: error.message }); // Gestione degli errori
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
