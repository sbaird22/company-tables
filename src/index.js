import dotenv from 'dotenv';
import inquirer from 'inquirer';
import pkg from 'pg';

dotenv.config();
const {Client} = pkg;


const db = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT, 10)
});

db.connect(err =>{
    if (err) throw err;
    console.log('Connected to DB');
    mainMenu();
});

async function mainMenu(){
    const answer= await inquirer.prompt({
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
    });
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
// Add department
function addDepartment(){
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    }).then(answer =>{
        db.query('INSERT INTO departments (name) VALUES ($1)', [answer.name], (err)=>{
            if (err) throw err;
            console.log('Department added successfully!');
        });
    });
}
//Add role
function addRole(){
    db.query('SELECT * FROM departments', (err, res)=>{
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for this role:',
                choices: res.rows.map(dept =>({name: dept.name, value: dept.id}))
            }
        ]).then(answer =>{
            db.query('INSERT INTO roles(title, salary,department_id) VALUES ($1, $2, $3)',
                [answer.title, answer.salary, answer.department_id], (err) =>{
                    if (err) throw err;
                    console.log('Role added successfully!');
                    mainMenu();
                });
        });
    });
}

//Add employee
function addEmployee() {
    db.query('SELECT * FROM roles', (err, resRoles) => {
        if (err) throw err;
        db.query('SELECT * FROM employees', (err, resEmployees) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role:',
                    choices: resRoles.rows.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager:',
                    choices: [{ name: 'None', value: null }].concat(
                        resEmployees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
                    )
                }
            ]).then(answer => {
                db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err) => {
                    if (err) throw err;
                    console.log('Employee added successfully!');
                    mainMenu();
                });
            });
        });
    });
}

// Update employee role
function updateEmployeeRole() {
    db.query('SELECT * FROM employees', (err, resEmployees) => {
        if (err) throw err;
        db.query('SELECT * FROM roles', (err, resRoles) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: resEmployees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role:',
                    choices: resRoles.rows.map(role => ({ name: role.title, value: role.id }))
                }
            ]).then(answer => {
                db.query('UPDATE employees SET role_id = $1 WHERE id = $2', 
                [answer.role_id, answer.employee_id], (err) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    mainMenu();
                });
            });
        });
    });
}