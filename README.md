# Progetto PA & CVDL 23/24

## :dart: Obiettivo

L'obiettivo del progetto è quello di realizzare microservizi in _TypeScript_ allo scopo di interagire con i modelli di Deep-Learning realizzati durante l'anno accademico 2023/2024. 


## Progettazione

### :electric_plug: Pattern Architetturale MVC 

Per il progetto è stato scelto di utilizzare il pattern **MVC**: "Model View Controller". Tale pattern è relativamente semplice da progettare ed implementare ma offre notevoli benifici in quanto scardina la comunicazione diretta tra la view, nel nostro caso le interazioni _http_ degli utenti, e il modello, ovvero il database. La struttura da noi progettata e implementata è quindi composta da: 

- **Model**: Logica di Business e accesso al database.
- **View**: Vista grazie alla quale l'utente si interfaccia con il software.
- **Controller**

```mermaid
graph TD;
    View ---> Controller;
    Controller ---> View;
    Controller ---> Model;
    Model ---> Controller
```

###  :whale: Architettura Docker 

L'infrastruttura `Docker` che si è implementata per realizzare il progetto e che prevede l'utilizzo di `docker-compose` per la sua gestione è la seguente:

```mermaid
graph LR;
    subgraph App
    Server.ts --- AppController.ts 
    AppController.ts 
    AppModel.ts 
    AppController.ts --- AppModel.ts
    end

    subgraph Redis
    redis
    end

    subgraph Authentication
    Server.ts --- AuthController.ts
    AuthController.ts 
    AuthModel.ts 
    AuthController.ts --- AuthModel.ts
    end

    subgraph Inference
    Server.py --- InfController.py
    InfController.py
    end

    subgraph Postgress
    postgress
    end

    subgraph Cost
    Cost_services.py
    end

    AppModel.ts --- redis
    AppController.ts --- postgress
    AppController.ts --- Server.py
    AppController.ts --- redis
    AppController.ts --- Cost_services.py

```


### Use Case

```mermaid
graph TD
    User ---|CRUD| Tabella_Dataset
    Admin ---|CRUD_generale| Tabella_Dataset
    Admin ---|CRU| Tabella_User
    User --- Valutazione_processo_avanzamento
    User --- Ritorno_risultato_inferenza
    User --- Visione_crediti_residui

```


### Diagramma E-R

Per il progetto abbiamo deciso di utilizzare PostgreSQL, un database relazionale (RDBMS) open-source che supporta lo standard SQL, progettato per essere robusto e flessibile. Di seguito si riporta una rappresentazione dello schema del database tramite diagramma ER.

- `User`
- `Dataset`

```mermaid
    erDiagram
    USER ||--o{ DATASET : owns
    USER {
        string email PK
        int id
        string name
        string surname
        string type
        int residual_tokens
    }
    DATASET {
        string dataset_name PK
        string email PK, FK
        string[] videos
    }

```

## Design Pattern

Breve descrizione dei design pattern utilizzati per la realizzazione del codice in TS. 

### Chain of Responsability

Il design pattern middleware è un concetto architetturale utilizzato principalmente nelle applicazioni web per gestire e processare le richieste e le risposte _HTTP_. Esso consente di strutturare il codice in moduli separati, ciascuno dei quali può eseguire una specifica operazione su una richiesta o risposta prima di passare al successivo middleware. Questo pattern è particolarmente comune nei framework web come Express. I prinicipali punti di forza sono i seguenti: 

- 'Modularità': Ogni funzionalità può essere separata in moduli distinti. Questo rende il codice più organizzato e manutenibile.
- 'Riutilizzabilità':  Un middleware può essere riutilizzato in diverse parti dell'applicazione o in diversi progetti.
- 'Testabilità': Ogni middleware può essere testato singolarmente, migliorando la capacità di individuare e correggere errori.
- 'Flessibilità': È possibile comporre i middleware in varie sequenze per ottenere il comportamento desiderato.
- 'Isolamento delle responsabilità': Ogni middleware si concentra su una singola responsabilità, seguendo il principio di separazione delle preoccupazioni (SoC).

### Singleton

Il pattern Singleton è un design pattern creazionale che assicura che una classe abbia una sola istanza e fornisce un punto di accesso globale a tale istanza. Questo pattern è utile quando è necessario un oggetto che coordini le azioni in tutto il sistema, come un gestore di connessioni a un database, nel nostro caso, la connessione al database di _Postgress_.


### Factory

Il pattern Factory è un design pattern creazionale che fornisce un'interfaccia per creare oggetti in una classe madre, ma permette alle sottoclassi di alterare il tipo di oggetti che verranno creati. Questo pattern è particolarmente utile quando il processo di creazione richiede una certa logica o quando il tipo di oggetto creato può variare a seconda della situazioni. I benefici offerti da tale pattern sono i seguenti: 

