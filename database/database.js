import * as SQLite from 'expo-sqlite';


export const connectToDatabase=async ()=>{

    const db=SQLite.openDatabaseAsync('company-register-db.db');
    return db;
}


export const createTables= async (db) =>{

    const createEmployeeQuery=
    `
        CREATE TABLE IF NOT EXISTS 'employee' (
        'id' INTEGER NOT NULL AUTOINCREMENT,
        'name' TEXT NOT NULL,
        'email' TEXT NOT NULL,
        'avatar_url' TEXT NOT NULL,
        PRIMARY KEY ('id'))

    `
    const createLocationQuery=
    `
        CREATE TABLE IF NOT EXISTS 'location' (
        'id' INTEGER NOT NULL,
        'name' TEXT NOT NULL,
        'latitude' REAL NOT NULL,
        'longitude' REAL NOT NULL,
        PRIMARY KEY ('id'))
    `
    const createInventoryListQuery=
    `
        CREATE TABLE IF NOT EXISTS 'inventory_list' (
        'id' INTEGER NOT NULL,
  
        PRIMARY KEY ('id'))
    `

    const createBasicAssetQuery=
    `
        CREATE TABLE IF NOT EXISTS 'basic_asset' (
        'id' INTEGER NOT NULL AUTOINCREMENT,
        'name' TEXT NOT NULL,
        'description' TEXT NOT NULL,
        'barcode' INTEGER NOT NULL,
        'price' REAL NOT NULL,
        'creation_date' TEXT NOT NULL,
        'photo_url' TEXT NOT NULL,
        'current_employee_id' INTEGER NOT NULL,
        'current_location_id' INTEGER NOT NULL,
        'old_employee_id' INTEGER NOT NULL,
        'old_location_id' INTEGER NOT NULL,
        'inventory_list_id' INTEGER NOT NULL,
        PRIMARY KEY ('id'),
        INDEX 'fk_basic_asset_employee_idx' ('current_employee_id' ASC) VISIBLE,
        INDEX 'fk_basic_asset_location1_idx' ('current_location_id' ASC) VISIBLE,
        INDEX 'fk_basic_asset_employee2_idx' ('old_employee_id' ASC) VISIBLE,
        INDEX 'fk_basic_asset_location2_idx' ('old_location_id' ASC) VISIBLE,
        INDEX 'fk_basic_asset_inventory_list1_idx' ('inventory_list_id' ASC) VISIBLE,
        
            FOREIGN KEY ('current_employee_id')
            REFERENCES 'employee' ('id')
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
       
            FOREIGN KEY ('current_location_id')
            REFERENCES 'location' ('id')
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
        
            FOREIGN KEY ('old_employee_id')
            REFERENCES 'employee' ('id')
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
        
            FOREIGN KEY ('old_location_id')
            REFERENCES 'location' ('id')
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
        
            FOREIGN KEY ('inventory_list_id')
            REFERENCES 'inventory_list' ('id')
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
    `
    try{
        await db.withTransactionSync(() => {
            try{
                db.runSync(createEmployeeQuery);
                db.runSync(createLocationQuery);
                db.runSync(createInventoryListQuery);
                db.runSync(createBasicAssetQuery);
            }
            catch(error){
                console.error(error);
            }
        })
    }
    catch(error){
        console.error(error);
        throw Error('Failed to create tables');
    }
}
