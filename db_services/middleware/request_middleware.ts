import { getError } from "../factory/errors";
import { JwtPayload, Secret } from 'jsonwebtoken';
import {typeOfUser} from '../routes_db/controller_db';
import * as jwt from 'jsonwebtoken';
import { EnumError } from '../factory/errors';
// Rotta non prevista

// Controlla se nel body della richiesta c'è un JWT

// Controlla se il JWT corrisponde a uno nel .env

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


/**
 * Middleware 'checkJwt'
 * 
 * Controlla che nell'header compaia il JWT TOKEN.
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export  function checkJwt(req: any, res: any, next: any): void{
    const bearerHeader: string = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken: string = bearerHeader.split(' ')[1];
        req.checkJwt = bearerToken;
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
export function verifyAndAuthenticate(req: any, res: any, next: any): void {
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



export function checkAdminPermission(req: any, res: any, next: any): void{
    try{
        console.log('Ruolo: ', req.decodeJwt.role as string);
        if(req.decodeJwt.role as string === typeOfUser.ADMIN as string) next();
        else next(EnumError.UserNotAdmin);
    }
    catch(error:any){
        next(error);
    }
}


/**
 * Middleware 'checkAuthHeader'
 * 
 * Controlla che la richiesta HTTP abbia un Authorization Header.
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export function checkAuthHeader (req: any, res: any, next: any): void{
    if (req.headers.authorization) next();
    else next(EnumError.AuthHeaderError);
}

/**
 * Middleware 'checkPayloadHeader'
 * 
 * Controlla che la richiesta HTTP abbia un Content-Type all'interno dell'header che specifichi 
 * il tipo di contenuto 'application/json'.
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export function checkPayloadHeader(req: any, res: any, next: any): void{
    if (req.headers["content-type"] == 'application/json') next();
    else next(EnumError.PayloadHeaderError);
}



/**
 * Middleware 'notFound'
 * 
 * Si occupa delle richieste in cui viene specificata una rotta non predisposta dal servizio.
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export function notFound(req: any, res: any, next: any) {
    next(EnumError.RouteNotFoundError);
}
