import express from "express"
import {dataType} from "./src/core/data-types/data-types";
import {createModel} from "./src/core/entities/createModel";
import {createManyToManyRelation} from "./src/core/relations/Many-To-Many";
import {createOneToManyRelation} from "./src/core/relations/One-To-Many";
import {createOneToOneRelation} from "./src/core/relations/One-To-One";
const app = express();

const table = createModel("Table1", {
    attributes: {
        id: {
            type: dataType.String,
            unique: true,
            allowNull: false,
            defaultValue: "default",
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






