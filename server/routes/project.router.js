
const express = require('express');
const pool = require('../modules/pool');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

router.get('/', (req, res) => {
    const query = `select project.id, project.title, project.description, project.due_time, project.progression, project.completed, project.completed_time from project
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where "user".id = $1;`

    pool.query(query, [req.user.id])
    .then (result => {
        res.send(result.rows);
    })
    .catch((error) => {
        console.log('Error making SELECT for runs:', error);
        res.sendStatus(500);
    });
})

//Post route for project 
// "id" SERIAL PRIMARY KEY,
// 	"title" varchar,
// 	"description" varchar,
// 	"progression" int,
// 	"due_time" timestamp,
// 	"completed" boolean default false,
// 	"completed_time" timestamp 
router.post('/', (req, res,) => {
    const title = req.body.title;
    const description = req.body.description;
    const progression = req.body.progression;
    const due_time = req.body.due_time;
    const completed = req.body.completed;
    const completed_time = req.body.completed_time;

    const insertProjectquery = `INSERT INTO "project" ("title", "description", "progression", "due_time", "completed", "completed_time")
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    pool.query(insertProjectquery, [title, description, progression, due_time, completed, completed_time])
        .then(result => {
            const createProjectId = result.rows[0].id
            console.log("new project id:", createProjectId);
            res.sendStatus(201);

        }).catch(err => {
            console.log(err);
            res.sendStatus(500)
        })

});

router.delete('/:id', (req, res) =>{
    const query1 = `delete from company_project where project.id = $1`; // delete project from company_project join table
    const query2 = `delete from project_employee where project.id = $1`;// delete project from project_employee join table
    const query3 = `delete from tasks where project.id = $1`; // delete project tasks from tasks table
    const query4 = `delete from project where project.id = $1`; // delete the project from the project table
    
    pool.query(query1, [req.params.id])
    .then((response) => res.sendStatus(200))
    .catch(error => {
        console.log(`Error deleting run`, error);
        res.sendStatus(500);
    });
    
    pool.query(query2, [req.params.id])
    .then((response) => res.sendStatus(200))
    .catch(error => {
        console.log(`Error deleting run`, error);
        res.sendStatus(500);
    });
    
    pool.query(query3, [req.params.id])
    .then((response) => res.sendStatus(200))
    .catch(error => {
        console.log(`Error deleting run`, error);
        res.sendStatus(500);
    });
    
    pool.query(query4, [req.params.id])
    .then((response) => res.sendStatus(200))
    .catch(error => {
        console.log(`Error deleting run`, error);
        res.sendStatus(500);
    });
    
    
})

module.exports = router;