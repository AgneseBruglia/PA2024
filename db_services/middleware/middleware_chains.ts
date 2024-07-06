import * as ReqMiddleware from './request_middleware';
import * as RouteMiddleware from './routes_middleware';

/**
 * 'Middleware chain' 
 * 
 * Sono funzioni, catene di middleware, che specificano 
 * quali middleware e in che ordine devono essere superati per 
 * eseguire una certa richiesta.
 */

export const checkInsertUsers = [
    RouteMiddleware.checkUser
];

export const checkUsers = [
    RouteMiddleware.checkUserExists,
    RouteMiddleware.checkResidualTokens
];

// getUsers : controllare abbastanza token

export const createDataset = [
    RouteMiddleware.checkUserExists,
    RouteMiddleware.checkResidualTokens,
    RouteMiddleware.checkDatasetExists
];

// getDataset
export const getDataset = [
    RouteMiddleware.checkUserExists,
    RouteMiddleware.checkResidualTokens
]
// getUserDataset : si può utilizzare checkUsers

export const updateDataset = [
    RouteMiddleware.checkDatasetAlreadyExist,
    RouteMiddleware.checkDatasetExists
];

export const insertVideo = [
    RouteMiddleware.checkSameVideo
];

export const deleteDataset = [
    RouteMiddleware.checkDatasetAlreadyExist
];

// Va applicato a tutte le rotte(USER ed ADMIN). Salva il Payload del JWT in req.body.
export const checkJwt = [
    ReqMiddleware.checkJwt,
    ReqMiddleware.verifyAndAuthenticate
];

// Va applicato solo alle rotte per gli admin, controlla che l'utente sia un ADMIN.
export const checkPermission = [
    ReqMiddleware.checkAdminPermission
]

export const error_handling =[
    ReqMiddleware.logErrors,
    ReqMiddleware.errorHandler
];
