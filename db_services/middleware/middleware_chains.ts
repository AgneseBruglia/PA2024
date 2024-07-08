import * as ReqMiddleware from './request_middleware';
import * as RouteMiddleware from './routes_middleware';
import * as InputMiddleware from './input_correcteness_middleware';
/**
 * 'Middleware chain' 
 * 
 * Sono funzioni, catene di middleware, che specificano 
 * quali middleware e in che ordine devono essere superati per 
 * eseguire una certa richiesta.
 */

export const checkInsertUsers = [
    InputMiddleware.validateSchema(InputMiddleware.createUserSchema, InputMiddleware.type.body),
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
    InputMiddleware.validateSchema(InputMiddleware.createDatasetSchema, InputMiddleware.type.body), 
    RouteMiddleware.checkDatasetExists
];

export const updateDataset = [
    InputMiddleware.validateSchema(InputMiddleware.updateDatasetSchema, InputMiddleware.type.query),
    RouteMiddleware.checkDatasetAlreadyExist,
    RouteMiddleware.checkDatasetExists
];

export const insertVideo = [
    InputMiddleware.validateInsertVideo,
    RouteMiddleware.checkDatasetAlreadyExist,
    RouteMiddleware.checkSameVideo,
    RouteMiddleware.checkEnoughTokens,
];

export const deleteDataset = [
   InputMiddleware.validateSchema(InputMiddleware.createDatasetSchema, InputMiddleware.type.query),
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

export const rechargeCredits = [
    InputMiddleware.validateSchema(InputMiddleware.rechargeTokensSchema, InputMiddleware.type.query)
];

export const checkPayloadHeader = [
    ReqMiddleware.checkPayloadHeader
];

export const checkAuthHeader = [
    ReqMiddleware.checkAuthHeader
];

export const other_route = [
    ReqMiddleware.notFound
]