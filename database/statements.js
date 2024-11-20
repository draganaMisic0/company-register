const insertEmpoloyee= (name, email, avatar_url)=>{

    const sql=`
        INSERT INTO employee (name, email, avatar_url) VALUES (?, ?, ?)
    `
    db_.prepare(sql).run(name, email, avatar_url)
}



export const getEmployees =()=>{

    const sql=`
        SELECT * from employee
    `
    const rows= db_.prepare(sql).all()
    console.log(rows);
}

const getEmployee = (id) =>{

    const sql=`
        SELECT * FROM employee
        WHERE id=?
    `
    const row=db_.prepare(sql).all(id)
    console.log(row);
}






