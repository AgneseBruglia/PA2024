import { Request, Response, NextFunction } from 'express';
import { User, Dataset } from '../models/models'
import * as Controller from '../routes_db/controller_db';
import { EnumError } from '../factory/errors';
import { Op } from 'sequelize'
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtPayload, Secret } from 'jsonwebtoken';
import {typeOfUser} from '../routes_db/controller_db';

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
        
        console.log('JWT dentro checkResidualTokens: ', req.decodeJwt);
        let tokens = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                user_id: req.decodeJwt.id,
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
        let tokens = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                id: req.body.id_user,
            }
        })
        if (tokens !== null) {
            countTokens(req, tokens);
            next();
        } else {
            next(EnumError.NotEnoughTokens);
        }
    }
    catch(error){
        next(EnumError.UserDoesNotExist);
    }
}

// Funzione per controllare che il numero di tokens sia sufficiente
function countTokens(req: any, tokens: any): any {
    // TODO
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
                name: req.body.name,
                surname: req.body.surname
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
                name: req.decodeJwt.name,
                surname: req.decodeJwt.surname
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
        let userId: number | undefined;

        console.log('checkDatasetExists: ', req.decodeJwt);
        if (req.query.dataset_name) {
            datasetName = req.query.dataset_name as string;
        } else if (req.query.new_dataset_name) {
            datasetName = req.query.new_dataset_name as string;
        }

        console.log('ID user: ', req.decodeJwt.id);
        userId = parseInt(req.decodeJwt.id)
        console.log('ID_USER parse int: ', userId);

        const dataset = await Dataset.findAll({
            where: {
                dataset_name: datasetName as string,
                user_id: userId as number,
            }
        });

        console.log("lunghezza dataset: ", dataset.length)
        if (dataset.length === 0) {
            next();  // Procedi se il dataset non esiste
        } else {
            next(EnumError.DatasetAlreadyExists);  // Se il dataset esiste, invia un errore appropriato
        }
    } catch (error) {
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
    const id_user = req.query.id_user as string;
    const dataset_name = req.query.dataset_name as string;
    const new_dataset_name = req.query.new_dataset_name as string;
    try{
        // Cerco se il dataset esiste 
        const dataset = await Dataset.findAll({
            where: {
                user_id: id_user,
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
        const new_videos = req.body.videos;
        const dataset = await Dataset.findAll({
            where: {
                dataset_name: req.query.dataset_name,
                user_id: req.query.id_user
            },
            attributes: ['videos']
        }) as any;
        const existingVideos = dataset.videos;
        const isSameVideoPresent = new_videos.some((video: string) => existingVideos.includes(video));
        
        if(isSameVideoPresent){
            next(EnumError.VideosAlreadyExitError);
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
 * Middleware 'checkJwt'
 * 
 * Controlla che nell'header compaia il JWT TOKEN.
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export async function checkJwt(req: any, res: any, next: any): Promise<void>{
    const bearerHeader: string = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken: string = bearerHeader.split(' ')[1];
        req.checkJwt = bearerToken;
        console.log('JWT dentro checkJwt: ', req.checkJwt);
        next();
    } else next(EnumError.NoJwtInTheHeaderError);
}

/**
 * Middleware 'verifyAndAuthenticate'
 * 
 * Verifica che il TOKEN riporti una chiave di autenticazione che corrisponda
 * alla chiave segreta registrata tra le variabili d'ambiente.
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export async function verifyAndAuthenticate(req: any, res: any, next: any): Promise<void> {
    try {
        console.log('JWT non decodificato:  ', req.checkJwt);
        const decoded: string | JwtPayload = jwt.verify(req.checkJwt as string, process.env.JWT_SECRET_KEY || '');
        //const decoded: string | JwtPayload = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJuYW1lIjoiTHVjYSIsInN1cm5hbWUiOiJCZWxsYW50ZSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzIwMTk3MDA2LCJleHAiOjE3MjAyODM0MDZ9.PIdQL6TO-vFEwSrNHeEJSw__wmAM2drQViDRWCWT2bA', 'PA2024');
        if (decoded != null) {
            req.decodeJwt = decoded;
            console.log('JWT dentro verifyAndAuthenticate: ', req.decodeJwt);
            next();
        }
    } catch (error) {
        next(EnumError.VerifyAndAuthenticateError); 
    }
}


export async function checkAdminPermission(req: any, res: any, next: any): Promise<void>{
    try{
        if(req.body.role === typeOfUser.ADMIN) next();
        next(EnumError.UserNotAdmin);
    }
    catch(error:any){
        next(error);
    }
}