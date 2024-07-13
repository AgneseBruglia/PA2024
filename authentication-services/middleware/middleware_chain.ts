import * as InputMiddleware from './input_correcteness_middleware'
import * as ReqMiddleware from './request_middleware'
export const verifyInput = [
    InputMiddleware.validateSchema(InputMiddleware.createTokensSchema, InputMiddleware.type.query)
];

export const error_handling =[
    ReqMiddleware.logErrors,
    ReqMiddleware.errorHandler
];