-  'Separazione delle responsabilità': Mantiene separata la logica di creazione degli oggetti dalla loro implementazione e utilizzo.
-  'Flessibilità': Consente di aggiungere nuovi tipi di errori senza modificare il codice esistente.
-  'Centralizzazione della creazione': Centralizza la logica di creazione degli oggetti, rendendo più facile la manutenzione e l'estensione del codice.
-  'Riduzione della complessità': Rende il codice più leggibile e manutenibile riducendo la complessità del codice di creazione.
-  'Consistenza': Garantisce che tutti gli oggetti vengano creati in modo coerente, seguendo lo stesso processo di creazione.



## Rotte

Nella tabella sottostante sono riportate le principali rotte dell'applicazione. Per ciascuna rotta sarà descritto il funzionamento, con chiamata di esempio e diagramma di sequenza.

<table align="center">
    <thead>
        <tr>
            <th>Tipo</th>
            <th>Rotta</th>
            <th>User</th>
            <th>Admin</th>
            <th>Autenticazione</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GET</td>
            <td>/admin/tokens</td>
            <td></td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>PUT</td>
            <td>/admin/recharge-tokens</td>
            <td></td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/admin/dataset</td>
            <td></td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/admin/users</td>
            <td></td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/admin/create-user</td>
            <td></td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>PUT</td>
            <td>/dataset/insert-videos</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/tokens</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/modify-dataset</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/inference</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/result</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/user-jobs</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>DELETE</td>
            <td>/remove-dataset</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/generate-jwt</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔓</td>
        </tr>
    </tbody>
</table>


### GET Routes

Ogni richiesta verso l'API ha poi specificata una catena di middleware che va ad agire su questa, in particolare abbiamo una catena di middleware per le richieste GET e una per le PUT e POST.
La catena di middleware che gestisce le richieste GET è la segguente:

- i due middleware di logging sono innescati uno all'avvio della richiesta e uno alla fine del completamento della richiesta.
- è presente un middleware intermedio che va a verificare che il contenuto non sia stato già inserito all'interno della cache di redis (la chiave che si utilizza per lo storage è l'url della risorsa).
- se non è contenuto all'interno della cache allora si attiva il controller che interroga il DB, prende il valore di ritorno lo aggiunge alla cache e lo invia all'utente.

```mermaid
sequenceDiagram
    Bob ->>+ preLog: Request
    preLog ->>- cacheMiddleware: next
    activate cacheMiddleware
    cacheMiddleware ->>+ Redis: Check
    deactivate cacheMiddleware
    alt is cached
        Redis ->>- cacheMiddleware: Response
        activate cacheMiddleware
        cacheMiddleware ->> postLog: Log
        cacheMiddleware ->> Bob: res.json
        deactivate cacheMiddleware
    else is notcached
        Redis ->>+ cacheMiddleware: Empty
        cacheMiddleware ->>- Controller: Router
        activate Controller
        Controller ->> Database: Query
        deactivate Controller
        activate Database
        Database ->> Controller: Result
        deactivate Database
        activate Controller
        Controller ->> Reids: add to cache
        Controller ->> postLog: Log
        Controller ->> Bob: res.json
        deactivate Controller
    end
```

### POST/PUT Routes

Le rotte POST e PUT sono quelle che richiedono autenticazione, perciò presentano i middleware di autenticazione che vanno a verificare la validità del Token che è stato iniettato per la richiesta e i permessi contenuti al suo interno. Seguono due validazioni, una da parte del middleware `express-validation` per quanto riguarda il body della richiesta, un altra realizzato tramite il middleware `pre save` messo a disposizione tramite mongoose.

- Se entrambe le validazioni vanno a buon fine, la risorsa viene aggiunta al database, altrimenti vengono ritoranti gli errori di validazione
- Quando la risorsa viene creata viene fatto il flush della cache su Redis, altrimenti avremmo incorenenza sulle richieste GET che coinvolgono quella risorsa

```mermaid
sequenceDiagram
    Bob ->>+ preLog: Request
    preLog ->>- checkToken: Authentication
    activate checkToken
    alt is valid
        checkToken ->>+ checkPermission: check Permission
        deactivate checkToken
        alt authorized
            checkPermission ->>- Validator: apply validatione & sanitize
            activate Validator
                Validator ->> checkValidation: check validation
            deactivate Validator
            activate checkValidation
            alt valid
                checkValidation ->>+ Controller: end of chain
                deactivate checkValidation
                Controller ->>- Database: Validation & save
                activate Database
                    Database ->> Controller: OK
                deactivate Database
                activate Controller
                    Controller ->> Bob: 204 Created
                    Controller ->> Reids: flush cache
                deactivate Controller
            else not valid
                activate checkValidation
                checkValidation ->> Bob: validation error
                deactivate checkValidation
            end
        else not authorized 
                    activate checkPermission
                checkPermission ->> Bob: not allowed
            deactivate checkPermission

        end
    else is not valid
                activate checkToken
                checkToken ->> Bob: invalid token
            deactivate checkToken
    end
```
### Database Middleware

