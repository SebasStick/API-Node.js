import express from 'express';

const PORT = 3001;
const app = express();
app.use(express.json());

const productos = [
  { id: 'prod-101', nombre: 'Empanada de Carne', precio: 3.50 },
  { id: 'prod-102', nombre: 'Arepa de Huevo', precio: 4.25 },
  { id: 'prod-103', nombre: 'Salchipapa Clásica', precio: 9.80 },
  { id: 'prod-104', nombre: 'Choriperro Especial', precio: 12.50 },
  { id: 'prod-105', nombre: 'Aborrajado', precio: 6.00 }
];

let orders = []; 

// Listado de pedidos 
app.get("/orders", (req, res) => {
  res.status(200).json({
    mensaje: "Listado de pedidos entregado correctamente",
    data: orders
  });
});

// Pedidos por Id
app.get("/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = orders.find(o => o.id == id);

  if (!order) {
    return res.status(404).json({
      mensaje: "ID no encontrado"
    });
  }

  res.status(200).json({
    mensaje:"ID encontrado correctamente",
    data: order
  });
});

// Crear pedido
app.post("/orders", (req, res) => {
  const { usuario, productos: idsProductos } = req.body;
  if (!usuario || !idsProductos || idsProductos.length === 0) {
    return res.status(400).json({ error: "Campos requeridos faltantes" });
  }

  const productosSeleccionados = productos.filter(p => idsProductos.includes(p.id));

  if (productosSeleccionados.length !== idsProductos.length) {
    return res.status(404).json({ error: "Algunos productos no existen" });
  }

  const total = productosSeleccionados.reduce((suma, p) => suma + p.precio, 0);

  const nuevoPedido = {
    id: orders.length + 1,
    usuario,
    productos: idsProductos,
    total
  };

  orders.push(nuevoPedido);

  res.status(201).json({ mensaje: "Pedido creado exitosamente", data: nuevoPedido });
});

// Actualizar Pedido
app.put("/orders/:id", (req, res) => {
  const order = orders.find(p => p.id == req.params.id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  
  Object.assign(order, req.body);
  res.json({ mensaje: "Pedido actualizado correctamente", data: order });
});

// Eliminar Pedido
app.delete("/orders/:id", (req, res) => {
  const index = orders.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Pedido no encontrado" });
  
  orders.splice(index, 1);
  res.json({ mensaje: "Pedido eliminado correctamente" });
});

// Servidor
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
