import axios from 'axios';
import { EnumError } from '../factory/errors';
import { controllerErrors } from './controller_db';


export async function generateJwt(req: any, res: any): Promise<any> {
    try {
        const authentication_services_host: string = process.env.AUTHENTICATION_SERVICES_HOST as string;
        const authentication_services_port: number = parseInt(process.env.AUTHENTICATION_SERVICES_PORT as string);
        const result = await axios.post(`http://${authentication_services_host}:${authentication_services_port}/generate-token`, null, {
            params: {
                email: req.query.email,
                type: req.query.type,
                expiration: req.query.expiration
            }
        });

        if (result.status === 200) return result.data;
    }
    catch (error: any) {
        controllerErrors(EnumError.InternalServerError, error, res);
    }
}