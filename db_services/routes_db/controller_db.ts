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
    // Todo LUCA: vedere di fare i controlli per assicurarsi che non esiste uno stesso user con uno stesso dataset
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



/**
 * Funzione per aggiungere un nuovo dataset e creare la relativa cartella.
 * @param id_user ID dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria). Parametro facoltativo
 * @returns Dataset specifico riferito ad uno utente oppure tutti i dataset di un'utente. Ritorna un eccezione in caso di errore
 */
export async function getDatasets(id_user:String, dataset_name?: String) {
    try {
        

        if (dataset_name) {
            const result = await Dataset.findAll({
                where: {
                    dataset_name : dataset_name,
                    id_user : id_user,
                },
            });
            return {
                success: true,
                data: result 
            }; 
        }

        else{
            const result = await Dataset.findAll({
                where: {
                    id_user : id_user,
                },
            });
            return {
                success: true,
                data: result 
            }; 
        }

    } catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    }
}

export async function getAllDataset(){
    try{
        const result = await Dataset.findAll();
        return {
            success: true,
            data: result
        }
    }
    catch(error:any){
        return{
            success: false,
            message: error.message
        }
    }
}

