import { resolveUri } from 'expo-asset/build/AssetSources';
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
            avatar_url TEXT
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
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT NOT NULL
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
          console.log("before employee");
            db.runSync(createEmployeeQuery);
         
            console.log("after employee");
            db.runSync(createLocationQuery);
            console.log("after lcoation");
            db.runSync(createInventoryListQuery);
            console.log("after inventory");
            db.runSync(createBasicAssetQuery);
            console.log("after asset");
            
            
           
           
        });
    } catch (error) {
        console.error('Failed to create tables:', error);
        throw new Error('Failed to create tables');
    }
};


const insertTestData = async (db, table) => {
  let insertQueries = [];
  switch (table) {
    case 'employee':
      insertQueries = [
       // `INSERT INTO employee (name, email, photoUrl) VALUES ('Test Employee', 'john.doe@example.com', 50000, 'https://example.com/photo1.jpg')`
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Jane Smith', 'jane.smith@example.com', 55000, 'https://example.com/photo2.jpg')`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Emily Johnson', 'emily.johnson@example.com', 60000, 'https://example.com/photo3.jpg')`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Michael Brown', 'michael.brown@example.com', 45000, NULL)`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Sarah Davis', 'sarah.davis@example.com', 48000, NULL)`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Chris Evans', 'chris.evans@example.com', 52000, 'https://example.com/photo6.jpg')`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Jessica Wilson', 'jessica.wilson@example.com', 53000, 'https://example.com/photo7.jpg')`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('David Martinez', 'david.martinez@example.com', 49000, NULL)`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Laura White', 'laura.white@example.com', 47000, 'https://example.com/photo8.jpg')`,
        //`INSERT INTO employee (name, email, income, photoUrl) VALUES ('Peter Green', 'peter.green@example.com', 51000, 'https://example.com/photo9.jpg')`
      ];
      break;
    case 'location':
      insertQueries = [
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Test Head Office', 500, 37.7749, -122.4194)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Warehouse A', 1500, 34.0522, -118.2437)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Branch Office', 300, 40.7128, -74.0060)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Warehouse B', 2000, 51.5074, -0.1278)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Remote Office', 250, 48.8566, 2.3522)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Warehouse C', 1800, 35.6895, 139.6917)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Sales Office', 400, 52.5200, 13.4050)`,
        //`INSERT INTO location (name, size, latitude, longitude) VALUES ('Data Center', 1000, 41.9028, 12.4964)`
      ];
      break;
    case 'basic_asse':
      insertQueries = [
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Laptop A', 'Dell Latitude', 'LAP001', 1000.00, 1, 1, 'https://example.com/assetA.jpg')`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Printer B', 'HP LaserJet', 'PRI001', 300.00, 2, 2, NULL)`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Monitor C', 'Samsung 24 inch', 'MON001', 150.00, 3, 3, 'https://example.com/assetC.jpg')`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Projector D', 'Epson 4K', 'PROJ001', 800.00, 4, 4, 'https://example.com/assetD.jpg')`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Tablet E', 'Apple iPad', 'TAB001', 500.00, 5, 5, NULL)`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Smartphone F', 'Samsung Galaxy', 'PHN001', 700.00, 1, 6, 'https://example.com/assetF.jpg')`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Desk G', 'Office Desk', 'DSK001', 200.00, 2, 7, NULL)`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Chair H', 'Ergonomic Chair', 'CHR001', 150.00, 3, 8, 'https://example.com/assetH.jpg')`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Server I', 'Dell PowerEdge', 'SRV001', 3000.00, 4, 9, 'https://example.com/assetI.jpg')`,
        `INSERT INTO fixed_asset (name, description, barcode, price, location_id, employee_id, photoUrl) VALUES ('Router J', 'Cisco Router', 'RTR001', 600.00, 5, 10, NULL)`
      ];
      break;
    case 'inventory_list':
      insertQueries = [
        `INSERT INTO inventory_list (name) VALUES ('Office Supplies Transfer')`,
       // `INSERT INTO transfer_list (name) VALUES ('IT Equipment Transfer')`,
       // `INSERT INTO transfer_list (name) VALUES ('Furniture Transfer')`,
       // `INSERT INTO transfer_list (name) VALUES ('Electronics Transfer')`,
       // `INSERT INTO transfer_list (name) VALUES ('Miscellaneous Transfer')`
      ];
      break;
    case 'inventory_item':
      insertQueries = [
      
      ];
      break;
    default:
      return;
  }

  for (const query of insertQueries) {
    await db.runAsync(query);
  }
};
export const getAllInventoryLists = async(db) => {

  return new Promise((resolve, reject)=>{
    db.withTransactionSync(async () =>{
      try{
        let lists=await db.getAllAsync("select * from 'inventory_list';", []);
        console.log(lists);
        resolve(lists);
      }
      catch(error){
        reject(error);
      }
    });
  });
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

  const addEmployeeQuery = "INSERT INTO employee (name, email, avatar_url) VALUES ($name, $email,  $avatar);";

  export const addEmployee = async (db, employee) => {
   
    return new Promise((resolve, reject) => {
      db.withTransactionSync(() => {
        try{
          let queryResult = db.runSync(addEmployeeQuery, { $name: employee.name, 
                                                                     $email: employee.email, 
                                                                    
                                                                     $avatar_url: employee.avatar
                                                                    });
          resolve(queryResult);
        }
        catch(error){
          reject(error);
        }
      });
    });
  }
  export const updateEmployee= async (db, employee) => {

    console.log("udje u bazu "+employee.name);
    console.log("udje u bazu "+employee.id);
    console.log("udje u bazu "+employee.email);
    return new Promise((resolve, reject) => {
      db.withTransactionSync( async () => {
        try{
          let queryResult = await db.runAsync('update employee set name=$name, email=$email, avatar_url=$avatarUrl where id=$id;', 
                                              { $name: employee.name, $email: employee.email,
                                               $avatarUrl: employee.avatarUrl, $id: employee.id});
                                                                   
          
          resolve(queryResult);
        }
        catch(error){

          console.log(error);
          reject(error);
        }
      });
    });
}
  export const deleteEmployee= async (db, id) => {
    console.log("id u delete "+id);
    return new Promise((resolve, reject) => {

      db.withTransactionSync(async ()=> {
        try{
          let queryResult = db.runSync('delete from employee where id=$id;', {$id: id});
          resolve(queryResult);
        }
        catch(error){
          console.log(error);
          reject(error);
        }
      })
    })
  }
  

  export const addInventoryList= async(db, inventoryList)=> {
    console.log("ime"+inventoryList.name);
    return new Promise((resolve, reject)=>{
    db.withTransactionSync(()=>{
      try{
        let queryResult= db.runSync('insert into inventory_list(name) values ($name);', 
                                      {$name: inventoryList.name}
        );
        resolve(queryResult);
      }
      catch (transactionError) {
        console.error("Transaction failed:", transactionError);
        reject(transactionError);
      }
    });
  });
  }
  export const deleteInventoryList = async (db, id) => {
    console.log("id u delete "+id);
    return new Promise((resolve, reject) => {

      db.withTransactionSync(async ()=>{
        try{
          let queryResult=await db.runAsync('delete from inventory_list where id=$id;', { $id: id});
          resolve(queryResult);
        }
        catch(error){
          reject(error);
        }
      });
    });
  }

  



