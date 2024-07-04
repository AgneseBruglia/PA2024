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

// getAllDataset : controllare abbastanza crediti

// getUserDataset : si può utilizzare checkUsers

export const error_handling =[
    ReqMiddleware.logErrors,
    ReqMiddleware.errorHandler
];
