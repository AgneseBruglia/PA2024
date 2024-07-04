import * as Message from './error_messages'

/*
*
* Interfaccia 'IErrorObj'
* 
* 
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
    let val: IErrorObj = null;
    switch (type){
        case EnumError.ZeroTokensAvailable:
            val = new ZeroTokensAvailable();
            break;
    }
    return val; 
}