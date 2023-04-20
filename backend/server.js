const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.pwd,
  database: process.env.db,
});

// Connect to database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Register admin
app.post("/admin/register", (req, res) => {
  const { name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const admin = { name, password: hashedPassword };
  const sql = "INSERT INTO admin SET ?";
  db.query(sql, admin, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Admin added successfully");
    }
  });
});

// Login admin
app.post("/admin/login", (req, res) => {
  const { name, password } = req.body;
  const sql = "SELECT * FROM admin WHERE name=?";
  db.query(sql, name, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(401).send("Invalid name or password");
    }
    const admin = result[0];
    const passwordIsValid = bcrypt.compareSync(password, admin.password);
    if (!passwordIsValid) {
      return res.status(401).send("Invalid name or password");
    }
    const token = jwt.sign({ id: admin.id }, "secret", { expiresIn: 86400 });
    res.send({ auth: true, token: token });
  });
});

// Edit admin
app.put("/admin/:id", (req, res) => {
  const id = req.params.id;
  const { name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "UPDATE admin SET name=?, password=? WHERE id=?";
  db.query(sql, [name, hashedPassword, id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Admin updated successfully");
    }
  });
});

// Create client
app.post("/client", (req, res) => {
  const { name, phone } = req.body;
  const client = { name, phone };
  const sql = "INSERT INTO client SET ?";
  db.query(sql, client, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Client created successfully");
    }
  });
});

// Read clients
app.get("/clients", (req, res) => {
  const sql = "SELECT * FROM client";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

// Update client
app.put("/client/:id", (req, res) => {
  const id = req.params.id;
  const { name, phone } = req.body;
  const sql = "UPDATE client SET name=?, phone=? WHERE id=?";
  db.query(sql, [name, phone, id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Client updated successfully");
    }
  });
});

// Delete client
app.delete("/client/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM client WHERE id=?";
  db.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Client deleted successfully");
    }
  });
});

// Create task
app.post("/task", (req, res) => {
  const {name,description,price, date_assigned,date_submitted,is_paid,client_id} = req.body;
  const task = { name,description, price,date_assigned, date_submitted, is_paid,client_id };
  const sql = "INSERT INTO task SET ?";
  db.query(sql, task, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Task created successfully");
    }
  });
});

// Read tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM task";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

// Update task
app.put("/task/:id", (req, res) => {
  const id = req.params.id;
  const {name,description,price,date_assigned,date_submitted,is_paid, client_id} = req.body;
  const sql =
    "UPDATE task SET name=?, description=?, price=?, date_assigned=?, date_submitted=?, is_paid=?, client_id=? WHERE id=?";
  db.query(
    sql,
    [name,description,price,date_assigned,date_submitted,is_paid,client_id,id],
    (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send("Task updated successfully");
      }
    }
  );
});

// Delete task
app.delete("/task/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM task WHERE id=?";
  db.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send("Task deleted successfully");
    }
  });
});

// Get client names, total number of orders, and total amount for unpaid orders
app.get('/unpaid-orders', (req, res) => {
  const sql = `SELECT c.name, COUNT(t.id) as total_orders, SUM(t.price) as total_amount FROM client c JOIN task t ON t.client_id = c.id
    WHERE t.is_paid = 0 GROUP BY c.id`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

// Get all tasks for a given client ID that are not paid
app.get('/client/:clientId/tasks/unpaid', (req, res) => {
  const clientId = req.params.clientId;
  const sql = `SELECT * FROM task WHERE client_id = ? AND is_paid = 0`;
  db.query(sql, [clientId], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

//Get all unpaid task between two dates.
app.get('/tasks/unpaid/:startDate/:endDate', (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const sql = `SELECT * FROM task WHERE is_paid = 0 AND date_submitted BETWEEN ? AND ?`;
  db.query(sql, [startDate, endDate], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

// Get all unpaid tasks for a given client name
app.get('/tasks/unpaid/:clientName', (req, res) => {
  const clientName = req.params.clientName;
  const sql = ` SELECT task.* FROM task INNER JOIN client ON task.client_id = client.id
    WHERE client.name LIKE ? AND task.is_paid = 0`;
  db.query(sql, [`%${clientName}%`], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});


app.listen(port, () => {
  console.log(`IMS app listening at http://localhost:${port}`);
});
