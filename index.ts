import express from "express"
import {dataType} from "./src/core/data-types/data-types";
import {Model} from "./src/core/entities/createModel";
import {createOneToOneRelation} from "./src/core/relations/One-To-One";
import {createManyToManyRelation} from "./src/core/relations/Many-To-Many";

const app = express();

const table1: Model = new Model('table1');
table1.createModel({
    attributes: {
        id: {
            type: dataType.Integer,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: dataType.String,
            unique: true,
        },
    },
    options: {
        timestamps: true,
    },
});

const table2: Model = new Model('table2');
table2.createModel({
    attributes: {
        id: {
            type: dataType.Integer,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: dataType.String,
            unique: true,
        },
    },
});

createManyToManyRelation('table1', 'table12', 'table2');





