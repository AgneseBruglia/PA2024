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
export function checkResidualTokens(req: any, res: any, next: any) {
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
export async function checkEnoughTokens(req: any, res: any, next: any) {
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
export function checkAdmin(req: any, res: any, next: any) {
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
export function checkUser(req: any, res: any, next: any) {
    User.findAll({
        where: {
            name: req.params.name,
            surname: req.params.surname
        }
    })
    .then((user) => {
        if (user == null) {
            next();
        } else {
            next(EnumError.UserAlreadyExists);
        }
    })
    .catch((error) => {
        next(error);
    });
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
export function checkUserExists(req: any, res: any, next: any) {
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
* Middleware 'checkJWT'
*
* Controlla che la chiave JWT sia corretta,
* altrimenti dà errore e rifiuta la richiesta.
* 
* @params req Richiesta del client
* @params res Risposta del server
* @param next Riferimento al middleware successivo
*/
export function checkJWT(req: any, res: any, next: any) {
    // TODO
}
