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
            message: Message.zeroTokensAvailable_messagge,
            status: 400
        }
    }
}

export enum EnumError {
    ZeroTokensAvailable,
}

export function getError(type: EnumError): IErrorObj {
    let val: any = null;
    switch (type){
        case EnumError.ZeroTokensAvailable:
            val = new ZeroTokensAvailable();
            break;
    }
    return val; 
}