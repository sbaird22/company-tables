-- Connect to the company_db
\c company_db;

-- Insert data into departments
INSERT INTO departments (name) VALUES 
    ('Sales'),
    ('Engineering'),
    ('Human Resources'),
    ('Marketing');

-- Insert data into roles
INSERT INTO roles (title, salary, department_id) VALUES 
    ('Sales Manager', 75000, 1),
    ('Sales Representative', 50000, 1),
    ('Software Engineer', 90000, 2),
    ('Engineering Manager', 120000, 2),
    ('HR Specialist', 60000, 3),
    ('HR Manager', 85000, 3),
    ('Marketing Specialist', 65000, 4),
    ('Marketing Manager', 90000, 4);

-- Insert data into employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),  -- Sales Manager with no manager
    ('Jane', 'Smith', 2, 1),   -- Sales Rep, manager is John Doe
    ('Alice', 'Johnson', 4, NULL),  -- Engineering Manager with no manager
    ('Bob', 'Brown', 3, 3),    -- Software Engineer, manager is Alice Johnson
    ('Carol', 'White', 6, NULL), -- HR Manager with no manager
    ('Dave', 'Green', 5, 5),   -- HR Specialist, manager is Carol White
    ('Emma', 'Black', 8, NULL), -- Marketing Manager with no manager
    ('Frank', 'Jones', 7, 7);  -- Marketing Specialist, manager is Emma Black

-- Verify the data
SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;
