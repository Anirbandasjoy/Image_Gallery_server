const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

const port = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "image_gallery",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL DB is connected...");
});

// Routes

// Create an image
app.post("/images", (req, res) => {
  const { imageUrl, email } = req.body;

  const sql = "INSERT INTO images (image_url, email) VALUES (?, ?)";
  db.query(sql, [imageUrl, email], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, imageUrl, email });
  });
});

// Get all images
app.get("/images", (req, res) => {
  const sql = "SELECT * FROM images";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a single image by ID
app.get("/images/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM images WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Image not found");
    } else {
      res.json(result[0]);
    }
  });
});

// Update an image URL
app.put("/images/:id", (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  const sql = "UPDATE images SET image_url = ? WHERE id = ?";
  db.query(sql, [imageUrl, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send("Image not found");
    } else {
      res.send("Image updated");
    }
  });
});

// Delete an image
app.delete("/images/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM images WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send("Image not found");
    } else {
      res.send("Image deleted");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
