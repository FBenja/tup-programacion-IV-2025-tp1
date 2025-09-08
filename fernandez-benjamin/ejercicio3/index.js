import express from "express"
const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno
let tareas = [];

// Crear tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof completada !== "boolean") {
    return res.status(400).json({ error: "Debe enviar nombre y completada (true/false)" });
  }

  // Verificar duplicados
  if (tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase())) {
    return res.status(400).json({ error: "Ya existe una tarea con ese nombre" });
  }

  tareas.push({ nombre, completada });
  res.json({ mensaje: "Tarea agregada con éxito" });
});

// Listar todas las tareas (con filtro opcional)
app.get("/tareas", (req, res) => {
  const { estado } = req.query;

  if (estado === "completadas") {
    return res.json(tareas.filter(t => t.completada));
  }

  if (estado === "pendientes") {
    return res.json(tareas.filter(t => !t.completada));
  }

  res.json(tareas);
});

// Obtener una tarea por nombre
app.get("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase());

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  res.json(tarea);
});

// Modificar tarea
app.put("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const { nuevoNombre, completada } = req.body;

  const index = tareas.findIndex(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  // Verificar duplicados en caso de cambiar nombre
  if (nuevoNombre && tareas.some((t, i) => i !== index && t.nombre.toLowerCase() === nuevoNombre.toLowerCase())) {
    return res.status(400).json({ error: "Ya existe una tarea con ese nombre" });
  }

  tareas[index].nombre = nuevoNombre || tareas[index].nombre;

  if (typeof completada === "boolean") {
    tareas[index].completada = completada;
  }

  res.json({ mensaje: "Tarea modificada con éxito" });
});

// Eliminar tarea
app.delete("/tareas/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const index = tareas.findIndex(t => t.nombre.toLowerCase() === nombre.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  tareas.splice(index, 1);
  res.json({ mensaje: "Tarea eliminada con éxito" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
