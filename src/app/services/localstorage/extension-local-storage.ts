import {DBSchema} from "idb";

export interface ExtensionLocalStorage extends DBSchema{
    // ALMENTA CAPPACIDADE DE ARMAZENAMENTO DO LOCAL STORAGE
    files: {
        key: string;
        value: any;
    };

}
