import dotenv from 'dotenv';
import pg from 'pg';
import inquirer from 'inquirer';

dotenv.config();

const {Pool} =pg;

const db = new Pool({
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

function mainMenu(){
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
function viewAllDepartments(){
    db.query('SELECT * FROM departments' , (err, res)=>{
        if(err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

// View roles
function viewAllRoles(){
    db.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary From roles JOIN departments ON roles.department_id = departments.id', (err, res)=>{
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

//View employees
function viewAllEmployees(){
    db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONTACT (manager.first_name, manager.last_name) AS manger FROM employees JOIN roles ON employee.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manger ON employees.manger_id = manager.id',(err, res)=>{
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}