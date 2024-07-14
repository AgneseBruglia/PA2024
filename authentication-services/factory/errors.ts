/**
 * Interfaccia 'IErrorObj'
 * 
 * Questa interfaccia definisce un contratto per gli oggetti che devono fornire 
 * informazioni su un errore attraverso il metodo `getErrorObj`, che
 * restituisce un oggetto contenente le informazioni sull'errore, cioè il messaggio
 * di errore e lo status.
 */
interface IErrorObj {
    status: number;
    message: string;
    getErrorObj(): { message: string, status: number }
}

export class InternalServerError implements IErrorObj {
    status: number;
    message: string;
    constructor() {
        this.status = 500;
        this.message = 'Internal server error.';
    }
    getErrorObj(): { message: string; status: number } {
        return {
            status: this.status,
            message: this.message
        }
    }
}

export class IncorrectInputError implements IErrorObj {
    status: number;
    message: string;
    constructor() {
        this.status = 400;
        this.message = 'Parameters missing or incorrectly entered.';
    }
    getErrorObj(): { message: string; status: number } {
        return {
            status: this.status,
            message: this.message
        }
    }
}

export enum EnumErrorAuth {
    InternalServerError,
    IncorrectInputError
}

export function getError(type: EnumErrorAuth): IErrorObj {
    let val: IErrorObj | null = null;
    switch (type) {
        case EnumErrorAuth.InternalServerError:
            val = new InternalServerError();
            break;
        case EnumErrorAuth.IncorrectInputError:
            val = new IncorrectInputError();
            break;
    }
    return val;
}
