const express = require('express');
const pool = require('../modules/pool');
const {

} = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * POST route for creating a task
 */
router.post('/:id', (req, res,) => {

  console.log('REQ BODY ',req.body)

  const title = req.body.title;
  const description = req.body.description;
  const due_time = req.body.due_time;

  const projectId = req.params.id;

  const queryText = `INSERT INTO "tasks" ("title", "description", "due_time", project_id)
      VALUES ($1, $2, $3, $4 ) RETURNING id`;
  pool.query(queryText, [title, description, due_time, projectId])
    .then(result => {
      const createProjectId = result.rows[0].id
      console.log("new task id:", createProjectId);
      res.sendStatus(201);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
});
// Get all the task for a user 
router.get('/', (req, res) => {
  const queryText = `select tasks.id, tasks.title, tasks.due_time, tasks.completed_by, tasks.completed_time, tasks.parent_task from tasks 
    join project on tasks.project_id = project.id
    join project_employee on project.id = project_employee.project_id
    join "user" on project_employee.employee_id = "user".id
    where "user".id = $1;`
  pool.query(queryText, [req.user.id])
    .then(result => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('get tasks err: ', err);
      res.sendStatus(500);
    });
});

router.get('/projectTasks/:id', (req, res) => {
  const projectId = req.params.id;
  const queryText = `select tasks.id, tasks.title, tasks.description, tasks.due_time, tasks.completed_by, tasks.completed_time, tasks.parent_task from tasks
  join project on tasks.project_id = project.id
  where project.id = $1;`
  pool.query(queryText, [projectId])
    .then(result => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('get tasks err: ', err);
      res.sendStatus(500);
    });
});

router.put('/:id', (req, res) => {
  const queryText = `UPDATE tasks SET "complete" = Not "complete" WHERE "id" = $1;`;

  // Test

  pool.query(queryText, [req.params.id])
    .then(result => {
      console.log(req.params)
      res.sendStatus(204)
    }).catch(error => {
      res.sendStatus(500)
    })
})

router.delete('/:id', (req, res) => {
  const queryText = `DELETE FROM tasks WHERE "tasks".id = $1`; // delete tasks from tasks table
  console.log("delete task", req.params.id);
  pool.query(queryText, [req.params.id])
    .then((response) => res.sendStatus(200))
    .catch(error => {
      console.log(`Error deleting task`, error);
      res.sendStatus(500);
    });

})




module.exports = router;