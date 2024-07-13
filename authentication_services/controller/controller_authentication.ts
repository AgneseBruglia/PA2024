import { EnumErrorAuth, getError } from "../factory/errors";
import { typeOfUser } from "../jwt/jwt_generator";
import {createJwt} from '../jwt/jwt_generator';


/**
 * Funzione 'controllerErrorsAuth'
 * 
 * Funzione invocata dai metodi del Controller in caso di errori e che si occupa di invocare
 * il metodo {@link getError} della Factory di errori per costruire oggetti da ritornare al client
 * nel corpo della risposta.
 * 
 * @param enum_error Il tipo di errore da costruire
 * @param err L'effettivo errore sollevato
 * @param res La risposta da parte del server
 */
export function controllerErrorsAuth(enum_error: EnumErrorAuth, err: Error, res: any) {
    const new_err = getError(enum_error).getErrorObj();
    res.status(new_err.status).json(new_err.message);
}




/**
 * Funzione 'generateToken'
 * 
 * La funzione, genera i token necessari per la successiva autenticazione di user e/o admin
 * 
 * @param req Richiesta
 * @param res La risposta da parte del server
 * 
 * @returns JWT
 */
export async function generateToken(req: any, res: any): Promise<any> {
    try{
        const typeOfuser: typeOfUser | undefined = stringToTypeOfUser(req.query.type as string);
        if(typeOfuser !== undefined) 
            return createJwt(req.query.email as string, 
                            typeOfuser, parseInt(req.query.expiration));
        else throw new Error;
    }
    catch(error:any){
        controllerErrorsAuth(EnumErrorAuth.InternalServerError, error, res);
    }

}



/**
 * Funzione 'stringToTypeOfUser'
 * 
 * La funzione mappa la stringa sul tipo enumerativo.
 * 
 * @param str Stringa da mappare
 * 
 * @returns typeOfUser 
 */
function stringToTypeOfUser(str: string): typeOfUser | undefined {
    return typeOfUser[str as keyof typeof typeOfUser];
}