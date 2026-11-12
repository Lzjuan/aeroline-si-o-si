/* ==========================================================================
   DESIRE AIRWAYS — vuelos.js
   Base de datos ficticia de vuelos, aeropuertos y aviones.
   NO se conecta a ninguna API real. Todo es simulado.
   ========================================================================== */

/* ---------- Aeropuertos ---------- */
const AEROPUERTOS = [
  { codigo: "BOG", ciudad: "Bogotá", nombre: "El Dorado", pais: "Colombia" },
  { codigo: "CTG", ciudad: "Cartagena", nombre: "Rafael Núñez", pais: "Colombia" },
  { codigo: "MDE", ciudad: "Medellín", nombre: "José María Córdova", pais: "Colombia" },
  { codigo: "CLO", ciudad: "Cali", nombre: "Alfonso Bonilla Aragón", pais: "Colombia" },
  { codigo: "SMR", ciudad: "Santa Marta", nombre: "Simón Bolívar", pais: "Colombia" },
  { codigo: "IBE", ciudad: "Ibagué", nombre: "Perales", pais: "Colombia" },
  { codigo: "ADZ", ciudad: "San Andrés", nombre: "Gustavo Rojas Pinilla", pais: "Colombia" },
  { codigo: "MIA", ciudad: "Miami", nombre: "Miami International", pais: "Estados Unidos" },
  { codigo: "JFK", ciudad: "Nueva York", nombre: "John F. Kennedy", pais: "Estados Unidos" },
  { codigo: "MEX", ciudad: "Ciudad de México", nombre: "Benito Juárez", pais: "México" },
  { codigo: "LIM", ciudad: "Lima", nombre: "Jorge Chávez", pais: "Perú" },
  { codigo: "EZE", ciudad: "Buenos Aires", nombre: "Ezeiza", pais: "Argentina" },
  { codigo: "SCL", ciudad: "Santiago de Chile", nombre: "Arturo Merino Benítez", pais: "Chile" },
  { codigo: "YYZ", ciudad: "Toronto", nombre: "Pearson", pais: "Canadá" },
  { codigo: "GRU", ciudad: "São Paulo", nombre: "Guarulhos", pais: "Brasil" },
  { codigo: "MAD", ciudad: "Madrid", nombre: "Adolfo Suárez Madrid-Barajas", pais: "España" },
  { codigo: "CDG", ciudad: "París", nombre: "Charles de Gaulle", pais: "Francia" },
  { codigo: "LHR", ciudad: "Londres", nombre: "Heathrow", pais: "Reino Unido" },
  { codigo: "BCN", ciudad: "Barcelona", nombre: "El Prat", pais: "España" },
  { codigo: "LIS", ciudad: "Lisboa", nombre: "Humberto Delgado", pais: "Portugal" }
];

/* ---------- Aviones y configuración de cabina ---------- */
const AVIONES = {
  A320: { modelo: "Airbus A320", filas: 30, config: ["A", "B", "C", "D", "E", "F"], premiumHasta: 4 },
  A319: { modelo: "Airbus A319", filas: 24, config: ["A", "B", "C", "D", "E", "F"], premiumHasta: 3 },
  B738: { modelo: "Boeing 737-800", filas: 28, config: ["A", "B", "C", "D", "E", "F"], premiumHasta: 4 },
  A330: { modelo: "Airbus A330", filas: 42, config: ["A", "B", "C", "D", "E", "F", "G", "H"], premiumHasta: 6 }
};

/* Genera asientos ocupados "aleatorios pero fijos" a partir de una semilla,
   para que cada vuelo siempre muestre la misma ocupación. */
function generarOcupados(seed, filas, columnas, cantidad) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const ocupados = new Set();
  while (ocupados.size < cantidad) {
    const fila = Math.floor(rand() * filas) + 1;
    const col = columnas[Math.floor(rand() * columnas.length)];
    ocupados.add(`${fila}${col}`);
  }
  return Array.from(ocupados);
}

/* ---------- Precios base por clase (multiplicador sobre precio económica) ---------- */
const MULTIPLICADOR_CLASE = {
  economica: 1,
  "economica-premium": 1.6,
  ejecutiva: 2.6,
  primera: 4.2
};

const NOMBRE_CLASE = {
  economica: "Económica",
  "economica-premium": "Económica Premium",
  ejecutiva: "Ejecutiva",
  primera: "Primera"
};

/* ---------- Vuelos ficticios ---------- */
/* precioBase = precio de referencia en económica, en COP.
   seed se usa para generar asientos ocupados de forma consistente. */
