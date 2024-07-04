import { Request, Response, NextFunction } from 'express';
import { User } from '../models/models'
import * as Controller from '../routes_db/controller_db';
import { EnumError } from '../factory/errors';
import { Op } from 'sequelize'

/*
* Middleware 'checkResidualTokens'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia un numero di tokens > 0, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkResidualTokens(req: any, res: any, next: any): void {
    User.findOne({
        attributes: ['residual_tokens'],
        where: {
            id: req.params.id_user,
            residual_tokens: { [Op.gt]: 0 }
        }
    })
    .then((tokens) => {
        if (tokens !== null) {
            next();
        } else {
            next(EnumError.ZeroTokensAvailable);
        }
    })
    .catch((error) => {
        next(EnumError.UserDoesNotExist);
    });
}



/*
* Middleware 'checkEnoughTokens'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia abbastanza token, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkEnoughTokens(req: any, res: any, next: any): void {
    User.findOne({
        attributes: ['residual_tokens'],
        where: {
            id: req.params.id_user
        }
    })
    .then((tokens) => {
        if (tokens !== null) {
            countTokens(req, tokens);
            next();
        } else {
            next(EnumError.NotEnoughTokens);
        }
    })
    .catch((error) => {
        next(EnumError.UserDoesNotExist);
    });
}

// Funzione per controllare che il numero di tokens sia sufficiente
function countTokens(req: any, tokens: any): any {
    // TODO
}

/*
* Middleware 'CheckAdmin'
*
* Controlla che l'utente che sta effettuando le richieste 
* abbia i permessi, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkAdmin(req: any, res: any, next: any): void {
    User.findOne({
        where: {
            id: req.params.id_user,
        }
    })
    .then((user) => {
        if (user !== null && user.getDataValue('type') == 'ADMIN') {
            next();
        } else {
            next(EnumError.UserNotAdmin);
        }
    })
    .catch((error) => {
        next(EnumError.UserDoesNotExist);
    });
}

/*
* Middleware 'checkUser'
*
* Controlla che nel database non esista già un utente
* con quel nome e cognome, altrimenti dà errore e 
* rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
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

/*
* Middleware 'checkUserExists'
*
* Controlla che nel database esista un utente con quel nome
* e cognome, altrimenti dà errore e rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkUserExists(req: any, res: any, next: any): void {
    User.findOne({
        where: {
            name: req.params.name,
            surname: req.params.surname
        }
    })
    .then((user) => {
        if (user !== null) {
            next();
        } else {
            next(EnumError.UserDoesNotExist);
        }
    })
    .catch((error) => {
        next(error);
    });
}

/*
* Middleware 'checkDatasetExists'
*
* Controlla che nel database esista un utente con quel nome
* e cognome, altrimenti dà errore e rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkDatasetExists(req: any, res: any, next: any): void {
    User.findOne({
        where: {
            dataset_name: req.params.dataset_name,
            id_user: req.params.id_user
        }
    })
    .then((dataset) => {
        if (dataset !== null) {
            next();
        } else {
            next(EnumError.DatasetAlreadyExists);
        }
    })
    .catch((error) => {
        next(error);
    });
}
