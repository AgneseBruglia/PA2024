import { Request, Response, NextFunction } from 'express';
import { User } from '../models/models'
import * as Controller from '../routes_db/controller_db';
import { EnumError } from '../factory/errors';
import { Op } from 'sequelize'

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
                id: req.body.id_user,
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
 * Middleware 'CheckAdmin'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia i permessi, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @param req Richiesta del client
* @param res Risposta del server
* @param next Riferimento al middleware successivo
*/
export async function checkAdmin(req: any, res: any, next: any): Promise<void> {
    try {
        let admin = await User.findOne({
            where: {
                id: req.body.id_user,
            }
        })
        if (admin !== null && admin.getDataValue('type') == 'ADMIN') {
            next();
        } else {
            next(EnumError.UserNotAdmin);
        }
    }
    catch(error){
        next(EnumError.UserDoesNotExist);
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
        let user = await User.findOne({
            where: {
                name: req.body.name,
                surname: req.body.surname
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
        let dataset = await User.findOne({
            where: {
                dataset_name: req.body.dataset_name,
                id_user: req.body.id_user
            }
        })
        if (dataset == null) {
                next();
        } else {
            next(EnumError.DatasetAlreadyExists);
        }
    }
    catch(error){
        next(error);
    }
}
