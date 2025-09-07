import express from "express"
const app = express()
const port = 3000

app.use(express.json())


let resultados = []

app.post("/calculate", (req, res) => {
  const { base, altura } = req.body;

  if (!base || !altura || base <= 0 || altura <= 0) {
    return res.status(400).json({ error: "Base y altura must be higher than 0" });
  }

  const perimetro = 2 * (base + altura);
  const superficie = base * altura;

  resultados.push({ base, altura, perimetro, superficie });

  res.json({ mensaje: "Cálculo guardado con éxito" });
});

app.get("/calculos", (req, res) => {
  const lista = resultados.map((item) => {
    const tipo = item.base === item.altura ? "Cuadrado" : "Rectángulo";
    return { ...item, tipo };
  });

  res.json(lista);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
