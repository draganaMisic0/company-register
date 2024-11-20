import * as SQLite from 'expo-sqlite';

export const connectToDatabase = async () => {

    const db = SQLite.openDatabaseAsync('companyRegister.db');  // openDatabase is the correct function
    return db;
};

export const createTables = async (db) => {
    const createEmployeeQuery = `
        CREATE TABLE IF NOT EXISTS employee (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            avatar_url TEXT NOT NULL
        );
    `;

    const createLocationQuery = `
        CREATE TABLE IF NOT EXISTS location (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        );
    `;

    const createInventoryListQuery = `
        CREATE TABLE IF NOT EXISTS inventory_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT
        );
    `;

    const createBasicAssetQuery = `
        CREATE TABLE IF NOT EXISTS basic_asset (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            barcode INTEGER NOT NULL,
            price REAL NOT NULL,
            creation_date TEXT NOT NULL,
            photo_url TEXT NOT NULL,
            current_employee_id INTEGER NOT NULL,
            current_location_id INTEGER NOT NULL,
            old_employee_id INTEGER NOT NULL,
            old_location_id INTEGER NOT NULL,
            inventory_list_id INTEGER NOT NULL,
            FOREIGN KEY (current_employee_id) REFERENCES employee(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            FOREIGN KEY (current_location_id) REFERENCES location(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            FOREIGN KEY (old_employee_id) REFERENCES employee(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            FOREIGN KEY (old_location_id) REFERENCES location(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
            FOREIGN KEY (inventory_list_id) REFERENCES inventory_list(id) ON DELETE NO ACTION ON UPDATE NO ACTION
        );
    `;

    try {
      
      
        await db.withTransactionSync( () => { 
            db.runSync(createEmployeeQuery); 
            db.runSync(createLocationQuery);
            db.runSync(createInventoryListQuery);
            db.runSync(createBasicAssetQuery);
        });
    } catch (error) {
        console.error('Failed to create tables:', error);
        throw new Error('Failed to create tables');
    }
};




const getAllEmployeesQuery = "SELECT * FROM 'employee';";
export const getAllEmployees = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          let rows = await db.getAllAsync(getAllEmployeesQuery, []);
          console.log(rows);
          resolve(rows);

        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  const addEmployeeQuery = "INSERT INTO employee (name, email, avatar_url) VALUES ($name, $email,  $avatarUrl);";

  export const addEmployee = async (db, employee) => {
   
    return new Promise((resolve, reject) => {
      db.withTransactionSync( async () => {
        try{
          let rowsChanged = await db.runAsync(addEmployeeQuery, { $name: employee.name, 
                                                                     $email: employee.email, 
                                                                    
                                                                     $avatarUrl: employee.avatarUrl
                                                                    });
          resolve(rowsChanged);
        }
        catch(error){
          reject(error);
        }
      });
    });
}



