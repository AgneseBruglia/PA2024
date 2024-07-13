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
    status: number;
    message: string;
    getErrorObj(): {message:string, status:number}
}


export class NotEnoughTokens implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 401;
        this.message = Message.notEnoughTokens_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class UserDoesNotExist implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 400;
        this.message = Message.userDoesNotExist_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class UserAlreadyExists implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 402;
        this.message = Message.userAlreadyExists_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class DatasetAlreadyExists implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 402;
        this.message = Message.datasetAlreadyExists_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class UserNotAdmin implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 403;
        this.message = Message.userNotAdmin_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class MalformedPayload implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 404;
        this.message = Message.malformedPayload_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class InternalServerError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 500;
        this.message = Message.internalServerError_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class DatasetNotExitsError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 400;
        this.message = Message.datasetNotExits_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}


export class VideosAlreadyExitError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 400;
        this.message = Message.videoAlreadyExist_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}


export class NoJwtInTheHeaderError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 401;
        this.message = Message.noJwtInTheHeader_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}


export class VerifyAndAuthenticateError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 401;
        this.message = Message.verifyAndAuthenticate_message
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
        this.message = Message.incorrectParameter_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class PayloadHeaderError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 415;
        this.message = Message.incorrectPayloadHeader_messsage
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class AuthHeaderError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 400;
        this.message = Message.noAuthHeader_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class RouteNotFoundError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 404;
        this.message = Message.notFound_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class NoTokensForInferenceError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 403;
        this.message = Message.noTokensForInference_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class JobsFetchError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 500;
        this.message = Message.jobsFetchError_message;
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class NoVideoError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 400;
        this.message = Message.noVideoFoundDataset_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class JobNotFoundError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 404;
        this.message = Message.jobNotFounderror_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class JobResultError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 404;
        this.message = Message.jobResultError_message
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}

export class ZeroTokensAvailableError implements IErrorObj {
    status: number;
    message: string;

    constructor() {
        this.status = 401;
        this.message = Message.zeroTokensAvailable_messagge
    }

    getErrorObj(): { message: string; status: number } {
        return { 
            status: this.status,
            message: this.message
        }
    }
}


export enum EnumError {
    ZeroTokensAvailableError,
    NotEnoughTokens,
    UserDoesNotExist,
    UserAlreadyExists,
    DatasetAlreadyExists,
    UserNotAdmin,
    MalformedPayload,
    InternalServerError,
    DatasetNotExitsError,
    VideosAlreadyExitError,
    NoJwtInTheHeaderError,
    VerifyAndAuthenticateError,
    IncorrectInputError,
    PayloadHeaderError,
    AuthHeaderError,
    RouteNotFoundError,
    NoTokensForInferenceError,
    NoVideoError,
    JobsFetchError,
    JobNotFoundError,
    JobResultError
}

export function getError(type: EnumError): IErrorObj {
    let val: IErrorObj | null = null;
    switch (type){
        case EnumError.ZeroTokensAvailableError:
            val = new ZeroTokensAvailableError();
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
        case EnumError.DatasetAlreadyExists:
            val = new DatasetAlreadyExists();
            break;
        case EnumError.UserNotAdmin:
            val = new UserNotAdmin();
            break;
        case EnumError.MalformedPayload:
            val = new MalformedPayload();
            break;
        case EnumError.InternalServerError:
            val = new InternalServerError();
            break; 
        case EnumError.DatasetNotExitsError:
            val = new DatasetNotExitsError(); 
            break;   
        case EnumError.VideosAlreadyExitError:
            val = new VideosAlreadyExitError(); 
            break;
        case EnumError.NoJwtInTheHeaderError:
            val = new NoJwtInTheHeaderError();
            break;  
        case EnumError.VerifyAndAuthenticateError:
            val = new VerifyAndAuthenticateError();
            break;
        case EnumError.IncorrectInputError:
            val = new IncorrectInputError();
            break; 
        case EnumError.PayloadHeaderError:
            val = new PayloadHeaderError();
            break; 
        case EnumError.AuthHeaderError:
            val = new AuthHeaderError();
            break;
        case EnumError.RouteNotFoundError:
            val = new RouteNotFoundError();
            break;
        case EnumError.NoTokensForInferenceError:
            val = new NoTokensForInferenceError();
            break; 
        case EnumError.NoVideoError:
            val = new NoVideoError();
            break; 
        case EnumError.JobsFetchError:
            val = new JobsFetchError();
            break;
        case EnumError.JobNotFoundError:
            val = new JobNotFoundError();
            break;
        case EnumError.JobResultError:
            val = new JobResultError();
            break;
    }
    return val; 
}