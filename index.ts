import express from "express"
import {dataType} from "./src/core/data-types/data-types";
import {Model} from "./src/core/entities/createModel";

const app = express();

const table = new Model('table1');
table.createModel({
    attributes: {
        id: {
            type: dataType.Integer,
            allowNull: false,
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

table.delete({where: {name: "Abdullah"}})

const table2 = new Model('table2');
table2.createModel({
    attributes: {
        id: {
            type: dataType.Integer,
            unique: true,
            autoIncrement: true,
        },
        email: {
            type: dataType.String,
            unique: true
        }
    }
});







