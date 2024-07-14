import { getError } from "../factory/errors";

/**
 * Middleware 'logErrors'
 * 
 * Stampa a schermo l'oggetto creato dalla Factory {@link getError} degli errori.
 * 
 * @param err L'errore generato dagli strati middleware precedenti
 * @param req La richiesta del client
 * @param res La risposta del server
 * @param next Il riferimento al middleware successivo
 */
export function logErrors(err: any, req: any, res: any, next: any): void {
    const new_err = getError(err);
    if (new_err !== null) {
        new_err.getErrorObj();
        next(new_err);
    }
    else {
        next();
    } 
}

/**
 * Middleware 'errorHandler'
 * 
 * Ritorna nel body della risposta l'oggetto creato dalla Factory
 * {@link getError} degli errori e ricevuto dal middleware {@link logErrors}.
 * 
 * @param err L'errore generato dagli strati middleware precedenti
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export function errorHandler(err: any, req: any, res: any, next: any): void { 
    if (err !== null) {
        let status = err.status;
        let message = err.message;
        res.status(status).json({ error: message });
    } else {
        next();
    }
}
