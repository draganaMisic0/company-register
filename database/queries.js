/*
const getEmployees = async () => {

    const SQL= await initSqlJs();
    const response = await fetch("./company-register.db");
  const buffer = await response.arrayBuffer();

  // Inicijalizujte bazu iz binarnih podataka
  const db = new SQL.Database(new Uint8Array(buffer));
    const result = db.exec("select * from employee");
    console.log(result);
}
*/