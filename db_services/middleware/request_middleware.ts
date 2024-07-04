import { stringify } from "querystring";
import { EnumError, getError } from "../factory/errors";
import { json } from "sequelize";

// Rotta non prevista

// Controlla se nel body della richiesta c'è un JWT

// Controlla se il JWT corrisponde a uno nel .env

/**
 * Middleware 'logErrors'
 * 
 * Invocato dagli strati middleware precedenti, si occupa di stampare a schermo l'oggetto
 * creato dalla Factory {@link getError} degli errori.
 * 
 * @param err L'errore generato dagli strati middleware precedenti
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export function logErrors(err: any, req: any, res: any, next: any): void {
    const new_err = getError(err);
    if (new_err !== null) {
        new_err.getErrorObj();
        console.log(new_err);
        next(new_err);
    }
    else {
        next();
    }
    
}

/**
 * Middleware 'errorHandler'
 * 
 * Invocato dagli strati middleware precedenti, si occupa di ritornare nel corpo della
 * risposta l'oggetto creato dalla Factory {@link getError} degli errori e ricevuto 
 * dal middleware {@link logErrors}.
 * 
 * @param err L'errore generato dagli strati middleware precedenti
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export function errorHandler(err: any, req: any, res: any, next: any): void { 
    if (err !== null) {
        let status = err.status;
        console.log(status);
        let message = err.message;
        res.status(status).json({ error: message });
    } else {
        next();
    }
}