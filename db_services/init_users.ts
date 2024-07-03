const { User } = require('./models/models');

/*
*
* Funzione per la creazione degli utenti nel database
* 
*/
export async function createUsers() {
    try {
        const newAdmin = await User.create({
            name: 'Agnese',
            surname: 'Bruglia',
            email: 'agnib@gmail.com',
            type: 'ADMIN',
            residual_tokens: 2000 
        });

        const newUser1 = await User.create({
            name: 'Luca',
            surname: 'Bellante',
            email: 'lubells@gmail.com',
            type: 'USER',
            residual_tokens: 2000
        });

        const newUser2 = await User.create({
            name: 'Adriano',
            surname: 'Mancini',
            email: 'mancins@gmail.com',
            type: 'USER',
            residual_tokens: 2000
        });

        console.log('Nuovo utente creato:', newAdmin.toJSON());
        console.log('Nuovo utente creato:', newUser1.toJSON());
        console.log('Nuovo utente creato:', newUser2.toJSON());
    } catch (error) {
        console.error('Errore durante la creazione dell\'utente:', error);
    }
}

createUsers();
