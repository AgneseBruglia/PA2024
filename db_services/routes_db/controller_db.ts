const { User } = require('../models/models');

/*
*
* Funzione per l'inserimento di un nuovo utente nel DB
* 
*/
export async function createUser({
    name,
    surname,
    email,
    type,
    residual_tokens
}): Promise<void> {
    try {
        const newUser = await User.create({
            name,
            surname,
            email,
            type,
            residual_tokens
        });

        return newUser.toJSON();
    } catch (error) {
        return error.toJSON();
    }
}
