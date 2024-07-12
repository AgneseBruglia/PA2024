import { Request, Response, NextFunction } from 'express';
import { User, Dataset } from '../models/models'
import * as ControllerInference from '../routes_db/controller_inference';
import { EnumError } from '../factory/errors';
import { Op } from 'sequelize'
import dotenv from 'dotenv';
import * as Controller from '../routes_db/controller_middleware';
import { stringify } from 'querystring';

dotenv.config();

/**
* Middleware 'checkResidualTokens'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia un numero di tokens > 0, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo 
*/
export async function checkResidualTokens(req: any, res: any, next: any): Promise<void> {
    try {
        const email: string = req.decodeJwt.email as string;
        console.log('email dentro checkResidualTokens: ', email);
        const tokens: number | null = await Controller.getTokens(email);
        if (tokens !== null) {
                console.log("ABBASTANZA TOKEN!");
                next(); //ZeroTokensAvailable
        } 
        else{
            console.log('DENTRO BLOCCO ELSE');
            next(EnumError.NotEnoughTokens); 
        }
    }
    catch(error){
        next(EnumError.NotEnoughTokens);
    }
}

/**
*  Middleware 'checkEnoughTokens'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia abbastanza token. Altrimenti dà errore e 
* rifiuta la richiesta. Il numero di token necessari dipende dal numero di
* video che devono essere caricati nel db.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkEnoughTokens(req: any, res: any, next: any): Promise<void> {
    try {
        const email: string = req.decodeJwt.email;
        const tokens = await Controller.getTokens(email);
        if (tokens) {
            const new_videos: string[] = req.body.new_videos;
            const COST: number = 0.5;
            const tokensRequired: number = new_videos.length * COST;
            const tokensRemains: number = tokens - tokensRequired;
            if (tokensRequired <= tokens) {
                // Aggiorna residual_tokens per l'utente
                await Controller.userUpdate(tokensRemains, req.decodeJwt.emailS);
                next();
            } else {
                next(EnumError.NotEnoughTokens);
            }
        } else {
            next(EnumError.UserDoesNotExist);
        }
    } catch (error) {
        console.error('Errore durante il controllo dei tokens:', error);
        next(EnumError.InternalServerError);
    }
}

/**
* Middleware 'checkTokensForInference'
*
* Controlla che l'utente che sta effettuando la richiesta di inferenza abbia sufficiente
* crediti (tokens) per processare correttamente la richiesta. Se così non è, dà errore.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkTokensForInference(req: any, res: any, next: any): Promise<void> {
    try{
        const dataset_name: string = req.query.dataset_name;
        const email: string = req.decodeJwt.email;
        const dataset = await Controller.getDataset(dataset_name, email);
        // Se è presente il dataset ed i video: 
        if((dataset !== null) && (dataset.getDataValue('videos') !== null)){
            const videos: string[] = dataset.getDataValue('videos');
            const result = await ControllerInference.checkTokensInference(dataset_name, email, res)
            console.log('RISULTATO TOKENS: ', result)
            if((typeof result === 'boolean') && result === true){
                console.log('TOKENS OK');
                next();
            }
            else{
                next(EnumError.NoTokensForInferenceError);
            }
        }
    }
    catch(error:any){
        next(EnumError.InternalServerError);
    }
}

/**
 * Middleware 'checkUser'
*
* Controlla che nel database non esista già un utente
* con quel nome e cognome, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkUser(req: any, res: any, next: any): Promise<void> {
    try {
        let users = await Controller.getUser(req, true);
        if (users.length == 0) {
                next();
        } else {
            next(EnumError.UserAlreadyExists);
        }
    }
    catch(error){
        next(error);
    }
}

/**
* Middleware 'checkUserExists'
*
* Controlla che nel database esista un utente con quel nome
* e cognome, altrimenti dà errore e rifiuta la richiesta.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkUserExists(getEmail: (req: any) => string) {
    return async (req: any, res: any, next: any): Promise<void> => {
        try {
            console.log('JWT dentro checkUserExits: ', req.decodeJwt);
            const email: string = getEmail(req);
            const user = await Controller.getUser(email, req);
            console.log('USER: ', user);
            if (user !== null) {
                next();
            } else {
                next(EnumError.UserDoesNotExist);
            }
        } catch (error) {
            next(error);
        }
    }
}


/**
* Middleware 'checkDatasetExists'
*
* Controlla che nel database non esista un dataset con lo stesso nome
* creato dallo stesso utente, altrimenti dà errore e rifiuta la richiesta.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkDatasetExists(req: any, res: any, next: any): Promise<void> {
    try {
        console.log('ciaooooo mondoooooo');
        let datasetName: string | undefined;
        let email: string | undefined;
        if (req.body.dataset_name) {
            datasetName = req.body.dataset_name as string;
        } else if (req.body.new_dataset_name) {
            datasetName = req.body.new_dataset_name as string;
        }
        email = req.decodeJwt.email;
        const dataset = await Controller.getDataset(datasetName, email);
        console.log('checkDatasetExists: ', dataset);
        if (dataset === null) {
            next();
        } else {
            next(EnumError.DatasetAlreadyExists); 
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

/**
* Middleware 'checkDatasetAlreadyExist'
*
* Controlla che nel database esista un dataset con lo stesso nome passato in input e
* creato dallo stesso utente passato in input. 
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkDatasetAlreadyExist(req: any, res: any, next: any): Promise<void>{
    const email = req.decodeJwt.email as string;
    const dataset_name = req.query.dataset_name as string;
    try{
        // Cerco se il dataset esiste 
        const dataset = await Controller.getDataset(dataset_name, email);
        console.log('DATASET DENTRO checkDatasetAlreadyExist');
        if(dataset === null){
            next(EnumError.DatasetNotExitsError)
        }
        if(dataset !== null){
            console.log('DATASET OK');
            next();
        }
    }
    catch(error:any){
        next(error);
    }
}

/**
* Middleware 'checkSameVideo'
*
* Controlla che i video da passare non siano uguali ai video già presenti nel dataset. Nel caso 
* in cui anche solo un nuovo video fosse uguale a quelli già presenti nel dataset allora lancia
* l'errore.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkSameVideo(req: any, res: any, next: any): Promise<void>{
    try{
        const new_videos = req.body.new_videos;
        const dataset = await Controller.getDataset(req.query.dataset_name, req.decodeJwt.email);
        console.log('DATASET: ', dataset);
        if(dataset !== null){
            const new_videos_complete: string[] = new_videos.map((fileName: string) => '/app/dataset_&_modelli/dataset/' + fileName)
            console.log('OKAY');
            const existingVideos: string[] = dataset.getDataValue('videos');
            console.log("VIdeo gia esistenti: ", existingVideos);
            console.log("NEW VIDEOS: ", new_videos_complete);
            const isSameVideoPresent = new_videos_complete.some((video: string) => existingVideos.includes(video));
            console.log('SAME VIDEO: ', isSameVideoPresent);
            if(isSameVideoPresent){
                next(EnumError.VideosAlreadyExitError);
            } else next(); 
        }
        else{
            next();
        }
    }
    catch(error: any){
        next(error);
    }
}

/**
* Middleware 'checkNumberOfVideo'
*
* Controlla che il dataset selezionato dall'utente contenga almeno un video.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkNumberOfVideo(req: any, res: any, next: any): Promise<void>{
    const dataset = await Controller.getDataset(req.query.dataset_name, req.decodeJwt.email);
    const videos: string[] = dataset.getDataValue('videos');
    if(videos.length > 0) {
        console.log('VIDEO OK');
        next();
    }
    else next(EnumError.NoVideoError);
}
