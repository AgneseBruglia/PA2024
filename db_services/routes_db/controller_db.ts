import { Dataset, User } from '../models/models';
const fs = require('fs');
const path = require('path');

// Interfaccia per descrivere la struttura dell'utente
interface UserInput {
    name: string;
    surname: string;
    email: string;
    type: string;
    residual_tokens: number;
}

/*
*
* Funzione per l'inserimento di un nuovo utente nel DB
* 
*/
export async function createUser({
    name,
    surname,
    email,
    type,
    residual_tokens
}: UserInput): Promise<any> {
    try {
        const newUser = await User.create({
            name,
            surname,
            email,
            type,
            residual_tokens
        });

        return newUser.toJSON();
    } catch (error:any) {
        return error.toJSON();
    }}

/**
 * Funzione per aggiungere un nuovo dataset e creare la relativa cartella.
 * @param dataset_name Nome del dataset (chiave primaria).
 * @param dataset_path Percorso del dataset.
 * @param id_user ID dell'utente associato al dataset.
 * @returns True se l'aggiunta è riuscita correttamente, altrimenti false.
 */
export async function addDataset(dataset_name: string, id_user: number): Promise<any> {
    try {
        // Creazione della tupla nel database
        await Dataset.create({
            dataset_name: dataset_name,
            UserId: id_user  // Associa il dataset all'utente tramite la relazione definita
        });


        const folderPath = path.join(__dirname, 'dataset_&_modelli', dataset_name);
        fs.mkdirSync(folderPath, { recursive: true });

        return dataset_name;
    } catch (error:any) {
        return error.message;
    }
}



export async function getAllUsers(): Promise<any[]> {
    try {
        // Esegui la query per recuperare tutti gli utenti
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw error;  // Rilancia l'errore per gestione ulteriore
    }
}

