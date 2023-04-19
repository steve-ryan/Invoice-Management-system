require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "ims",
});

//Retrieving all tasks
app.get("/tasks", (req, res) => {
  pool.query("SELECT * FROM task", (error, results, fields) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.status(200).json(results);
    }
  });
});

//Creating task
app.post('/tasks', (req, res) => {
    const task = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      date_assigned: req.body.date_assigned,
      date_submitted: req.body.date_submitted,
      is_paid: req.body.is_paid,
      client_id: req.body.client_id
    };
  
    pool.query('INSERT INTO task SET ?', task, (error, results, fields) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.status(200).send('Task created successfully');
      }
    });
  });

  //Updating task
  app.put('/tasks/:id', (req, res) => {
    const task = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      date_assigned: req.body.date_assigned,
      date_submitted: req.body.date_submitted,
      is_paid: req.body.is_paid,
      client_id: req.body.client_id
    };
  
    const taskId = req.params.id;
  
    pool.query('UPDATE task SET ? WHERE id = ?', [task, taskId], (error, results, fields) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.status(200).send('Task updated successfully');
      }
    });
  });

  //Delete task
  app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
  
    pool.query('DELETE FROM task WHERE id = ?', taskId, (error, results, fields) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.status(200).send('Task deleted successfully');
      }
    });
  });