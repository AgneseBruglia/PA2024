const express = require('express'); 
import { Request, Response } from 'express';
const { createUser, addDataset, getAllUsers } = require('./routes_db/controller_db'); 

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
    
    if(addDataset(dataset_name, id_user)){
     return res.json({dataset_name:'E stato creato con successo'});
    }
    else{
        return res.json({dataset_name: "Unable to create dataset"});
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


// Definizione della rotta per recuperare tutti gli utenti
app.get('/prova', async (req: Request, res: Response) => {
    const fs = require('fs');
    const stats = fs.statSync('/app/dataset_&_modelli/dataset/1.mp4');
    return res.json(stats);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
