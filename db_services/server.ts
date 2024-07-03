const express = require('express'); 
import { Request, Response } from 'express';
const { createUser } = require('./routes_db/controller_db'); 
const {createUserAutomatic} = require('./ges_users')

createUserAutomatic()

const app = express();
const port = 3000;

app.use(express.json());

// Route per l'inserimento di un nuovo utente
app.post('/api/users', async (req: Request, res: Response) => {
    const { name, surname, email, type, residual_tokens } = req.body;

    try {
        const newUser = await createUser({ name, surname, email, type, residual_tokens });
        res.json(newUser);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
