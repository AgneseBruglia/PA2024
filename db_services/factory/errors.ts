import * as Message from './error_messages'

/**
 * Interfaccia 'IErrorObj'
 * 
 * Questa interfaccia definisce un contratto per gli oggetti che devono fornire 
 * informazioni su un errore attraverso il metodo `getErrorObj`, che
 * restituisce un oggetto contenente le informazioni sull'errore, cioè il messaggio
 * di errore e lo status.
 */
interface IErrorObj {
    getErrorObj(): {message:string, status:number}
}

export class ZeroTokensAvailable implements IErrorObj {
    getErrorObj(): { message: string; status: number } {
        return { 
            status: 401,
            message: Message.zeroTokensAvailable_messagge
        }
    }
}

export class NotEnoughTokens implements IErrorObj {
    getErrorObj(): { message: string; status: number } {
        return { 
            status: 401,
            message: Message.notEnoughTokens_message
        }
    }
}

export class UserDoesNotExist implements IErrorObj {
    getErrorObj(): { message: string; status: number } {
        return { 
            status: 400,
            message: Message.userDoesNotExist_message
        }
    }
}

export class UserAlreadyExists implements IErrorObj {
    getErrorObj(): { message: string; status: number } {
        return { 
            status: 400,
            message: Message.userAlreadyExists_message
        }
    }
}

export class UserNotAdmin implements IErrorObj {
    getErrorObj(): { message: string; status: number } {
        return { 
            status: 404,
            message: Message.userNotAdmin_message
        }
    }
}

export enum EnumError {
    ZeroTokensAvailable,
    NotEnoughTokens,
    UserDoesNotExist,
    UserAlreadyExists,
    UserNotAdmin
}

export function getError(type: EnumError): IErrorObj {
    let val: any = null;
    switch (type){
        case EnumError.ZeroTokensAvailable:
            val = new ZeroTokensAvailable();
            break;
        case EnumError.NotEnoughTokens:
            val = new NotEnoughTokens();
            break;
        case EnumError.UserDoesNotExist:
            val = new UserDoesNotExist();
            break;
        case EnumError.UserAlreadyExists:
            val = new UserAlreadyExists();
            break;
        case EnumError.UserNotAdmin:
            val = new UserNotAdmin();
            break;
    }
    return val; 
}