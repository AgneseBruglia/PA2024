import * as InputMiddleware from './input_correcteness_middleware'
import * as ReqMiddleware from './request_middleware'

/**
 * 'Middleware chain' 
 * 
 * Sono funzioni, catene di middleware, che specificano 
 * quali middleware e in che ordine devono essere superati per 
 * eseguire una certa richiesta.
 */

export const verifyInput = [
    InputMiddleware.validateSchema(InputMiddleware.createTokensSchema, InputMiddleware.type.query)
];

export const error_handling =[
    ReqMiddleware.logErrors,
    ReqMiddleware.errorHandler
];
