import express from "express"
const app = express();
const PORT = 3000;

app.use(express.json());


let alumnos = [];


function calcularEstado(notas) {
  const promedio = (notas[0] + notas[1] + notas[2]) / 3;
  let estado = "";

  if (promedio < 6) estado = "Reprobado";
  else if (promedio < 8) estado = "Aprobado";
  else estado = "Promocionado";

  return { promedio: promedio.toFixed(2), estado };
}


app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || !notas || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: "Debe enviar nombre y 3 notas en un array" });
  }


  if (alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase())) {
    return res.status(400).json({ error: "Ya existe un alumno con ese nombre" });
  }

  alumnos.push({ nombre, notas });
  res.json({ mensaje: "Alumno agregado con éxito" });
});


app.get("/alumnos", (req, res) => {
  res.json(alumnos);
});


app.get("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  const { promedio, estado } = calcularEstado(alumno.notas);
  res.json({ ...alumno, promedio, estado });
});


app.put("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const { nuevoNombre, notas } = req.body;

  const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }


  if (!notas || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: "Debe enviar 3 notas en un array" });
  }


  if (nuevoNombre && alumnos.some((a, i) => i !== index && a.nombre.toLowerCase() === nuevoNombre.toLowerCase())) {
    return res.status(400).json({ error: "Ya existe un alumno con ese nombre" });
  }

  alumnos[index].nombre = nuevoNombre || alumnos[index].nombre;
  alumnos[index].notas = notas;

  res.json({ mensaje: "Alumno modificado con éxito" });
});

app.delete("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombre.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }

  alumnos.splice(index, 1);
  res.json({ mensaje: "Alumno eliminado con éxito" });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
