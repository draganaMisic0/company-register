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


          const dropTable1=`DROP TABLE IF EXISTS basic_asset;`;
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
                  
                  FOREIGN KEY (current_employee_id) REFERENCES employee(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                  FOREIGN KEY (current_location_id) REFERENCES location(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                  FOREIGN KEY (old_employee_id) REFERENCES employee(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                  FOREIGN KEY (old_location_id) REFERENCES location(id) ON DELETE NO ACTION ON UPDATE NO ACTION
                
              );
          `;
          const dropTable=`DROP VIEW IF EXISTS asset_details;`;
          const createAssetView = `
              
              CREATE VIEW IF NOT EXISTS "asset_details" AS
              SELECT 
                  ba.id AS asset_id,
                  ba.name AS asset_name,
                  ba.description AS asset_description,
                  ba.barcode AS asset_barcode,
                  ba.price AS asset_price,
                  ba.creation_date AS asset_creation_date,
                  ba.photo_url AS asset_photo_url,
                  e.name AS current_employee_name,
                  l.name AS current_location_name,
                  e_old.name AS old_employee_name,
                  l_old.name AS old_location_name
                
              FROM basic_asset ba
              JOIN employee e ON ba.current_employee_id = e.id
              JOIN location l ON ba.current_location_id = l.id
              JOIN employee e_old ON ba.old_employee_id = e_old.id
              JOIN location l_old ON ba.old_location_id = l_old.id;
             
          `;
          const dropTable2=`DROP TABLE IF EXISTS list_has_asset;`;
          const createInventoryListDetailed=
          `CREATE VIEW IF NOT EXISTS "inventory_asset_details" AS
            SELECT 
            il.id AS inventory_list_id,
              il.name AS inventory_list_name,
              ad.asset_id,
              ad.asset_name,
              ad.asset_description,
              ad.asset_barcode,
              ad.asset_price,
              ad.asset_creation_date,
              ad.asset_photo_url,
              ad.current_employee_name,
              ad.current_location_name,
              ad.old_employee_name,
              ad.old_location_name
              FROM inventory_list il
            JOIN asset_details ad ON il.id = ad.inventory_list_id;`;

          const createListAsset=
          ` CREATE TABLE IF NOT EXISTS "list_has_asset" (
              list_id INTEGER NOT NULL,
              asset_id INTEGER NOT NULL,
              PRIMARY KEY (list_id, asset_id),
              FOREIGN KEY (list_id) REFERENCES inventory_list (id),
              FOREIGN KEY (asset_id) REFERENCES basic_asset (id)

          );`;
          const createPairs=
              `CREATE TABLE list_has_assets (
              id INTEGER PRIMARY KEY,
              list_id INTEGER NOT NULL,
              asset_id INTEGER NOT NULL,
               FOREIGN KEY (list_id) REFERENCES inventory_list (id),
                FOREIGN KEY (asset_id) REFERENCES basic_asset (id)
              );`;

          const createP=
          `CREATE TABLE list_asset_pair (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              list_id INTEGER NOT NULL,
              asset_id INTEGER NOT NULL,
               FOREIGN KEY (list_id) REFERENCES inventory_list (id),
                FOREIGN KEY (asset_id) REFERENCES basic_asset (id)
              );`;
          
          const createPairsWithProperties=
          `   CREATE VIEW IF NOT EXISTS "inventory_asset_connection" AS
              SELECT 
                  lha.id, 
                  lha.list_id,
                 
                  iad.asset_id,
                  iad.asset_name,
                  iad.asset_description,
                  iad.asset_barcode,
                  iad.asset_price,
                  iad.asset_creation_date,
                  iad.asset_photo_url,
                  iad.current_employee_name,
                  iad.current_location_name,
                  iad.old_employee_name,
                  iad.old_location_name
              FROM list_has_assets lha
              JOIN asset_details iad ON lha.asset_id = iad.asset_id;

          `;
          const dropTable3=`DROP TABLE IF EXISTS list_has_assets;`;
          const createList=
          `CREATE VIEW IF NOT EXISTS "list_elements" AS
          SELECT 
              lha.list_id,
              ad.asset_id,
              ad.asset_name,
              ad.asset_description,
              ad.asset_barcode,
              ad.asset_price,
              ad.asset_creation_date,
              ad.asset_photo_url,
              ad.current_employee_name,
              ad.current_location_name,
              ad.old_employee_name,
              ad.old_location_name
          FROM list_has_assets lha
          JOIN asset_details ad ON lha.asset_id = ad.asset_id;`;

          const alterTable=`ALTER TABLE list_has_assets
              MODIFY COLUMN id INT AUTOINCREMENT,
            ADD PRIMARY KEY (id);
            `;

          const deletepairs=`DELETE FROM list_has_assets;`;
          const renameTable=`RENAME TABLE list_asset_pair TO list_has_assets;`;
          const insertQuery1 = 
            `INSERT INTO location (name, latitude, longitude) VALUES ('Paris', 48.8566, 2.3522)`;
            `INSERT INTO location (name, latitude, longitude) VALUES ('London', 51.5074, -0.1278)`;
          
          const insertQuery2=`INSERT INTO basic_asset (name, description, barcode, price, creation_date, photo_url, current_employee_id, 
                current_location_id, old_employee_id, old_location_id, inventory_list_id) 
                VALUES ('HP', 'hp', '000', 500.00, '2000/01/01', 'photo.jpg', 28, 2, 30, 2, 15)`;
          const deleteAllAssetsQuery=`DELETE FROM basic_asset;`;
          const query=`select * from inventory_asset_details;`;
          const deleteAssetsQuery=`DELETE FROM basic_asset;`;
          try {
            // First Transaction for employee, location, and inventory
           // await db.runSync(createEmployeeQuery);
           // console.log("Employee table created");
          //  await db.runSync(createLocationQuery);
          //  console.log("Location table created");
          //  await db.runSync(createInventoryListQuery);
           // console.log("Inventory List table created");
    
            // Second Transaction for dropping and creating basic asset
           // await db.runSync(dropTable1);  // Drop if exists
          //  await db.runSync(createBasicAssetQuery);
          //  console.log("Basic Asset table created");
    
            // Third Transaction for views and assets
            //await db.runSync(dropTable);  // Drop view if exists
          //  await db.runSync(createAssetView);
            //console.log("Asset view created successfully");
    
            //await db.runSync(dropTable2);  // Drop another view if exists
          //  await db.runSync(createListAsset);
           // console.log("List Asset table created");
          //  await db.runSync(createList);
          //  console.log("List created");
           // await db.runSync(insertQuery1); 
           //await db.runSync(deleteAllAssetsQuery);
          // await db.runSync(createPairs);
          //await db.runSync(createPairsWithProperties);
          //console.log("kreirano");
         //await db.runSync(dropTable3);
       //  await db.runSync(deletepairs);
        // await db.runSync(createP);
        //await db.runSync(alterTable);
           // await db.runSync(renameTable);
    
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
        `INSERT INTO location (name, latitude, longitude) VALUES ('Paris', 48.8566, 2.3522)`,
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
        `INSERT INTO basic_asset (name, description, barcode, price, creation_date, photo_url, current_employee_id, 
          current_location_id, old_employee_id, old_location_id, inventory_list_id) 
          VALUES ('Laptop A', 'Dell Latitude', 'LAP001', 1000.00, 01.01.2001., 'photo.jpg', 28, 30, 15)`,
      
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

//Inventory_list CRUD methods
export const getAllInventoryLists = async(db) => {

  return new Promise((resolve, reject)=>{
    db.withTransactionSync(async () =>{
      try{
        let lists=await db.getAllAsync("select * from 'inventory_list';", []);
       //
       //  console.log(lists);
        resolve(lists);
      }
      catch(error){
        reject(error);
      }
    });
  });
};
export const removeItemFromList = async (db, itemId)=>{

  return new Promise((resolve, reject) => {

    db.withTransactionSync(async ()=>{
      try{
        let queryResult=await db.runAsync('delete from list_has_assets where id=$id;', { $id: itemId});
        resolve(queryResult);
      }
      catch(error){
        reject(error);
      }
    });
  });
}
export const getAllInventoryListItemsById = async(db, listId) => {

  

  return new Promise((resolve, reject)=>{
    db.withTransactionSync(async () =>{
      try{
        let items=await db.getAllAsync("select * from 'inventory_asset_connection' where list_id=$id;",{$id:listId});
      
       //
       //  console.log(lists);
        resolve(items);
      }
      catch(error){
       
        reject(error);
      }
    });
  });
};



export const addInventoryList= async(db, inventoryList)=> {
 // console.log("ime"+inventoryList.name);
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
export const addListAssetPair= async(db, list_id, asset_id) => {
  // console.log("ime"+inventoryList.name);
  console.log(list_id+"  "+asset_id);
   return new Promise((resolve, reject)=>{
   db.withTransactionSync(()=>{
     try{
       let queryResult= db.runSync('insert into list_has_assets(list_id, asset_id) values ($list_id, $asset_id);', 
                                     {$list_id: list_id, $asset_id: asset_id}
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
  //console.log("id u delete "+id);
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

export const getAllListAssetPairs = async (db) => {


  return new Promise((resolve, reject) => {
    
    db.withTransactionSync( async () => {
      try{
        let rows = await db.getAllAsync("select * from 'list_has_assets'", []);
        rows.forEach(row => {
          //console.log("ispisuje row");
          //console.log(row);
         // console.log("\n");
        });
       
        
        resolve(rows);

      }
      catch(error){
        reject(error);
      }
    });
  });
};

//Employee CRUD methods
const getAllEmployeesQuery = "SELECT * FROM 'employee';";
export const getAllEmployees = async (db) => {


    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          let rows = await db.getAllAsync(getAllEmployeesQuery, []);
          rows.forEach(row => {
            //console.log("ispisuje row");
            //console.log(row);
           // console.log("\n");
          });
         
          
          resolve(rows);

        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  const addEmployeeQuery = "INSERT INTO employee (name, email, avatar_url) VALUES ($name, $email,  $avatar_url);";

  export const addEmployee = async (db, employee) => {
   
    return new Promise((resolve, reject) => {
      db.withTransactionSync(() => {
        try{
          //console.log(employee.avatarUrl);
          let queryResult = db.runSync(addEmployeeQuery, { $name: employee.name, 
                                                                     $email: employee.email, 
                                                                    
                                                                     $avatar_url: employee.avatarUrl
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

   
    return new Promise((resolve, reject) => {
      db.withTransactionSync( async () => {
        try{
          let queryResult = await db.runAsync('update employee set name=$name, email=$email, avatar_url=$avatarUrl where id=$id;', 
                                              { $name: employee.name, $email: employee.email,
                                               $avatarUrl: employee.avatarUrl, $id: employee.id});
                                                                   
          
          resolve(queryResult);
        }
        catch(error){

          
          reject(error);
        }
      });
    });
}
  export const deleteEmployee= async (db, id) => {
    //console.log("id u delete "+id);
    return new Promise((resolve, reject) => {

      db.withTransactionSync(async ()=> {
        try{
          let queryResult = db.runSync('delete from employee where id=$id;', {$id: id});
          resolve(queryResult);
        }
        catch(error){
        
          reject(error);
        }
      })
    })
  }
  
//Assets CRUD methods

  export const getAssetById = async (db, id)=>{

   
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          let rows = await db.getAllAsync("select * from 'asset_details' where asset_id=$id;", {$id:id});
          rows.forEach(row => {
           
            //console.log("\n");
          });
          resolve(rows);
           
        }
        catch(error){
          reject(error);
        }
      });
    });
  }
  export const getAllAssets = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          let rows = await db.getAllAsync("select * from 'basic_asset'", []);
          rows.forEach(row => {
           // console.log(row);
            //console.log("\n");
          });
          resolve(rows);

        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  export const getAllAssetsDetails = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          let rows = await db.getAllAsync("select * from 'asset_details'", []);
          rows.forEach(row => {
           // console.log(row);
            //console.log("\n");
          });
          resolve(rows);

        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  export const getAllAssetsFromView = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( async () => {
        try{
          let rows = await db.getAllAsync("select * from 'asset_details'", []);
          rows.forEach(row => {
            //console.log(row);
            //console.log("\n");
          });
          resolve(rows);

        }
        catch(error){
          reject(error);
        }
      });
    });
  };

  export const getLocationNameById = async (db, locationId) => {
    //console.log("u bazi id "+locationId);
    return new Promise((resolve, reject) => {
      db.withTransactionSync(async () => {
        try{
          let queryResult= await db.runAsync("select name from location where id=$current_location_id",
                                             {$current_location_id: locationId});
            //console.log(queryResult);
                                             const locationName = queryResult[0]?.name || "Unknown";
                                            // console.log("location name "+locationName);
         // console.log(resolve(queryResult));

        }
        catch(error){
          reject(error);
          console.log(error);
        }
      });
    });
  }

  export const getAssetsByLocationId = async (db, locationId) => {
    return new Promise((resolve, reject) => {
      db.withTransactionSync(async () => {
        try {
          let queryResult = await db.getAllAsync("SELECT * FROM asset_details WHERE asset_id IN (SELECT id FROM basic_asset WHERE current_location_id=$chosenLocation)", 
            { $chosenLocation: locationId });
          
          resolve(queryResult);
        } catch (error) {
          reject(error);
         
        }
      });
    });
  };
  
  
export const updateAsset = async (db, asset) => {
  //console.log("Updating asset with ID: " + asset.id);
  console.log("u update metodi");
  console.log(asset);
  return new Promise((resolve, reject) => {
      db.withTransactionSync(async () => {
          try {
              let queryResult = await db.runAsync(
                  `UPDATE basic_asset 
                   SET name = $name, 
                       description = $description, 
                       barcode = $barcode, 
                       price = $price, 
                       creation_date = $creationDate, 
                       photo_url = $photoUrl
                     
                      
                   WHERE id = $id;`,
                  {
                      $id: asset.id,
                      $name: asset.name,
                      $description: asset.description,
                      $barcode: asset.barcode,
                      $price: asset.price,
                      $creationDate: asset.creationDate,
                      $photoUrl: asset.photoUrl,
                    
                     
                  }
              );

              resolve(queryResult);
          } catch (error) {
              console.error("Error updating asset:", error);
              reject(error);
          }
      });
  });
};

const addAssetQuery = `INSERT INTO basic_asset (name, description, barcode, price, creation_date, photo_url, current_employee_id, 
            current_location_id, old_employee_id, old_location_id)
           VALUES ($name, $description,  $barcode, $price, $creation_date, $photo_url, $current_employee_id, 
                  $current_location_id, $old_employee_id, $old_location_id);`;

export const addAsset = async (db, asset) => {
 
  //console.log(asset);
  return new Promise((resolve, reject) => {
    db.withTransactionSync(() => {
      try{
       
        let queryResult = db.runSync(addAssetQuery, { $name: asset.name, 
                                                      $description: asset.description, 
                                                      $barcode: asset.barcode, 
                                                      $price: asset.price, 
                                                      $creation_date: asset.creationDate, 
                                                      $photo_url: asset.photoUrl, 
                                                      $current_employee_id: asset.currentEmployee.id,  
                                                      $current_location_id: asset.currentLocation.id, 
                                                      $old_employee_id: asset.oldEmployee.id, 
                                                      $old_location_id: asset.oldLocation.id, 
                                                      
                                                    });
        resolve(queryResult);
      }
      catch(error){
        reject(error);
      }
    });
  });
}
export const deleteAsset= async (db, id) => {
 
 
  return new Promise((resolve, reject) => {

    db.withTransactionSync(async ()=> {
      try{
        let queryResult = db.runSync('delete from basic_asset where id=$id;', {$id: id});
        resolve(queryResult);
      }
      catch(error){
       
        reject(error);
      }
    })
  })
}



  //Location CRUD methods

  export const getAllLocations = async (db) => {
    return new Promise((resolve, reject) => {
      
      db.withTransactionSync( () => {
        try{
          let rows = db.getAllSync("select * from 'location'", []);
          resolve(rows);
        }
        catch(error){
          console.error("ERROR HAPPENED");
          reject(error);
        }
      });
    });
  };

  const addLocationQuery = "INSERT INTO location (name, latitude, longitude) VALUES ($name, $latitude,  $longitude);";

  export const addLocation = async (db, location) => {
   
    return new Promise((resolve, reject) => {
      db.withTransactionSync(() => {
        try{
          //console.log(employee.avatarUrl);
          let queryResult = db.runSync(addLocationQuery, { $name: location.name, 
                                                                     $latitude: location.latitude, 
                                                                    
                                                                     $longitude: location.longitude
                                                                    });
          resolve(queryResult);
        }
        catch(error){
          reject(error);
        }
      });
    });
  }

  export const deleteLocation= async (db, id) => {
 
    
    return new Promise((resolve, reject) => {
  
      db.withTransactionSync(async ()=> {
        try{
          let queryResult = db.runSync('delete from location where id=$id;', {$id: id});
          resolve(queryResult);
        }
        catch(error){
         
          reject(error);
        }
      })
    })
  }
  



  
       
  

  



