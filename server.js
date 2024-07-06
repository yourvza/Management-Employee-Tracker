const { prompt } = require("inquirer");
const db = require("./db");

init();

// Display logo text, load main prompts
function init() {
  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: getMainMenuChoices(),
    },
  ]).then(handleMainChoice);
}

function getMainMenuChoices() {
  return [
    { name: "View All Employees", value: "VIEW_EMPLOYEES" },
    {
      name: "View All Employees By Department",
      value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
    },
    {
      name: "View All Employees By Manager",
      value: "VIEW_EMPLOYEES_BY_MANAGER",
    },
    { name: "Add Employee", value: "ADD_EMPLOYEE" },
    { name: "Remove Employee", value: "REMOVE_EMPLOYEE" },
    { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
    { name: "Update Employee Manager", value: "UPDATE_EMPLOYEE_MANAGER" },
    { name: "View All Roles", value: "VIEW_ROLES" },
    { name: "Add Role", value: "ADD_ROLE" },
    { name: "Remove Role", value: "REMOVE_ROLE" },
    { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
    { name: "Add Department", value: "ADD_DEPARTMENT" },
    { name: "Remove Department", value: "REMOVE_DEPARTMENT" },
    {
      name: "View Total Utilized Budget By Department",
      value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT",
    },
    { name: "Quit", value: "QUIT" },
  ];
}

function handleMainChoice({ choice }) {
  switch (choice) {
    case "VIEW_EMPLOYEES":
      viewEmployees();
      break;
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      viewEmployeesByDepartment();
      break;
    case "VIEW_EMPLOYEES_BY_MANAGER":
      viewEmployeesByManager();
      break;
    case "ADD_EMPLOYEE":
      addEmployee();
      break;
    case "REMOVE_EMPLOYEE":
      removeEmployee();
      break;
    case "UPDATE_EMPLOYEE_ROLE":
      updateEmployeeRole();
      break;
    case "UPDATE_EMPLOYEE_MANAGER":
      updateEmployeeManager();
      break;
    case "VIEW_DEPARTMENTS":
      viewDepartments();
      break;
    case "ADD_DEPARTMENT":
      addDepartment();
      break;
    case "REMOVE_DEPARTMENT":
      removeDepartment();
      break;
    case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
      viewUtilizedBudgetByDepartment();
      break;
    case "VIEW_ROLES":
      viewRoles();
      break;
    case "ADD_ROLE":
      addRole();
      break;
    case "REMOVE_ROLE":
      removeRole();
      break;
    default:
      quit();
  }
}

function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(loadMainPrompts);
}

function viewEmployeesByDepartment() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name,
        value: id,
      }));

      return prompt({
        type: "list",
        name: "departmentId",
        message: "Which department would you like to see employees for?",
        choices: departmentChoices,
      });
    })
    .then(({ departmentId }) => db.findAllEmployeesByDepartment(departmentId))
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(loadMainPrompts);
}

function viewEmployeesByManager() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const managerChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt({
        type: "list",
        name: "managerId",
        message: "Which employee do you want to see direct reports for?",
        choices: managerChoices,
      });
    })
    .then(({ managerId }) => db.findAllEmployeesByManager(managerId))
    .then(({ rows }) => {
      console.log("\n");
      if (rows.length === 0) {
        console.log("The selected employee has no direct reports");
      } else {
        console.table(rows);
      }
    })
    .then(loadMainPrompts);
}

function removeEmployee() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: employeeChoices,
      });
    })
    .then(({ employeeId }) => db.removeEmployee(employeeId))
    .then(() => console.log("Removed employee from the database"))
    .then(loadMainPrompts);
}

function updateEmployeeRole() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      });
    })
    .then(({ employeeId }) => {
      return db.findAllRoles().then(({ rows }) => {
        const roleChoices = rows.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        return prompt({
          type: "list",
          name: "roleId",
          message: "Which role do you want to assign the selected employee?",
          choices: roleChoices,
        }).then(({ roleId }) => ({ employeeId, roleId }));
      });
    })
    .then(({ employeeId, roleId }) => db.updateEmployeeRole(employeeId, roleId))
    .then(() => console.log("Updated employee's role"))
    .then(loadMainPrompts);
}

function updateEmployeeManager() {
  db.findAllEmployees()
    .then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      return prompt({
        type: "list",
        name: "employeeId",
        message: "Which employee's manager do you want to update?",
        choices: employeeChoices,
      });
    })
    .then(({ employeeId }) => {
      return db.findAllPossibleManagers(employeeId).then(({ rows }) => {
        const managerChoices = rows.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id,
        }));

        return prompt({
          type: "list",
          name: "managerId",
          message:
            "Which employee do you want to set as manager for the selected employee?",
          choices: managerChoices,
        }).then(({ managerId }) => ({ employeeId, managerId }));
      });
    })
    .then(({ employeeId, managerId }) =>
      db.updateEmployeeManager(employeeId, managerId)
    )
    .then(() => console.log("Updated employee's manager"))
    .then(loadMainPrompts);
}

function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(loadMainPrompts);
}

function addRole() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name,
        value: id,
      }));

      return prompt([
        { name: "title", message: "What is the name of the role?" },
        { name: "salary", message: "What is the salary of the role?" },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices,
        },
      ]);
    })
    .then((role) => db.createRole(role))
    .then(({ title }) => console.log(`Added ${title} to the database`))
    .then(loadMainPrompts);
}

function removeRole() {
  db.findAllRoles()
    .then(({ rows }) => {
      const roleChoices = rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      return prompt({
        type: "list",
        name: "roleId",
        message:
          "Which role do you want to remove? (Warning: This will also remove employees)",
        choices: roleChoices,
      });
    })
    .then(({ roleId }) => db.removeRole(roleId))
    .then(() => console.log("Removed role from the database"))
    .then(loadMainPrompts);
}

function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      console.log("\n");
      console.table(rows);
    })
    .then(loadMainPrompts);
}
