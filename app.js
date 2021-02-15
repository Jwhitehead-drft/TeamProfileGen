const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const validator = require("validator");
var figlet = require('figlet');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
//global variables
let teamGroup = [];
//this is going to be the Id for all the employees, so they dont repeat themself
let employeeId = 1;
let newEmployee;
//function to create a manager

figlet('Welcome Team!!', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    createManager();
});

function createManager() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "managerName",
                message: "What is your manager's name?",
                validate: (response) => {
                    if (
                        /^[a-zA-Z]+$/.test(response) ||
                        /^[a-zA-Z]+ [a-zA-Z]+$/.test(response)
                    ) {
                        return true;
                    }
                    return "Please enter first or last Name";
                },
            },
            {
                type: "input",
                name: "managerEmail",
                message: "What is the manager's email?",
                validate: (response) => {
                    if (validator.isEmail(response)) {
                        return true;
                    }
                    return "Please enter valid Email";
                },
            },
            {
                type: "input",
                name: "managerOfficeNumber",
                message: "What is the manager office number",
                validate: (response) => {
                    if (isNaN(response) || response === "") {
                        return "Please enter a Number";
                    }
                    return true;
                },
            },
            {
                type: "list",
                name: "teamMembers",
                message: "Do you have team members?",
                choices: ["Yes", "No"],
            },
        ])
        .then((responses) => {
            const manager = new Manager(
                responses.managerName,
                employeeId,
                responses.managerEmail,
                responses.managerOfficeNumber
            );
            teamGroup.push(manager);
            if (responses.teamMembers === "Yes") {
                createTeam();
            } else {
                buildHtml();
            }
        });
}
//function to create employees (Engineer or Interns)
function createTeam() {
    console.log("Team");
    inquirer
        .prompt([
            {
                type: "input",
                name: "nameEmployee",
                message: "What is the name of the Employee?",
                validate: (response) => {
                    if (
                        /^[a-zA-Z]+$/.test(response) ||
                        /^[a-zA-Z]+ [a-zA-Z]+$/.test(response)
                    ) {
                        return true;
                    }
                    return "Please enter the name of the employee";
                },
            },
            {
                type: "input",
                name: "emailEmployee",
                message: "What is employee's Email?",
                validate: (response) => {
                    if (validator.isEmail(response)) {
                        return true;
                    }
                    return "Please enter valid Email";
                },
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is employee's Role?",
                choices: ["engineer", "intern"],
            },
            {
                type: "input",
                name: "employeeGithub",
                message: "Whats the github of the engineer?",
                when: (response) => {
                    return response.employeeRole == "engineer";
                },
                validate: (response) => {
                    if (/^[a-zA-Z_-]+$/.test(response)) {
                        return true;
                    }
                    return "Please enter correct github";
                },
            },
            {
                type: "input",
                name: "employeeSchool",
                message: "What is the school of the intern?",
                when: (response) => {
                    return response.employeeRole == "intern";
                },
                validate: (response) => {
                    if (/^[a-zA-Z]+$/.test(response)) {
                        return true;
                    }
                    return "Please enter a School";
                },
            },
            {
                type: "list",
                name: "moreEmployee",
                message: "Add more employees?",
                choices: ["Yes", "No"],
            },
        ])
        .then((response) => {
            employeeId++;

            if (response.employeeRole == "engineer") {
                newEmployee = new Engineer(
                    response.nameEmployee,
                    employeeId,
                    response.emailEmployee,
                    response.employeeGithub
                );
            } else {
                newEmployee = new Intern(
                    response.nameEmployee,
                    employeeId,
                    response.emailEmployee,
                    response.employeeSchool
                );
            }
            teamGroup.push(newEmployee);
            if (response.moreEmployee === "Yes") {
                createTeam();
            } else {
                buildHtml();
            }
        });
}
//function to create the html, send array employees to render the html
function buildHtml() {
    var page = render(teamGroup);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    //create the file html
    fs.writeFile(outputPath, page, function (err) {
        if (err) throw err;
    });
}