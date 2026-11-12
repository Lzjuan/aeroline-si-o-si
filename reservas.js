/* ==========================================================================
   DESIRE AIRWAYS — reservas.js
   Capa de acceso a localStorage. Mantiene el estado del proceso de compra
   entre páginas: búsqueda, vuelo, asiento, pasajeros, extras y reserva final.
   ========================================================================== */

const RESERVAS_KEYS = {
  busqueda: "da_busqueda",
  vuelo: "da_vuelo_seleccionado",
  asiento: "da_asiento_seleccionado",
  pasajeros: "da_pasajeros",
  extras: "da_extras",
  reserva: "da_reserva",
  reservasGuardadas: "da_reservas_guardadas"
};

function normalizarAsientosSeleccionados(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) return valor.filter(Boolean);
  if (typeof valor === "object") return [valor];
  return [];
}

function guardarAsientosSeleccionados(asientos) {
  const lista = normalizarAsientosSeleccionados(asientos);
  guardarEstado(RESERVAS_KEYS.asiento, lista);
  return lista;
}

function calcularPrecioExtraAsientos(asientos) {
  return normalizarAsientosSeleccionados(asientos)
    .reduce((total, asiento) => total + Number(asiento?.precioExtra || 0), 0);
}

function guardarEstado(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("No se pudo guardar el estado:", e);
    return false;
  }
}

function leerEstado(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("No se pudo leer el estado:", e);
    return null;
  }
}

function limpiarEstado(key) {
  localStorage.removeItem(key);
}

/* Genera un código de reserva alfanumérico tipo "TF8K4P2" */
function generarCodigoReserva() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let codigo = "TF";
  for (let i = 0; i < 5; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)];
  }
  return codigo;
}

/* Guarda una reserva completada en el "historial" de reservas (simulado). */
function guardarReservaCompletada(reserva) {
  const todas = leerEstado(RESERVAS_KEYS.reservasGuardadas) || [];
  todas.push(reserva);
  guardarEstado(RESERVAS_KEYS.reservasGuardadas, todas);
  guardarEstado(RESERVAS_KEYS.reserva, reserva);
}

function buscarReservaPorCodigoYCorreo(codigo, correo) {
  const todas = leerEstado(RESERVAS_KEYS.reservasGuardadas) || [];
  return todas.find(r =>
    r.codigo.toLowerCase() === codigo.trim().toLowerCase() &&
    r.pasajeros?.[0]?.correo?.toLowerCase() === correo.trim().toLowerCase()
  );
}
