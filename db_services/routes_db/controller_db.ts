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

interface Json {
    successo: boolean;
    data?: any; 
    errore?: string;
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
            id: id_user  // Associa il dataset all'utente tramite la relazione definita
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
 * Funzione per ritornare dataset.
 * @param id_user ID dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria). Parametro facoltativo.
 * @returns Dataset specifico riferito ad uno utente oppure tutti i dataset di un'utente. Ritorna un eccezione in caso di errore
 */
export async function getDatasets(id_user:String, dataset_name?: String) {
    try {
        

        if (dataset_name) {
            const result = await Dataset.findAll({
                where: {
                    dataset_name : dataset_name,
                    id : id_user,
                },
            });
            return {
                successo: true,
                data: result 
            }; 
        }

        else{
            const result = await Dataset.findAll({
                where: {
                    id : id_user,
                },
            });
            return {
                successo: true,
                data: result 
            }; 
        }

    } catch (error:any) {
        return {
            successo: false,
            errore: error.message
        };
    }
}



/**
 * Funzione per ritornare tutti i dataset presenti nel sistema.
 * @returns Tutti i dataset presenti nel DB.
 */
export async function getAllDataset(): Promise<Json>{
    try{
        const result = await Dataset.findAll();
        return {
            successo: true,
            data: result
        }
    }
    catch(error:any){
        return{
            successo: false,
            errore: error.message
        }
    }
}



/**
 * Funzione per ritornare dataset.
 * @param id_user ID dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria).
 * @returns Messaggio di buona riuscita oppure messaggio di errore in forma Json.
 */
export async function updateDataset(id_user:String, dataset_name: String, new_dataset_name: String): Promise<Json>{
    try{
        await Dataset.update(
            { dataset_name: new_dataset_name},
            {
              where: {
                id: id_user,
                dataset_name: dataset_name
              },
            },
          );
        
        return {
            successo: true,
            data: "Modifica del dataset avvenuta correttamente."
        };
    }
    catch(error: any){
        return {
            successo: false,
            data: error.message
        };
    }
}


/**
 * Funzione per aggiungere nuovi video al dataset dello user.
 * @param id_user ID dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria).
 * @param new_videos Nuovi video da aggiungere al dataset.
 * @returns Messaggio di buona riuscita oppure messaggio di errore in forma Json.
 */
export async function insertVideoIntoDataset(id_user: String, dataset_name: String, new_videos: Array<String>): Promise<Json>{
    try{
        const videos = await Dataset.findOne({
            where: {
                id : id_user,
                dataset_name: dataset_name,
            },
            attributes: ['videos']
        }); 

        if(videos != null){
            const old_videos: Array<String> = videos.getDataValue('videos');
            const videos_path_complete: Array<String> = new_videos.map(fileName => '/app/dataset_&_modelli/dataset/' + fileName);
            const video: Array<String> = old_videos.concat(videos_path_complete);
            await Dataset.update(
                { videos: video},
                {
                  where: {
                    id: id_user,
                    dataset_name: dataset_name
                  },
                },
              );
        }
        return {
            successo: true,
            data: 'I video sono stati correttamente inseriti nel dataset'
        }
        
    }
    catch(error:any){
        return {
            successo: false,
            data: error.message
        }
    }
}

