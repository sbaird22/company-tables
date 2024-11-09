import dotenv from 'dotenv';
import {Client} from 'pg';
import inquirer from 'inquirer';

dotenv.config();


const db = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
});

db.connect(err =>{
    if (err) throw err;
    console.log('Connected to DB');
    mainMenu();
});

function mainMenu(): void{
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices:[
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer =>{
        switch(answer.action){
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'addRole':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
}

// View departments
function viewAllDepartments(): void{
    db.query('SELECT * FROM departments' , (err, res)=>{
        if(err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}