Una peculiarità di Mongoose è che si basa su una logica, simile a quella di express, che fa utilizzo di middleware per realizzare le operazioni. Data questa logica, consente di definire dei middleware personalizzati da applicare prima di alcuni metodi; nel nostro caso abbiamo definito dei middleware:

- `pre-save`: in modo tale da andare ad eseguire dei controlli prima di effettuare il salvataggio
- `pre-validation`: anche il processo di validazione è implementato come un middleware, nel nostro caso lo abbiamo implementato in modo tale implementare dei controlli sulle chiavi esterne per quelle entità che hanno "vincoli di chiave esterna"
- `post-save`: per verificare se la fase di save generasse degli errori a causa dell'unicità di alcuni campi

```mermaid
sequenceDiagram
    Request--> CheckExistenceFK:check exixts FK
    CheckExistenceFK->>+CheckSizeFK:check ok
    alt exists 
        CheckExistenceFK ->> Request:error
    else not exists
    CheckSizeFK ->>- Validation:next()
    activate Validation
    end
    alt data valid
    activate Save
    else 
    Validation ->> Request:error
    Validation ->> Save:next()
    deactivate Validation
    end
    activate Save
    alt good
    Save ->> VerifyDuplicateKey:next()
    activate VerifyDuplicateKey
    else bad
    Save ->> Request: error
    end
    deactivate Save
    VerifyDuplicateKey ->> MongoDB:save
    deactivate VerifyDuplicateKey

```


## API Docs

### Clients

#### Get All

Routes:

```
GET /clients
```
Request:
```
Authorization: Bearer {token}
```

Response: 
```json
[
    {
        "_id": "64a9241a89ceaecac3a5b609",
        "firstName": "Mario",
        "lastName": "Rossi",
        "birthDate": "1990-01-01T00:00:00.000Z",
        "fiscalCode": "ABCD1234E",
        "vatNumber": "12345678901",
        "address": "Montagana 123"
    },
    {
        "_id": "64a9a5bf4891a8cd8a5c70d6",
        "firstName": "Luigi",
        "lastName": "Neri",
        "birthDate": "1990-01-01T00:00:00.000Z",
        "fiscalCode": "ERGDF34",
        "vatNumber": "12345689021",
        "address": "Andiamo a Mordor 123"
    },
]
```
#### Get by ID
```
GET /clients/:id
```
Request:
```
Authorization: Bearer {token}
```

Response: 
```json
    {
        "_id": "64a9241a89ceaecac3a5b609",
        "firstName": "Mario",
        "lastName": "Rossi",
        "birthDate": "1990-01-01T00:00:00.000Z",
        "fiscalCode": "ABCD1234E",
        "vatNumber": "12345678901",
        "address": "Montagana 123"
    }
```

#### Update Clients 🔐

Per l'aggiornamento del cliente si era indecisi se utilizzare il metodo PUT o PATCH. Dato che le richieste verranno sempre fatte dal frontend si è deciso di utilizzare il metodo PUT, il quale prevede di specificare nel corpo della richiesta tutti i parametri anche quelli non modificati.

```
PUT /clients/:id
```
Request:
```
Authorization: Bearer {token}
```

```json
 {
    "firstName": "Franco",
    "lastName": "Rossi",
    "birthDate": "1990-01-01T00:00:00.000Z",
    "fiscalCode": "ABCD1234E",
    "vatNumber": "12345678901",
    "address": "Montagana 123"
}
```
Response: 
```
OK
```

#### Delete 🔐

L'eliminazione di un cliente prevede solo il settaggio di un flag, questo per mantenere i dati all'interno del database.
```
DELETE /clients/:id
```
Request:
```
Authorization: Bearer {token}
```
Response: 
```
OK
```

### Altre Risorse

Rotte analoghe si hanno per le altre risorse, tranne per alcune in cui non è prevista la rotta che implementa il verbo HTTP `DELETE`.
La lista è disponibile all'interno della collection Postman.


## Startup

Per eseguire il progeto, dopo avere eseguito la `clone` del progetto, in locale procedere nel seguente modo:

1. Copiare il file di ambiente e apportare le modifiche, in particolare alle password
```
cp .env.template .env
```
2. Tramite Docker CLI eseguire il seguente comando:
```
docker-compose up -d --build
```

Così facendo si esegue il progetto, in questo modo è possibile accedere ai seguenti servizi:
- `localhost:4200`: si accede al frontend dell'applicazione realizzata tramite angular
- `localhost:3000`: è l'URL base per contattare le API e interrogare gli endpoint specificati nella sezione API Docs
- `localhost:8081`: si accede a mongo express, un tool grafico per manipolare il database


