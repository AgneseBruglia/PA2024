import { Request, Response, NextFunction } from 'express';
import { User } from '../models/models'
import * as Controller from '../routes_db/controller_db';
import { Errorobj } from '../factory/errors';

/*
*
*
* 
* 
* 
*/
export function checkResidualTokens(req: any, res: any, next: any) {
    let userz = User.findByPk(req.id_user);
    userz.
    User.findByPk(req.id_user)
        .then(function(user) {
            if (user && user.residual_tokens > 0)
                next();
            else
                next(Errorobj.ZeroTokensAvailable);) // Assumendo che Errorobj sia un oggetto definito con l'errore ZeroTokensAvailable
}