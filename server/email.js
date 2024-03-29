
const pool = require('./modules/pool');
require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendReminderEmails() {

    console.log('running scheduled task: reminder email');
    const queryText = `select project.id, project.title, project.description, project.due_time, project.progression, project.completed, project.completed_time, "user".id, "user".first_name, "user".email from project
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where project.completed_time = CURRENT_DATE;`
    pool.query(queryText).then(result => {

        // console.log("result", result.rows);

        for (let emails of result.rows) {
            console.log(emails.email);
            let title = emails.title;
            let description = emails.description;
            let due_date = emails.due_time;
            let first_name = emails.first_name;


            const message = {
                to: [emails.email],
                from: "philippebaraka13@gmail.com",
                subject: title,
                text: description,
                html: "<strong>Your project is completed.</strong>",
            };

            sendGridMail.send(message)
                .then(() => {
                    console.log("Email sent")
                })
                .catch((error) => {
                    console.log(error);
                })
            console.log(emails.email);

        }

    })
    const queryText1 = `select project.id, project.title, project.description, project.due_time, project.progression, project.completed, project.completed_time, "user".id, "user".first_name, "user".email from project
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where DATE_TRUNC('DAY', project.due_time) = CURRENT_DATE+interval '26days';`

    const queryText2 = `select project.id, project.title, project.description, project.due_time, project.progression, project.completed, project.completed_time, "user".id, "user".first_name, "user".email from project
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where DATE_TRUNC('DAY', project.due_time) = CURRENT_DATE+interval '90days';`

    const queryText3 = `select project.id, project.title, project.description, project.due_time, project.progression, project.completed, project.completed_time, "user".id, "user".first_name, "user".email from project
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where DATE_TRUNC('DAY', project.due_time) = CURRENT_DATE;`
    pool.query(queryText1).then(result => {

        // console.log("result", result.rows);

        for (let emails of result.rows) {
            console.log(emails.email);
            let title = emails.title;
            let description = emails.description;
            let due_date = emails.due_time;
            let first_name = emails.first_name;

            if (emails.completed === true) {
                console.log("this project is completed")
            } else {

                const message = {
                    to: [emails.email],
                    from: "philippebaraka13@gmail.com",
                    subject: title,
                    text: description,
                    html: "<strong>You have a month left in your project.</strong>",
                };

                sendGridMail.send(message)
                    .then(() => {
                        console.log("Email sent for a month left")
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                console.log(emails.email);
            }
        }
    });

    pool.query(queryText2).then(result => {

        // console.log("result", result.rows);

        for (let emails of result.rows) {
            console.log(emails.email);
            let title = emails.title;
            let description = emails.description;
            let due_date = emails.due_time;
            let first_name = emails.first_name;
            if (emails.completed === true) {

                console.log("the project is completed")
            } else {


                const message = {
                    to: [emails.email],
                    from: "philippebaraka13@gmail.com",
                    subject: title,
                    text: description,
                    html: "<strong>You have 3 months left in your project.</strong>",
                };

                sendGridMail.send(message)
                    .then(() => {
                        console.log("Email sent")
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                console.log(emails.email);
            }
        }

    })
    pool.query(queryText3).then(result => {

        // console.log("result", result.rows);

        for (let emails of result.rows) {
            console.log(emails.email);
            let title = emails.title;
            let description = emails.description;
            let due_date = emails.due_time;
            let first_name = emails.first_name;
            if (emails.completed === true) {

                console.log("the project is completed")

                const message = {
                    to: [emails.email],
                    from: "philippebaraka13@gmail.com",
                    subject: title,
                    text: description,
                    html: "<strong> Your project is expiring today.</strong>",
                };

                sendGridMail.send(message)
                    .then(() => {
                        console.log("Email sent")
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                console.log(emails.email);
            }

        }

    })


}






module.exports = sendReminderEmails;