const VUELOS = [
  { id: "TF421", origen: "BOG", destino: "MDE", salida: "08:30", llegada: "09:25", duracionMin: 55, avion: "A320", directo: true, precioBase: 150000, seed: 11 },
  { id: "TF433", origen: "BOG", destino: "MDE", salida: "13:10", llegada: "14:05", duracionMin: 55, avion: "A319", directo: true, precioBase: 150000, seed: 22 },
  { id: "TF447", origen: "BOG", destino: "MDE", salida: "19:45", llegada: "20:40", duracionMin: 55, avion: "B738", directo: true, precioBase: 150000, seed: 33 },
  { id: "TF512", origen: "BOG", destino: "CTG", salida: "07:15", llegada: "08:45", duracionMin: 90, avion: "A320", directo: true, precioBase: 200000, seed: 44 },
  { id: "TF528", origen: "BOG", destino: "CTG", salida: "12:00", llegada: "13:30", duracionMin: 90, avion: "B738", directo: true, precioBase: 200000, seed: 55 },
  { id: "TF561", origen: "BOG", destino: "CTG", salida: "18:20", llegada: "20:35", duracionMin: 135, avion: "A319", directo: false, precioBase: 200000, seed: 66 },
  { id: "TF610", origen: "BOG", destino: "CLO", salida: "06:50", llegada: "07:55", duracionMin: 65, avion: "A320", directo: true, precioBase: 115000, seed: 77 },
  { id: "TF622", origen: "BOG", destino: "CLO", salida: "16:30", llegada: "17:35", duracionMin: 65, avion: "A319", directo: true, precioBase: 115000, seed: 88 },
  { id: "TF701", origen: "BOG", destino: "ADZ", salida: "09:05", llegada: "10:50", duracionMin: 105, avion: "B738", directo: true, precioBase: 200000, seed: 99 },
  { id: "TF715", origen: "BOG", destino: "ADZ", salida: "14:40", llegada: "16:25", duracionMin: 105, avion: "A320", directo: true, precioBase: 200000, seed: 100 },
  { id: "TF340", origen: "MDE", destino: "CTG", salida: "10:15", llegada: "11:20", duracionMin: 65, avion: "A319", directo: true, precioBase: 160000, seed: 111 },
  { id: "TF356", origen: "MDE", destino: "CTG", salida: "17:50", llegada: "19:50", duracionMin: 120, avion: "A320", directo: false, precioBase: 160000, seed: 122 },
  { id: "TF205", origen: "CLO", destino: "BOG", salida: "05:45", llegada: "06:50", duracionMin: 65, avion: "A320", directo: true, precioBase: 195000, seed: 133 },
  { id: "TF219", origen: "CLO", destino: "BOG", salida: "20:10", llegada: "21:15", duracionMin: 65, avion: "B738", directo: true, precioBase: 195000, seed: 144 },
  { id: "TF880", origen: "CTG", destino: "BOG", salida: "11:25", llegada: "12:55", duracionMin: 90, avion: "A320", directo: true, precioBase: 200000, seed: 155 },
  { id: "TF892", origen: "CTG", destino: "BOG", salida: "21:00", llegada: "22:30", duracionMin: 90, avion: "A319", directo: true, precioBase: 200000, seed: 166 },
  { id: "TF102", origen: "BOG", destino: "MIA", salida: "23:55", llegada: "05:10", duracionMin: 255, avion: "A330", directo: true, precioBase: 1289900, seed: 177 },
  { id: "TF108", origen: "BOG", destino: "MIA", salida: "09:20", llegada: "14:35", duracionMin: 255, avion: "A330", directo: true, precioBase: 1349900, seed: 188 },
  { id: "TF900", origen: "BOG", destino: "MAD", salida: "22:10", llegada: "15:40", duracionMin: 570, avion: "A330", directo: true, precioBase: 2189900, seed: 199 },
  { id: "TF902", origen: "BOG", destino: "MAD", salida: "16:05", llegada: "09:30", duracionMin: 565, avion: "A330", directo: false, precioBase: 1949900, seed: 210 },
  {id:"TF110",origen:"BOG",destino:"SMR",salida:"10:00",llegada:"11:25",duracionMin:85,avion:"A320",directo:true,precioBase:210000,seed:301},
  {id:"TF117",origen:"BOG",destino:"JFK",salida:"22:00",llegada:"05:50",duracionMin:350,avion:"A330",directo:true,precioBase:1699900,seed:308},
  {id:"TF119",origen:"BOG",destino:"MEX",salida:"13:00",llegada:"18:10",duracionMin:310,avion:"A330",directo:true,precioBase:1199900,seed:310},
  {id:"TF121",origen:"BOG",destino:"LIM",salida:"12:30",llegada:"15:40",duracionMin:190,avion:"A320",directo:true,precioBase:949900,seed:312},
  {id:"TF122",origen:"BOG",destino:"EZE",salida:"20:00",llegada:"05:30",duracionMin:390,avion:"A330",directo:true,precioBase:1499900,seed:313},
  {id:"TF123",origen:"BOG",destino:"SCL",salida:"21:00",llegada:"05:40",duracionMin:380,avion:"A330",directo:true,precioBase:1399900,seed:314},
  {id:"TF124",origen:"BOG",destino:"YYZ",salida:"23:00",llegada:"06:30",duracionMin:390,avion:"A330",directo:true,precioBase:1799900,seed:315},
  {id:"TF125",origen:"BOG",destino:"CDG",salida:"18:00",llegada:"11:30",duracionMin:650,avion:"A330",directo:true,precioBase:2299900,seed:316},
  {id:"TF126",origen:"BOG",destino:"LHR",salida:"19:00",llegada:"12:00",duracionMin:650,avion:"A330",directo:true,precioBase:2399900,seed:317},
  {id:"TF128",origen:"BOG",destino:"BCN",salida:"18:30",llegada:"11:30",duracionMin:630,avion:"A330",directo:true,precioBase:2249900,seed:319},
  {id:"TF130",origen:"BOG",destino:"LIS",salida:"19:30",llegada:"11:30",duracionMin:640,avion:"A330",directo:true,precioBase:2199900,seed:321},
  {id:"TF201",origen:"MDE",destino:"CLO",salida:"06:20",llegada:"07:25",duracionMin:65,avion:"A319",directo:true,precioBase:169900,seed:401},
  {id:"TF202",origen:"MDE",destino:"CLO",salida:"11:40",llegada:"12:45",duracionMin:65,avion:"A320",directo:true,precioBase:179900,seed:402},
  {id:"TF203",origen:"MDE",destino:"CLO",salida:"16:15",llegada:"17:20",duracionMin:65,avion:"B738",directo:true,precioBase:189900,seed:403},
  {id:"TF204",origen:"MDE",destino:"CLO",salida:"21:05",llegada:"22:10",duracionMin:65,avion:"A319",directo:true,precioBase:164900,seed:404},
  {id:"TF205A",origen:"CLO",destino:"MDE",salida:"07:10",llegada:"08:15",duracionMin:65,avion:"A319",directo:true,precioBase:169900,seed:405},
  {id:"TF206",origen:"CLO",destino:"MDE",salida:"12:35",llegada:"13:40",duracionMin:65,avion:"A320",directo:true,precioBase:179900,seed:406},
  {id:"TF207",origen:"CLO",destino:"MDE",salida:"17:50",llegada:"18:55",duracionMin:65,avion:"B738",directo:true,precioBase:189900,seed:407},
  {id:"TF208",origen:"CLO",destino:"MDE",salida:"22:20",llegada:"23:25",duracionMin:65,avion:"A319",directo:true,precioBase:164900,seed:408},
  {id:"TF209",origen:"MDE",destino:"BOG",salida:"05:50",llegada:"06:45",duracionMin:55,avion:"A320",directo:true,precioBase:150000,seed:409},
  {id:"TF210",origen:"MDE",destino:"BOG",salida:"09:30",llegada:"10:25",duracionMin:55,avion:"A319",directo:true,precioBase:150000,seed:410},
  {id:"TF211",origen:"MDE",destino:"BOG",salida:"14:20",llegada:"15:15",duracionMin:55,avion:"B738",directo:true,precioBase:150000,seed:411},
  {id:"TF212",origen:"MDE",destino:"BOG",salida:"18:40",llegada:"19:35",duracionMin:55,avion:"A320",directo:true,precioBase:150000,seed:412},
  {id:"TF213",origen:"MDE",destino:"BOG",salida:"22:05",llegada:"23:00",duracionMin:55,avion:"A319",directo:true,precioBase:150000,seed:413},
  {id:"TF214",origen:"BOG",destino:"MDE",salida:"06:00",llegada:"06:55",duracionMin:55,avion:"A320",directo:true,precioBase:150000,seed:414},
  {id:"TF215",origen:"BOG",destino:"MDE",salida:"10:15",llegada:"11:10",duracionMin:55,avion:"A319",directo:true,precioBase:150000,seed:415},
  {id:"TF216",origen:"BOG",destino:"MDE",salida:"15:30",llegada:"16:25",duracionMin:55,avion:"B738",directo:true,precioBase:150000,seed:416},
  {id:"TF217",origen:"BOG",destino:"MDE",salida:"21:15",llegada:"22:10",duracionMin:55,avion:"A320",directo:true,precioBase:150000,seed:417},
  {id:"TF218",origen:"CLO",destino:"CTG",salida:"08:00",llegada:"09:25",duracionMin:85,avion:"A320",directo:true,precioBase:230000,seed:418},
  {id:"TF219A",origen:"CLO",destino:"CTG",salida:"14:30",llegada:"15:55",duracionMin:85,avion:"A319",directo:true,precioBase:230000,seed:419},
  {id:"TF220",origen:"CTG",destino:"CLO",salida:"10:15",llegada:"11:40",duracionMin:85,avion:"A320",directo:true,precioBase:220000,seed:420},
  {id:"TF221",origen:"CTG",destino:"CLO",salida:"18:00",llegada:"19:25",duracionMin:85,avion:"A319",directo:true,precioBase:220000,seed:421},
  {id:"TF222",origen:"MDE",destino:"SMR",salida:"07:30",llegada:"08:40",duracionMin:70,avion:"A319",directo:true,precioBase:209900,seed:422},
  {id:"TF223",origen:"MDE",destino:"SMR",salida:"15:20",llegada:"16:30",duracionMin:70,avion:"A320",directo:true,precioBase:219900,seed:423},
  {id:"TF224",origen:"SMR",destino:"MDE",salida:"09:20",llegada:"10:30",duracionMin:70,avion:"A319",directo:true,precioBase:209900,seed:424},
  {id:"TF225",origen:"SMR",destino:"MDE",salida:"17:15",llegada:"18:25",duracionMin:70,avion:"A320",directo:true,precioBase:219900,seed:425},
  {id:"TF226",origen:"BOG",destino:"SMR",salida:"06:30",llegada:"07:55",duracionMin:85,avion:"A320",directo:true,precioBase:210000,seed:426},
  {id:"TF227",origen:"BOG",destino:"SMR",salida:"13:30",llegada:"14:55",duracionMin:85,avion:"A319",directo:true,precioBase:210000,seed:427},
  {id:"TF228",origen:"SMR",destino:"BOG",salida:"09:00",llegada:"10:25",duracionMin:85,avion:"A320",directo:true,precioBase:200000,seed:428},
  {id:"TF229",origen:"SMR",destino:"BOG",salida:"18:30",llegada:"19:55",duracionMin:85,avion:"A319",directo:true,precioBase:200000,seed:429},
  {id:"TF250",origen:"BOG",destino:"MIA",salida:"15:10",llegada:"20:25",duracionMin:255,avion:"A330",directo:true,precioBase:1299900,seed:450},
  {id:"TF251",origen:"MIA",destino:"BOG",salida:"08:00",llegada:"13:15",duracionMin:255,avion:"A330",directo:true,precioBase:1299900,seed:451},
  {id:"TF252",origen:"MIA",destino:"BOG",salida:"18:30",llegada:"23:45",duracionMin:255,avion:"A330",directo:true,precioBase:1399900,seed:452},
  {id:"TF253",origen:"BOG",destino:"MAD",salida:"11:45",llegada:"05:15",duracionMin:570,avion:"A330",directo:true,precioBase:2249900,seed:453},
  {id:"TF254",origen:"MAD",destino:"BOG",salida:"13:20",llegada:"18:05",duracionMin:570,avion:"A330",directo:true,precioBase:2249900,seed:454},
  {id:"TF255",origen:"BOG",destino:"JFK",salida:"08:10",llegada:"16:00",duracionMin:350,avion:"A330",directo:true,precioBase:1649900,seed:455},
  {id:"TF256",origen:"JFK",destino:"BOG",salida:"19:30",llegada:"04:20",duracionMin:350,avion:"A330",directo:true,precioBase:1649900,seed:456},
  {id:"TF257",origen:"BOG",destino:"MEX",salida:"07:20",llegada:"12:30",duracionMin:310,avion:"A330",directo:true,precioBase:1149900,seed:457},
  {id:"TF258",origen:"MEX",destino:"BOG",salida:"14:20",llegada:"19:30",duracionMin:310,avion:"A330",directo:true,precioBase:1149900,seed:458},
  {id:"TF259",origen:"BOG",destino:"LIM",salida:"18:20",llegada:"21:30",duracionMin:190,avion:"A320",directo:true,precioBase:929900,seed:459},
  {id:"TF260",origen:"LIM",destino:"BOG",salida:"07:30",llegada:"10:40",duracionMin:190,avion:"A320",directo:true,precioBase:929900,seed:460},
  {id:"TF261",origen:"BOG",destino:"CDG",salida:"09:50",llegada:"03:20",duracionMin:650,avion:"A330",directo:true,precioBase:2249900,seed:461},
  {id:"TF262",origen:"CDG",destino:"BOG",salida:"14:00",llegada:"18:30",duracionMin:650,avion:"A330",directo:true,precioBase:2249900,seed:462},
  {id:"TF600",origen:"BOG",destino:"IBE",salida:"09:00",llegada:"10:00",duracionMin:60,avion:"A319",directo:true,precioBase:100000,seed:3000},
  {id:"TF601",origen:"IBE",destino:"BOG",salida:"10:00",llegada:"09:00",duracionMin:60,avion:"A319",directo:true,precioBase:110000,seed:3001},
  {id:"TF602",origen:"ADZ",destino:"BOG",salida:"10:50",llegada:"09:05",duracionMin:105,avion:"B738",directo:true,precioBase:200000,seed:3002},
  {id:"TF603",origen:"CTG",destino:"MDE",salida:"10:15",llegada:"11:20",duracionMin:65,avion:"A319",directo:true,precioBase:170000,seed:3003},
  {id:"TF604",origen:"CTG",destino:"SMR",salida:"14:00",llegada:"14:45",duracionMin:45,avion:"A319",directo:true,precioBase:150000,seed:3004},
  {id:"TF605",origen:"SMR",destino:"CTG",salida:"14:45",llegada:"14:00",duracionMin:45,avion:"A319",directo:true,precioBase:140000,seed:3005},
  {id:"TF606",origen:"CTG",destino:"IBE",salida:"15:00",llegada:"16:30",duracionMin:90,avion:"A319",directo:true,precioBase:180000,seed:3006},
  {id:"TF607",origen:"IBE",destino:"CTG",salida:"16:30",llegada:"15:00",duracionMin:90,avion:"A319",directo:true,precioBase:150000,seed:3007}

  ,{id:"TF620",origen:"BOG",destino:"GRU",salida:"21:30",llegada:"05:30",duracionMin:360,avion:"A330",directo:true,precioBase:1399900,seed:3620}
  ,{id:"TF621",origen:"GRU",destino:"BOG",salida:"09:00",llegada:"13:00",duracionMin:360,avion:"A330",directo:true,precioBase:1399900,seed:3621}
];

