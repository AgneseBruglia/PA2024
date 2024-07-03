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

class ZeroTokensAvailable implements IErrorObj {
    getErrorObj(): { message: string; status: number } {
        return { 
            message: Message.zeroTokensAvailable_messagge,
            status: 400
        }
    }
}