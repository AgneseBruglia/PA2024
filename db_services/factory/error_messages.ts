/*
* File contenente i messaggi di errore personalizzati
*/

export const zeroTokensAvailable_messagge: string = 'Unauthorized';
export const notEnoughTokens_message: string = 'Unauthorized.';
export const userDoesNotExist_message: string = 'This user does not exist.';
export const userAlreadyExists_message: string = 'This user already exists.';
export const datasetAlreadyExists_message: string = 'This user already has a dataset with the same name.';
export const userNotAdmin_message: string = 'Only admin can run the route.';
export const malformedPayload_message: string = 'Bad request.';
export const internalServerError_message: string = 'Internal server error.';
export const datasetNotExits_message: string = 'Dataset not exits.';
export const videoAlreadyExist_message: string = 'Some of the videos you want to insert are already present in the dataset.';
export const noJwtInTheHeader_message: string = 'The route requires the presence of a JWT in the header.'; 
export const verifyAndAuthenticate_message: string = 'JWT token authentication failed.'
export const checkPermission_message: string = 'Only admin can run the route.';
export const incorrectParameter_message: string = 'Parameters missing or incorrectly entered';
export const incorrectPayloadHeader_messsage: string = 'Header payload not present.';
export const noAuthHeader_message: string = 'No authorization header in the request.';
export const notFound_message: string = 'Route not found.';