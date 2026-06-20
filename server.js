const express = require('express');
const sequelize = require('./db');
const Project = require('./projectModel');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(cors()); 

const PORT = process.env.PORT || 8080;

// ==========================================
// 0. ENDPOINT ROOT (Untuk Indikator Hubungkan Frontend)
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Galaloc.std API Server is running"
  });
});

// ==========================================
// 1. ENDPOINT /health
// ==========================================
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "success",
      message: "Backend is running",
      database: "connected",
      student: {
        name: "Naufal Hakim Zulian",
        nim: "2311522026"
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Backend is running, but database is not connected",
      database: "disconnected",
      student: {
        name: "Naufal Hakim Zulian",
        nim: "2311522026"
      }
    });
  }
});

// ==========================================
// 2. ENDPOINT /schema
// ==========================================
app.get('/schema', (req, res) => {
  res.status(200).json({
    student: { 
      name: "Naufal Hakim Zulian", 
      nim: "2311522026"
    },
    resource: {
      name: "projects",
      label: "Data Manajemen Proyek Studio",
      description: "Aplikasi untuk mengelola data proyek pada Galaloc.std"
    },
    fields: [
      { name: "title", label: "Nama Proyek", type: "text", required: true, showInTable: true },
      { name: "platform", label: "Platform", type: "text", required: true, showInTable: true },
      { name: "difficulty", label: "Tingkat Kesulitan (1-5)", type: "number", required: true, showInTable: true },
      { name: "status", label: "Status Proyek", type: "text", required: true, showInTable: true }
    ],
    endpoints: {
      list: "/projects",
      detail: "/projects/{id}",
      create: "/projects",
      update: "/projects/{id}",
      delete: "/projects/{id}"
    }
  });
});

// ==========================================
// 3. ENDPOINT CRUD: GET ALL DATA
// ==========================================
app.get('/projects', async (req, res) => {
  try {
    const data = await Project.findAll();
    res.status(200).json(data); 
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ==========================================
// 4. ENDPOINT CRUD: GET DETAIL DATA BY ID
// ==========================================
app.get('/projects/:id', async (req, res) => {
  try {
    const data = await Project.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Data not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ==========================================
// 5. ENDPOINT CRUD: POST CREATE DATA
// ==========================================
app.post('/projects', async (req, res) => {
  try {
    const { title, platform, difficulty, status } = req.body;
    const newData = await Project.create({ title, platform, difficulty, status });
    res.status(201).json(newData); 
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ==========================================
// 6. ENDPOINT CRUD: PUT UPDATE DATA BY ID
// ==========================================
app.put('/projects/:id', async (req, res) => {
  try {
    const { title, platform, difficulty, status } = req.body;
    const data = await Project.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Data not found" });
    }
    
    await data.update({ title, platform, difficulty, status });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ==========================================
// 7. ENDPOINT CRUD: DELETE DATA BY ID
// ==========================================
app.delete('/projects/:id', async (req, res) => {
  try {
    const data = await Project.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ status: "error", message: "Data not found" });
    }
    
    await data.destroy();
    res.status(200).json({
      status: "success",
      message: "Data deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Menjalankan Server
sequelize.sync().then(() => {
  console.log('Database synchronized successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
