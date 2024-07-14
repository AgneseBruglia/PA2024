/*
* File contenente i messaggi di errore personalizzati
*/

export const zeroTokens_message: string = 'You have 0 tokens. You cannot make the request';
export const notEnoughTokens_message: string = 'Insufficient tokens to execute the request.';
export const userDoesNotExist_message: string = 'This user does not exist.';
export const userAlreadyExists_message: string = 'This user already exists.';
export const datasetAlreadyExists_message: string = 'This user already has a dataset with the same name.';
export const userNotAdmin_message: string = 'Only admin can run the route.';
export const malformedPayload_message: string = 'Bad request.';
export const internalServerError_message: string = 'Internal server error.';
export const datasetNotExits_message: string = 'Dataset does not exits.';
export const videoAlreadyExist_message: string = 'Some of the videos you want to insert are already in the dataset.';
export const videoAlreadyExitsArray_message: string = 'Check the inserted videos. There can be no duplicates.'
export const noJwtInTheHeader_message: string = 'The route requires the presence of a JWT in the header.'; 
export const verifyAndAuthenticate_message: string = 'JWT token authentication failed.'
export const incorrectParameter_message: string = 'Parameters missing or incorrectly entered.';
export const incorrectPayloadHeader_messsage: string = 'Header payload not present.';
export const noAuthHeader_message: string = 'No authorization header in the request.';
export const notFound_message: string = 'Route not found.';
export const noTokensForInference_message: string = 'You do not have enough tokens to test the model.';
export const noVideoFoundDataset_message: string = 'Empty dataset.';
export const jobsFetchError_message: string = 'An error occurred while fetching user jobs.';
export const jobNotFounderror_message: string = 'Job not found.';
export const jobResultError_message: string = 'Job result is not available.';