/* ---------- Utilidades ---------- */

function buscarAeropuerto(codigo) {
  return AEROPUERTOS.find(a => a.codigo === codigo);
}

function formatearMoneda(valor) {
  return "$" + Math.round(valor).toLocaleString("es-CO") + " COP";
}

function formatearDuracion(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} h ${m > 0 ? m + " min" : ""}`.trim() : `${m} min`;
}

/* Devuelve los vuelos que cubren una ruta origen-destino en una clase dada,
   con el precio ya calculado para esa clase. */
function buscarVuelos(origen, destino, clase) {
  const mult = MULTIPLICADOR_CLASE[clase] || 1;
  return VUELOS
    .filter(v => v.origen === origen && v.destino === destino)
    .map(v => ({
      ...v,
      claseSolicitada: clase,
      precio: Math.round((v.precioBase * mult) / 100) * 100
    }));
}

function obtenerVueloPorId(id) {
  return VUELOS.find(v => v.id === id);
}

/* Genera el mapa de asientos completo de un vuelo: cada asiento con su
   estado (disponible / ocupado / premium) y precio adicional si aplica. */
function generarMapaAsientos(vuelo) {
  const avion = AVIONES[vuelo.avion];
  const columnas = avion.config;
  const totalAsientos = avion.filas * columnas.length;
  const cantidadOcupados = Math.round(totalAsientos * 0.32);
  const ocupados = new Set(generarOcupados(vuelo.seed, avion.filas, columnas, cantidadOcupados));

  const filas = [];
  for (let f = 1; f <= avion.filas; f++) {
    const esPremium = f <= avion.premiumHasta;
    const asientos = columnas.map(col => {
      const codigo = `${f}${col}`;
      return {
        codigo,
        fila: f,
        columna: col,
        ocupado: ocupados.has(codigo),
        premium: esPremium,
        precioExtra: esPremium ? 45000 : 0
      };
    });
    filas.push({ numero: f, esPremium, asientos, salida: f === avion.premiumHasta + 1 });
  }
  return { avion, filas, columnas };
}