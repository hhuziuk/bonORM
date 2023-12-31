<a name="readme-top"></a>
# BonORM
![BonORM](https://github.com/hhuziuk/bonORM/blob/main/logo.jpeg?raw=true)
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
      <ul>
        <li><a href="#data-types">Data types</a></li>
        <li><a href="#models">Models</a></li>
        <li><a href="#errors">Errors</a></li>
        <li><a href="#migrations">Migrations</a></li>
        <li><a href="#basic-operations">Basic operations</a></li>
        <li><a href="#relations">Relations</a></li>
      </ul>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>

<!-- ABOUT THE PROJECT -->
## About The Project

BonORM is my own implementation of an object-relational mapping (ORM) designed for use on the NodeJS platform and in projects developed using Typescript. I created this tool to ensure that users can use only the tools they need for their work, making the process of interacting with the database much easier and more enjoyable. BonORM makes it easy to interact with the database, providing efficient management of objects and their relationships so that your development is more productive.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section describes the technologies and frameworks ORM can be used with.

[![Technologies](https://skillicons.dev/icons?i=ts,postgres&perline=5)](https://skillicons.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
### Installation

Here you can get in touch with installation and basic setup guide

Firstly, you should install a package from npm
* npm (as a simple dependency)
  ```sh
  npm i bonorm
  ```
* npm (as a dev dependency)
  ```sh
  npm install bonorm --save-dev
  ```

### Configuration files 

If you want to get start with concrete database, you can generate a desirable configuration

* Create configuartion file for MySQL
  ```sh
  npm run create:mySqlConfig <path> 
  ```
* Create configuartion file for PostgreSQL
  ```sh
  npm run create:pgConfig <path> 
  ```
* Your script block in package.json should look like this code snippet:
  ```json
  "scripts": {
  "create:pgConfig": "ts-node node_modules/bonorm/src/cli.ts create:pgConfig",
  "create:mySqlConfig": "ts-node node_modules/bonorm/src/cli.ts create:mySqlConfig"
  }
  ```
* Also, to connect to the database you need to create a folder called `configs` in the working 
directory, and generate the config file there, here's how this process looks like:
  ```sh
  cd <your project name>
  mkdir configs
  npm run create:pgConfig ./configs
  ```
* Then you need to provide all the necessary information about the database 
in place of the brackets:
```ts
// pgConfig.ts
import { Pool } from 'pg';
export const pgConfig = new Pool({
  user: 'username of your database',
  host: 'name of your host',
  database: 'name of your database',
  password: 'password for your database',
  port: 5432, // or any other port
  // you can also add any other configurations
});
```

```ts
// mySqlConfig.ts
import {createPool} from 'mysql';
export const mySqlConfig  = createPool({
  // connectionLimit : 10,
  host: 'name of your host(for example localhost)',
  user: 'username of your database',
  password: 'password for your database',
  database: 'name of your database',
  // you can also add any other configurations
});
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->
## Features
### Data types
In this section, you can learn more about the available data types that ORM works with.
To access a built-in data type, you must import dataTypes:
  ```ts
  import {dataType} from "bonorm";
  ```
#### Numbers
  ```ts
  dataType.Integer // INTEGER
  ```
#### Strings
  ```ts
  dataType.String
  ```
#### Dates
  ```ts
  dataType.Date
  ```
#### Enum
  ```ts
  dataType.Enum
  ```
#### JSON
  ```ts
  dataType.Object
  ```
#### Arrays
  ```ts
  dataType.Array
  ```
#### Boolean
  ```ts
  dataType.Boolean
  ```
#### UUID
  ```ts
  dataType.UUID
  ```

### Models
To create your own model, you need to use the Model class and pass the name of 
the table to it as arguments. After that, you need to call the `createModel` 
method and pass it the necessary attributes and options as arguments. 
Here is an example:
```ts
import { Model, dataType } from 'bonorm';
const table = new Model('Name');
table.createModel({...}); // here you should add all the options and attributes you want to use
```
### Attributes
```ts
id: {
    type: dataType.Integer, // define type of your attribute
    unique: true, // other options...
    allowNull: false,
    autoIncrement: true
}
```

* #### type
Each attribute must be assigned a type, so you can use data types that already exist in `data-types`
```ts
type: dataType.Integer
```
Find more here: <a href="#data-types">data types</a>

* #### unique
To create an unique index you need to specify `{ unique: true }` in the attribute options
* #### allowNull
Makes column NULL or NOT NULL in the database. By default column is `allowNull: true`.
* #### autoIncrement
Indicates whether the attribute should auto-increment
* #### defaultValue
The `defaultValue` field in the context of creating a table model 
in the database indicates the default value for a particular attribute of this table. 
This value will be used for new records if no specific value is specified for this 
attribute when inserting.
```ts
defaultValue: 'Unknown'
```
```ts
defaultValue: 0
```

### Usage example
In this code, a `Player` model is created with attributes `id` and `name`. 
The `id` attribute is of type `integer`, `unique`, `not nullable`, and `auto-incremented`. 
The `name` attribute is of type `string` and `unique`.
Additionally, the model-wide option of timestamps is set to true, indicating the inclusion of creation and update timestamps.

```ts
import { Model, dataType } from 'bonorm';

const table = new Model('Player');
table.createModel({
    attributes: {
        id: {
            type: dataType.Integer,
            unique: true,
            allowNull: false,
            timestamps: true,
            autoIncrement: true,
        },
        name: {
            type: dataType.String,
            unique: true
        }
    },
    options: {
        timestamps: true,
    }
});
```

### Errors
The `dbError` class is a custom error class extending the built-in Error class. 
It is designed to handle various types of errors related to database operations.
here is a typical example of using the `dbError` class to check for the presence 
of a type in an attribute
```ts
if(!type) {
  dbError.QueryError(`Type for attribute ${attribute} is undefined.`);
}
```

#### ExistingDataError
Throws an error when attempting to insert data that already exists in the database.
```ts
static ExistingDataError(values: any[]);
```
#### ConnectionError
Throws an error when unable to connect to the database.
```ts
static ConnectionError();
```
#### QueryError
Throws an error when there is an issue with executing a database query.
```ts
static QueryError(message: any[] | string);
```
#### EmptyQuery
Throws an error when attempting to perform a database query with no data for insertion.
```ts
static EmptyQuery();
```

### Migrations
You can also use the migration generator and additional tools to install and roll back migrations.
To generate migrations, you need to add a few lines of code to the `"scripts"` area of the `package.json` file:
```json
"scripts": {
    "generate:migration": "ts-node node_modules/bonorm/src/cli.ts generate:migration <path to directory>",
    "up:migration": "ts-node node_modules/bonorm/src/cli.ts up:migration <path to file with generated migration>",
    "down:migration": "ts-node node_modules/bonorm/src/cli.ts down:migration <path to file with generated migration>"
  }
```
Here is an example of a generated migration file named `MigrationV1700835172879.ts`:
```ts
import {MigrationInterface} from "bonorm"
import {QueryResult} from "pg";
export class MigrationV1700835172879 implements MigrationInterface {
    migrationName = 'MigrationV1700835172879';
    public async up(query: QueryResult) {
        // Your migration logic
    }
    public async down(query: QueryResult) {
        // Your rollback logic
    }
}
export { MigrationV1700835172879 as Migration };
```
### Basic operations

* ### create
The `create` function designed to simplify the process of inserting new records into a specified database table.
This function supports asynchronous execution and returns a Promise that resolves to a QueryResult object.
```ts
playerTable.create({name: 'Nazar'});
```
#### Arguments:
* **`data(optional)`:**
A JavaScript object representing the data to be inserted into 
the database table. It should be in the form of key-value pairs, where keys correspond 
to column names and values represent the data to be inserted.
#### Usage:
```ts
const dbModel = new Model('Employers');
const newData = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};
const result = await dbModel.create(newData);
```
* ### find
The `find` function was designed
to facilitate the retrieval of records from a specified database table based on specified criteria.
This function supports asynchronous execution and returns a Promise that resolves to a QueryResult object.
#### Example:
```ts
const dbModel = new Model('Employers');
const findResult = await dbModel.find({
  select: ['id', 'name'],
  where: { name: 'Example Team' },
  order: { id: 'ASC' }
});
```
#### Arguments:
###### **options (required):**
* **`select`:** An array of column names to be selected.
* **`relations`:** An array of table names for LEFT JOIN operations.
* **`where`:** A JavaScript object representing the conditions for the WHERE clause.
* **`order`:** A JavaScript object representing the order criteria.
* **`skip`:** The number of records to skip (for pagination).
* **`take`:** The maximum number of records to retrieve.

#### Example:
```ts
const dbModel = new Model('Employers');
const findResult = await dbModel.find({
    select: ['id', 'name'],
    relations: ['relatedTable'],
    where: { name: 'Example Team' },
    order: { id: 'ASC' },
    take: 1
});
```

* ### findOne
The `findOne` function was designed to retrieve a single record from a specified database table based on specified criteria.
This function supports asynchronous execution and returns a Promise that resolves to a QueryResult object.
#### Arguments:
###### **options (required):**
* **`where`:** A JavaScript object representing the conditions for the WHERE clause.
#### Example:
```ts
const data = await playerTable.find({
    where: { name: "Nazar" }
});
```

* ### save
The `save` function was designed for updating existing records in a specified database table.
This function supports asynchronous execution and returns a Promise that resolves to a QueryResult object.
#### Example:
```ts
const dbModel = new Model('Employers');
const saveResult = await dbModel.save();
```

* ### delete
The `delete` function was designed to simplify
the process of removing records from a specified database table. This function supports asynchronous execution
and returns a Promise that resolves to a QueryResult object.

#### Arguments:
###### **options (required):**
* **`where:`** A JavaScript object representing the conditions for the WHERE clause.
#### Example:
```ts
const dbModel = new Model('Employers');
const deleteResult = await dbModel.delete({
  where: { id: 123 }
});
```

### Relations
ORM also makes it possible to create relations between databases. 
Relations help you to work with related entities easily. 
There are several types of relationships:
<ul>
<li><a href="#one-to-one">One-To-One</a></li>
<li><a href="#one-to-many">One-To-Many</a></li>
<li><a href="#many-to-many">Many-To-Many</a></li>
</ul>

* ### One-To-One
In a one-to-one relationship, each record in one table is associated with exactly one 
record in another table, and vice versa. This is achieved by having a foreign key in one table 
that references the primary key of the other table.
#### Arguments
```ts
createOneToManyRelation("tableName", "key", "referenceTable", "referenceKey");
```
Where:

_**tableName:**_ The name of the primary table where the one-to-one relationship is being created.

_Example:_ `"player"`

_**key:**_ The foreign key column to be added to the primary table `tableName` that references the related table's primary key.

_Example:_ `"teamId"`

_**referenceTable:**_ The name of the related table that forms the other side of the one-to-one relationship.

_Example:_ `"team"`

_**referenceTable:**_ The primary key column in the related table (`referenceTable`) that is being referenced by the foreign key in the primary table.

_Example:_ `"id"`

```ts
import { createOneToOneRelation } from "bonorm"

const playerTable = new Model('Player');
// ...
const teamTable = new Model('Team');
// ...
createOneToOneRelation("player", "teamId", "team", "id");
```
In this example, a one-to-one relationship is established between the `"Player"` and `"Team"` tables. 
The `"player"` table gets a foreign key column named `"teamId"` referencing the primary key `"id"` 
in the `"team"` table. This relationship implies that each player can be associated with one team, 
and each team can be associated with one player.

* ### One-To-Many
In a one-to-many relationship, each record in the primary table can be associated with multiple 
records in the related table, but each record in the related table is associated with only one 
record in the primary table. This is typically implemented by having a foreign key in the related 
table that refers to the primary key in the primary table.
#### Arguments
```ts
createOneToManyRelation("tableName", "key", "referenceTable", "referenceKey");
```
Where:

_**tableName:**_ The name of the primary table where the one-to-many relationship is being created.

_Example:_ `"player"`

_**key:**_ The foreign key column to be added to the primary table `tableName` that references the related table's primary key.

_Example:_ `"teamId"`

_**referenceTable:**_ The name of the related table that forms the other side of the one-to-many relationship.

_Example:_ `"team"`

_**referenceTable:**_ The primary key column in the related table (`referenceTable`) that is being referenced by the foreign key in the primary table.

_Example:_ `"id"`

```ts
import { createOneToManyRelation } from "bonorm"

const playerTable = new Model('Player');
// ...
const teamTable = new Model('Team');
// ...
createOneToManyRelation("player", "teamId", "team", "id");
```
In the following example, a one-to-many relationship is established between the `"Player"` and 
`"Team"` tables. The primary table, "player," gains a foreign key column named `"teamId"` which references 
the primary key `"id"` in the related table `"team"`.

* ### Many-To-Many
In a many-to-many relationship, each record in the primary table can be associated with multiple 
records in the related table, and vice versa. This relationship is typically implemented using an 
intermediate table that contains foreign keys referencing both primary tables.

#### Arguments
```ts
createManyToManyRelation("tableName", "intermediateTableName", "referenceTable");
```
Where:

_**tableName:**_ The name of the first primary table participating in the many-to-many relationship.

_Example:_ `"player"`

_**intermediateTableName:**_ The name of the intermediate table created to represent the many-to-many relationship.

_Example:_ `"playerTeam"`

_**referenceTable:**_ The name of the second primary table participating in the many-to-many relationship.

_Example:_ `"team"`

```ts
import { createManyToManyRelation } from "bonorm"

const playerTable = new Model('Player');
// ...
const teamTable = new Model('Team');
// ...
createManyToManyRelation("player", "playerTeam", "team");
```
In this example, a many-to-many relationship is established between the `"Player"` and `"Team"` 
tables using the intermediate table `"PlayerTeam"` This allows each player to be associated with 
multiple teams, and each team to be associated with multiple players. The createManyToManyRelation
function is used to create the `"PlayerTeam"` table, which acts as a bridge between the `"Player"` 
and `"Team"` tables, facilitating the many-to-many relationship.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/Features`)
3. Commit your Changes (`git commit -m 'Add some Features'`)
4. Push to the Branch (`git push origin feature/Features`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact
Heorhii Huziuk - huziukwork@gmail.com

Why BonOrm?(it's like a word game with Bono and ORM): https://en.wikipedia.org/wiki/Bono

Project link: [https://github.com/hhuziuk/bonORM.git](https://github.com/hhuziuk/bonORM.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>