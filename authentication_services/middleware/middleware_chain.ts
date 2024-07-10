import * as InputMiddleware from './input_correcteness_middleware'

export const verifyInput = [
    InputMiddleware.validateSchema(InputMiddleware.createTokensSchema, InputMiddleware.type.query)
];