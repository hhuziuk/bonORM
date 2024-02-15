const columnsMetadataKey = "columns";
export function Column(options: any = {}, ...validators: any[]): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const columns = Reflect.getMetadata(columnsMetadataKey, target) || [];
        Reflect.defineMetadata(columnsMetadataKey, [...columns, { propertyKey, options, validators }], target);

        if (validators && validators.length > 0) {
            Reflect.defineMetadata("validators", validators, target, propertyKey);
        }
    };
}