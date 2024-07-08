const inquirer = require("inquirer");
const { db } = require("./db/connection");
const {
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require("./db/index");

// Main menu function to display choices to the user
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      // Handle the user's selection
      if (response.action === "View All Departments") {
        viewDepartments();
      } else if (response.action === "View All Roles") {
        viewRoles();
      } else if (response.action === "View All Employees") {
        viewEmployees();
      } else if (response.action === "Add Department") {
        addDepartment(mainMenu);
      } else if (response.action === "Add Role") {
        addRole(mainMenu);
      } else if (response.action === "Add Employee") {
        addEmployee(mainMenu);
      } else if (response.action === "Update Employee Role") {
        updateEmployeeRole(mainMenu);
      } else {
        process.exit(); // Exit the application
      }
    });
}

// Function to view all departments
function viewDepartments() {
  db.query("SELECT * FROM department", function (err, { rows }) {
    if (err) {
      console.error("Error fetching departments:", err);
    } else {
      console.table(rows); // Display departments in a table format
    }
    mainMenu(); // Return to the main menu
  });
}

// Function to view all roles
function viewRoles() {
  db.query(
    "SELECT role.id, role.title, department.dept_name, role.salary FROM role JOIN department ON role.department = department.id",
    function (err, { rows }) {
      if (err) {
        console.error("Error fetching roles:", err);
      } else {
        console.table(rows); // Display roles in a table format
      }
      mainMenu(); // Return to the main menu
    }
  );
}

// Function to view all employees
function viewEmployees() {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`,
    function (err, { rows }) {
      if (err) {
        console.error("Error fetching employees:", err);
      } else {
        console.table(rows); // Display employees in a table format
      }
      mainMenu(); // Return to the main menu
    }
  );
}

// Start the application by displaying the main menu
mainMenu();
