const inquirer = require("inquirer");
const { db } = require("./connection");

// Function to add a new department
async function addDepartment(mainMenu) {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department?",
      },
    ]);

    const departmentName = answers.departmentName;
    await db.query("INSERT INTO department (dept_name) VALUES ($1)", [
      departmentName,
    ]);
    console.log("Department added successfully!");
  } catch (err) {
    console.error("Error adding department:", err);
  } finally {
    mainMenu();
  }
}

// Function to add a new role
async function addRole(mainMenu) {
  try {
    const dept = await db.query("SELECT * FROM department");
    const deptChoices = dept.rows.map(({ id, dept_name }) => ({
      name: dept_name,
      value: id,
    }));

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the name of the role?",
      },
      {
        type: "number",
        name: "roleSalary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "roleDepartment",
        message: "Which department does the role belong to?",
        choices: deptChoices,
      },
    ]);

    const { roleTitle, roleSalary, roleDepartment } = answers;
    await db.query(
      "INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)",
      [roleTitle, roleSalary, roleDepartment]
    );
    console.log("Role added successfully!");
  } catch (err) {
    console.error("Error adding role:", err);
  } finally {
    mainMenu();
  }
}

// Function to add a new employee
async function addEmployee(mainMenu) {
  try {
    const roles = await db.query("SELECT * FROM role");
    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const managers = await db.query("SELECT * FROM employee");
    const managerChoices = managers.rows.map(
      ({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })
    );
    managerChoices.unshift({ name: `None`, value: null });

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "employeeRole",
        message: "What is the employee's role?",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is the employee's manager?",
        choices: managerChoices,
      },
    ]);

    const { firstName, lastName, employeeRole, employeeManager } = answers;
    await db.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, employeeRole, employeeManager]
    );
    console.log("Employee added successfully!");
  } catch (err) {
    console.error("Error adding employee:", err);
  } finally {
    mainMenu();
  }
}

// Function to update an employee's role
async function updateEmployeeRole(mainMenu) {
  try {
    const employees = await db.query("SELECT * FROM employee");
    const employeeChoices = employees.rows.map(
      ({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })
    );

    const roles = await db.query("SELECT * FROM role");
    const roleChoices = roles.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const managers = await db.query("SELECT * FROM employee");
    const managerChoices = managers.rows.map(
      ({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })
    );
    managerChoices.unshift({ name: `None`, value: null });

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "employeeToUpdate",
        message: "Which employee's role would you like to update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "newRole",
        message: "What is the employee's new role?",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "employeeManager",
        message: "Who is the employee's new manager?",
        choices: managerChoices,
      },
    ]);

    const { employeeToUpdate, newRole, employeeManager } = answers;
    await db.query(
      "UPDATE employee SET role_id = $1, manager_id = $2 WHERE id = $3",
      [newRole, employeeManager, employeeToUpdate]
    );
    console.log("Employee role updated successfully!");
  } catch (err) {
    console.error("Error updating employee role:", err);
  } finally {
    mainMenu();
  }
}

module.exports = {
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
