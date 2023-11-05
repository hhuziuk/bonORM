import express from "express"
import {dataType} from "./src/core/data-types/data-types";
import {Model} from "./src/core/entities/createModel";

const app = express();

const table = new Model('table1');
table.createModel({
    attributes: {
        id: {
            type: dataType.Integer,
            unique: true,
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
console.log("Started")








