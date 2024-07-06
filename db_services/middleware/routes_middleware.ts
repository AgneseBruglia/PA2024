import { Request, Response, NextFunction } from 'express';
import { User, Dataset } from '../models/models'
import * as Controller from '../routes_db/controller_db';
import { EnumError } from '../factory/errors';
import { Op } from 'sequelize'
import dotenv from 'dotenv';


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
        
        let tokens = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: req.decodeJwt.email,
                residual_tokens: { [Op.gt]: 0 }
            }
        })
        if (tokens !== null) {
                next();
        } else {
            next(EnumError.ZeroTokensAvailable);
        }
    }
    catch(error){
        next(EnumError.UserDoesNotExist);
    }
}

/**
*  Middleware 'checkEnoughTokens'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia abbastanza token, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkEnoughTokens(req: any, res: any, next: any): Promise<void> {
    try {
        const email: string = req.decodeJwt.email;

        // Usa findOne per trovare l'utente con email corrispondente
        const user = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: email
            }
        });

        if (user) {
            console.log('sono quii');
            const tokens: number = user.getDataValue('residual_tokens'); // Accedi al valore di residual_tokens
            const new_videos: string[] = req.body.new_videos;
            const COST: number = 0.5;
            const tokensRequired: number = new_videos.length * COST;
            const tokensRemains: number = tokens - tokensRequired;


            if (tokensRequired <= tokens) {
                // Aggiorna residual_tokens per l'utente
                await User.update({ residual_tokens: tokensRemains }, { where: { email: email } });
                next();
            } else {
                next(EnumError.NotEnoughTokens);
            }
        } else {
            next(EnumError.UserDoesNotExist);
        }
    } catch (error) {
        console.error('Errore durante il controllo dei tokens:', error);
        next(EnumError.InternalServerError); // Gestisci l'errore in modo appropriato
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
        let users = await User.findAll({
            where: {
                email: req.body.email
            }
        })
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
export async function checkUserExists(req: any, res: any, next: any): Promise<void> {
    try {
        console.log('JWT dentro checkUserExits: ', req.decodeJwt);
        let user = await User.findOne({
            where: {
                email: req.decodeJwt.email
            }
        })
        if (user !== null) {
                next();
        } else {
            next(EnumError.UserDoesNotExist);
        }
    }
    catch(error){
        next(error);
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
        let datasetName: string | undefined;
        let email: string | undefined;
     
        if (req.body.dataset_name) {
            datasetName = req.body.dataset_name as string;
        } else if (req.body.new_dataset_name) {
            datasetName = req.body.new_dataset_name as string;
        }
        
        email = req.decodeJwt.email;
        const dataset = await Dataset.findAll({
            where: {
                dataset_name: datasetName as string,
                email: email as string,
            }
        });

        console.log("lunghezza dataset: ", dataset.length)
        if (!dataset.length) {
            next();  // Procedi se il dataset non esiste
        } else {
            next(EnumError.DatasetAlreadyExists); 
        }
    } catch (error) {
        console.log(error);
        next(error);  // Passa l'errore al gestore degli errori
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
        const dataset = await Dataset.findAll({
            where: {
                email: email,
                dataset_name: dataset_name
            }
        })
        if(dataset.length == 0){
            next(EnumError.DatasetNotExitsError)
        }

        if(dataset.length !== 0){
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
        const dataset = await Dataset.findOne({
            where: {
                dataset_name: req.query.dataset_name,
                email: req.decodeJwt.email
            },
            attributes: ['videos']
        });
        // All'inizio i videos sono settati di default a []
        if(dataset?.getDataValue('videos').length != 0){
            console.log('lunghezza VIDEOS: ', dataset?.getDataValue('videos').length);
            const new_videos_complete: string[] = new_videos.map((fileName: string) => '/app/dataset_&_modelli/dataset/' + fileName)
            const existingVideos: string[] = dataset?.getDataValue('videos');
            console.log("VIdeo gia esistenti: ", existingVideos);
            console.log("NEW VIDEOS: ", new_videos_complete);
            const isSameVideoPresent = new_videos_complete.some((video: string) => existingVideos.includes(video));
            
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


