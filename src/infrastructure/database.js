import * as SQLite from 'expo-sqlite';

// Conexión síncrona para evitar errores en Android
const db = SQLite.openDatabaseSync('artesanias.db');

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      producto TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      estado TEXT NOT NULL,
      fecha TEXT NOT NULL,
      usuario_id TEXT NOT NULL,
      sincronizado INTEGER DEFAULT 0,
      firestore_id TEXT
    );
  `);
};

export const agregarPedidoLocal = async (pedido) => {
  const { cliente, producto, cantidad, precio, estado, fecha, usuario_id } = pedido;
  const result = await db.runAsync(
    `INSERT INTO pedidos (cliente, producto, cantidad, precio, estado, fecha, usuario_id, sincronizado, firestore_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL);`,
    [cliente, producto, cantidad, precio, estado, fecha, usuario_id]
  );
  return result.lastInsertRowId;
};

export const obtenerPedidosLocales = async (usuarioId) => {
  return await db.getAllAsync(
    `SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC;`, 
    [usuarioId]
  );
};

export const actualizarPedidoLocal = async (pedido) => {
  const { id, cliente, producto, cantidad, precio, estado } = pedido;
  await db.runAsync(
    `UPDATE pedidos SET cliente = ?, producto = ?, cantidad = ?, precio = ?, estado = ?, sincronizado = 0 WHERE id = ?;`,
    [cliente, producto, cantidad, precio, estado, id]
  );
};

export const eliminarPedidoLocal = async (id) => {
  await db.runAsync(`DELETE FROM pedidos WHERE id = ?;`, [id]);
};

export const obtenerPedidosNoSincronizados = async () => {
  return await db.getAllAsync(`SELECT * FROM pedidos WHERE sincronizado = 0;`);
};

// Guarda el ID de Firebase para futuras ediciones
export const marcarComoSincronizado = async (id, firestoreId) => {
  await db.runAsync(
    `UPDATE pedidos SET sincronizado = 1, firestore_id = ? WHERE id = ?;`, 
    [firestoreId, id]
  );
};

export const obtenerPedidoPorId = async (id) => {
  return await db.getFirstAsync(`SELECT * FROM pedidos WHERE id = ?;`, [id]);
};