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
    ReqMiddleware.checkAdminPermission,
    RouteMiddleware.checkResidualTokens,
    RouteMiddleware.checkUser
];

export const checkGeneral = [
    ReqMiddleware.checkJwt,
    ReqMiddleware.verifyAndAuthenticate,
    RouteMiddleware.checkUserExists,
    RouteMiddleware.checkResidualTokens
];

export const createDataset = [
    RouteMiddleware.checkDatasetExists
];

export const updateDataset = [
    RouteMiddleware.checkDatasetAlreadyExist,
    RouteMiddleware.checkDatasetExists
];

export const insertVideo = [
    RouteMiddleware.checkDatasetAlreadyExist,
    RouteMiddleware.checkSameVideo,
    RouteMiddleware.checkEnoughTokens,
];

export const deleteDataset = [
    RouteMiddleware.checkDatasetAlreadyExist
];

export const checkPermission = [
    ReqMiddleware.checkAdminPermission
];

export const checkJwt = [
    ReqMiddleware.checkJwt,
    ReqMiddleware.verifyAndAuthenticate,
    RouteMiddleware.checkUserExists
]

export const error_handling =[
    ReqMiddleware.logErrors,
    ReqMiddleware.errorHandler
];
