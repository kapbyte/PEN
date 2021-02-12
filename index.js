const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const pool = require("./db");

app.use(express.json());

// create todo
app.post('/create', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]);
    return res.status(200).json(newTodo.rows[0]);

  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "Something went wrong"
    })
  }
});

// Get list of all todos
app.get("/todos", async (req, res) => {
  try {
    const todoList = await pool.query("SELECT * FROM todo");
    return res.status(200).json(todoList.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "Something went wrong"
    })
  }
});

// Get a todo
app.get("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    return res.status(200).json(todo.rows);

  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "Something went wrong"
    });
  }
});

// Update a todo
app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
    return res.status(200).send("Update successful");

  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "Something went wrong"
    });
  }
});

// Delete a todo
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    return res.status(200).json("Delete successful");

  } catch (error) {
    console.log(error.message);
    return res.status(501).json({
      success: false,
      message: "Something went wrong"
    });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));