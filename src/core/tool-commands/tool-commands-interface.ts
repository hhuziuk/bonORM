export interface toolCommandsInterface {
    find(): Promise<void>;
    findOne(object: Object): Promise<any>;
    create(object: Object): Promise<any>;
    save(object: Object): Promise<void>;
    deleteOne(object: Object): Promise<void>;
    deleteAll(object: Object): Promise<void>;
}