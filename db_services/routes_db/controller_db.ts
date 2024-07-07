import {EmptyResultError, IntegerDataType } from 'sequelize';
import { Dataset, User } from '../models/models';
import { DatabaseError } from 'pg';

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

export enum typeOfUser {
    ADMIN = 'ADMIN',
    USER = 'USER'
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
export async function addDataset(dataset_name: string, email: string): Promise<any> {
    try {
        // Creazione della tupla nel database
       
        await Dataset.create({
            dataset_name: dataset_name,
            email: email  // Associa il dataset all'utente tramite la relazione definita
        });
    // Todo LUCA: vedere di fare i controlli per assicurarsi che non esiste uno stesso user con uno stesso dataset
        return dataset_name;
    } catch (error:any) {
        console.log(error);
        return error.message;
    }
}



export async function getAllUsers(): Promise<Json> {
    try {
        // Esegui la query per recuperare tutti gli utenti
        const users = await User.findAll({
            attributes: ['user_id','name','surname','email','residual_tokens']
        });
   
        return {
            successo: true,
            data: users 
        }; 
    } catch (error:any) {
        return {
            successo: false,
            errore: error.message 
        }; 
    }
}

/**
 * Funzione per ritornare dataset.
 * @param email Email dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria). Parametro facoltativo.
 * @returns Dataset specifico riferito ad uno utente oppure tutti i dataset di un'utente. Ritorna un eccezione in caso di errore
 */
export async function getDatasets(email:String, dataset_name?: String) {
    try {
        

        if (dataset_name) {
            const result = await Dataset.findAll({
                where: {
                    dataset_name : dataset_name,
                    email : email,
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
                    email : email,
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
 * @param email Email dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria).
 * @returns Messaggio di buona riuscita oppure messaggio di errore in forma Json.
 */
export async function updateDataset(email:String, dataset_name: String, new_dataset_name: String): Promise<Json>{
    try{
        await Dataset.update(
            { dataset_name: new_dataset_name},
            {
              where: {
                email: email,
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
 * @param email Email dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria).
 * @param new_videos Nuovi video da aggiungere al dataset.
 * @returns Messaggio di buona riuscita oppure messaggio di errore in forma Json.
 */
export async function insertVideoIntoDataset(email: String, dataset_name: String, new_videos: Array<String>): Promise<Json>{
    try{
        const videos = await Dataset.findOne({
            where: {
                email : email,
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
                    email: email,
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


/**
 * Funzione per rimuovere un dataset dal DB.
 * @param email Email dell'utente associato al dataset.
 * @param dataset_name Nome del dataset (chiave primaria).
 * @returns Messaggio di buona riuscita oppure messaggio di errore in forma Json.
 */
export async function deleteDataset(email: String, dataset_name: String): Promise<Json>{
    try{
        const result = await Dataset.destroy({
                where: {
                    email: email,
                    dataset_name: dataset_name
                }
        });
        return{
            successo: true,
            data: 'Dataset rimosso correttamente dal DB.'
        }
    }
    catch(error: any){
        return{
            successo: false,
            errore: error.message
        }
    }
}


/**
 * Funzione per visualizzare i crediti di un dato utente
 * @param email Email dell'utente associato al dataset. Se non presente, restiuisce i crediti di tutti gli utenti
 * @returns Json contenente i crediti residui dell'utente/degli utenti oppure messaggio di errore.
 */
export async function visualizeCredits(email?: String): Promise<Json>{
    try{
        if(email !== undefined){
            const value = await User.findOne({
                where: {
                    email : email as string,
                },
                attributes: ['residual_tokens']
            });
            const tokens: number = value?.getDataValue('residual_tokens') as number;
            console.log('Tokens: ', tokens);
            return{
                successo: true,
                data: tokens
            }
        }
        else {
            const value = await User.findAll({
                attributes: ['email', 'residual_tokens']  
            });
            return{
                successo: true,
                data: value
            }
        }
    }
    catch(error: any){
        return{
            successo: false,
            errore: error.message
        }
    }
}


/**
 * Funzione per ricaricare i crediti di un utente
 * @param email Email dell'utente a cui si vuole ricaricare il credito.
 * @returns Json contenente messaggio di buona riuscita oppure json contenente un errore.
 */
export async function rechargeCredits(emailUser: string , tokens_to_charge: number): Promise<Json>{
    try{

        visualizeCredits(emailUser).then(result => {
            if(result.successo==false){
                return result;
            }
            const toAdd = result.data + tokens_to_charge;
            User.update(
                { residual_tokens: toAdd},
                {
                  where: {
                    email: emailUser,
                  },
                },
              );
        })
        return{
            successo: true,
            data: 'Credito correttamente aggiornato.'
        }
    }
    catch(error:any){
        return{
            successo: false,
            errore: error.message
        }
    }
}