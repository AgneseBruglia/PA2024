import { Request, Response, NextFunction } from 'express';
import { User, Dataset } from '../models/models'
import * as ControllerInference from '../routes_db/controller_inference';
import { EnumError } from '../factory/errors';
import { Op } from 'sequelize'
import dotenv from 'dotenv';

/**
 * Controller per le funzioni di Middleware per interfacciarsi con il Model
 */

// TODO commento
export async function getTokens(req: any, checkResidual: boolean = false): Promise<any> {
    const whereClause: any = {
        email: req.decodeJwt.email
    };
    if (checkResidual) {
        whereClause['residual_tokens'] = { [Op.gt]: 0 };
    }
    const tokens = await User.findOne({
        attributes: ['residual_tokens'],
        where: whereClause
    });
    return tokens;
}

// TODO commento
export async function userUpdate(tokensRemains: number, email: any): Promise<any> {
    const result = await User.update({ residual_tokens: tokensRemains }, { where: { email: email } });
    return result;
}

// TODO commento
export async function getDataset(dataset_name: any, email?: any, attributes?: string[]): Promise<any> {
    if (email !== undefined) {
        const options: any = {
            where: {
                dataset_name: dataset_name,
                email: email,
            }
        };
        if (attributes !== undefined) {
            options.attributes = attributes;
        }
        const result = await Dataset.findOne(options);
        return result;
    } else {
        const options: any = {};

        if (attributes !== undefined) {
            options.attributes = attributes;
        }
        const result = await Dataset.findByPk(dataset_name, options);
        return result;
    }
}

// TODO commento
export async function getUser(req: any, findAll: boolean = false): Promise<any> {
    const whereClause = { email: findAll ? req.body.email : req.decodeJwt.email };
    if (findAll) {
        const result = await User.findAll({
            where: whereClause
        });
        return result;
    } else {
        const result = await User.findOne({
            where: whereClause
        });
        return result;
    }
}
