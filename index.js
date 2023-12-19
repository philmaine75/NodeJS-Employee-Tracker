const inquirer = require('inquirer');
const { db } = require('./server');

const departments = async () => {
    const sql = `SELECT id AS value, department_name AS name FROM department;`;
    const departments = await db.query(sql);
    return departments[0];
};   

const employees = async () => {
    const sql = `SELECT employee_id AS value, CONCAT( first_name, " " , last_name) AS name FROM employee;`;
    const employees = await db.query(sql);
    return employees[0];
};   

const roles = async () => {
    const sql = `SELECT id AS value, title AS name FROM role;`;
    const roles = await db.query(sql);
    return roles[0];
}; 

class EmployeeTracker {
    constructor() {}

    async run() {
        try {
            const answer = await inquirer.prompt({
                type: 'list',
                name: 'menu',
                message: 'Please select an option below',
                choices: [
                    'View departments',
                    'View roles',
                    'View employees',
                    'Add department',
                    'Add role',
                    'Add employee',
                    'Update employee role',
                    'Close'
                ]
            });

            switch (answer.menu) {
                case 'View departments':
                    await this.viewDepartments();
                    break;
                case 'View roles':
                    await this.viewRoles();
                    break;
                case 'View employees':
                    await this.viewEmployees();
                    break;
                case 'Add department':
                    await this.addDepartment();
                    break;
                case 'Add role':
                    await this.addRole();
                    break;
                case 'Add employee':
                    await this.addEmployee();
                    break;
                case 'Update employee role':
                    await this.updateEmployeeRole();
                    break;
                case 'Close':
                    db.end();
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async viewDepartments() {
        const [rows, fields] = await db.query('SELECT department_name AS "Department Name", id AS "Department ID" FROM department;');
        console.log('\nDisplaying Departments');
        console.table(rows);
        await this.run();
    }

    async viewRoles() {
        const [rows, fields] = await db.query('SELECT role.title AS "Role Title", role.id AS "Role ID", department.department_name AS "Department Name", role.salary AS Salary FROM role LEFT JOIN department ON role.department_id = department.id;');
        console.log('\nDisplaying Roles');
        console.table(rows);
        await this.run();
    }

    async viewEmployees() {
        const [rows, fields] = await db.query('SELECT E.employee_id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", role.title AS "Job Title", department.department_name AS Department, role.salary AS Salary FROM employee E LEFT JOIN role ON E.role_id = role.id LEFT JOIN department ON role.department_id = department.id');
        console.log('\nDisplaying Employees');
        console.table(rows);
        await this.run();
    }

    async addDepartment() {
        console.log('\nAdd department');
        const answer = await inquirer.prompt({
            type: 'input',
            name: 'addDepartment',
            message: 'Please enter department name or "r" to return to menu',
        });

        if (answer.addDepartment.toLowerCase() === 'r') {
            return this.run();
        }

        try {
            await db.query(`INSERT INTO department (department_name) VALUES ("${answer.addDepartment}");`);
            console.log(`Added ${answer.addDepartment} to departments`);
        } catch (err) {
            console.log(err);
        }

        await this.run();
    }

    async addRole() {
        console.log('\nAdd role');
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Please enter the title of the role or "r" to return to the menu',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Please enter the salary of the role or "r" to return to the menu',
            },
            {
                type: 'list',
                name: "roleDepartment",
                message: "Please select the department of the role",
                choices: await departments()
            }
        ]);

        if (answers.roleTitle.toLowerCase() === 'r') {
            return this.run();
        }

        try {
            await db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.roleTitle}', "${answers.roleSalary}", ${answers.roleDepartment});`);
            console.log(`Added ${answers.roleTitle} to roles`);
        } catch (err) {
            console.log(err);
        }

        await this.run();
    }

    async addEmployee() {
        console.log('\nAdd employee');
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employee first name',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employee last name',
            },
            {
                type: 'list',
                name: "role",
                message: "Select the employee role",
                choices: await roles()
            },
        ]);

        try {
            await db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES  ('${answers.firstName}', "${answers.lastName}", ${answers.role})`);
            console.log(`Added ${answers.firstName} ${answers.lastName} to employees`);
        } catch (err) {
            console.log(err);
        }

        await this.run();
    }

    async updateEmployeeRole() {
        console.log('\nUpdate employee role');
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: "updatingEmployee",
                message: "Please choose the employee whose role you want to update",
                choices: await employees()
            },
            {
                type: 'list',
                name: "updatedRole",
                message: "Please choose the role for this employee",
                choices: await roles()
            }
        ]);

        try {
            await db.query(`UPDATE employee SET role_id = ${answers.updatedRole} WHERE employee_id = ${answers.updatingEmployee}`);
            console.log(`Updated ${answers.updatingEmployee}'s role as ${answers.updatedRole}`);
        } catch (err) {
            console.log(err);
        }

        await this.run();
    }
}



db.connect(err => {
    if (err) throw err;
})
    .then(() => {
        new EmployeeTracker().run();
    });
