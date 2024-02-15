"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
const columnsMetadataKey = "columns";
function Column(options = {}, ...validators) {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options, validators }], target);
        if (validators && validators.length > 0) {
            Reflect.defineMetadata("validators", validators, target, propertyKey);
        }
    };
}
exports.Column = Column;
