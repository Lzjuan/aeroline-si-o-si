
const PRECIOS_IDA_VUELTA = {
  "BOG-CTG": 400000, "BOG-MDE": 300000, "BOG-CLO": 310000,
  "BOG-SMR": 410000, "BOG-IBE": 210000, "BOG-ADZ": 400000,
  "CTG-MDE": 330000, "CTG-CLO": 450000, "CTG-SMR": 290000, "CTG-IBE": 330000
};
function precioRutaIdaVuelta(origen, destino, precioIda) {
  const clave = `${origen}-${destino}`;
  const inversa = `${destino}-${origen}`;
  return PRECIOS_IDA_VUELTA[clave] ?? PRECIOS_IDA_VUELTA[inversa] ?? precioIda * 2;
}

/* ==========================================================================
   DESIRE AIRWAYS — script.js
   Lógica de interfaz para todas las páginas. Se apoya en vuelos.js (datos)
   y reservas.js (persistencia en localStorage).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initToasts();

  if (document.getElementById("search-form")) initHomeSearch();
  if (document.getElementById("destinos-grid")) initDestinosOfertas();
  if (document.getElementById("testimonial-carousel")) initTestimonialCarousel();
  if (document.getElementById("flight-list")) initResultados();
  if (document.getElementById("vuelo-detalle-layout")) initDetalleVuelo();
  if (document.getElementById("seat-map")) initAsientos();
  if (document.getElementById("hero-plane")) initHeaderScrollShadow();
});

/* ==========================================================================
   TOASTS (mensajes de éxito / error flotantes)
   ========================================================================== */
function mostrarToast(mensaje, tipo = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast is-${tipo}`;
  toast.textContent = mensaje;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}
function initToasts() {}

/* ==========================================================================
   MENÚ MÓVIL
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const loginMobile = document.getElementById("login-btn-mobile");
  const loginDesktop = document.getElementById("login-btn");
  [loginMobile, loginDesktop].forEach(btn => {
    if (btn) btn.addEventListener("click", () => mostrarToast("El inicio de sesión es una demostración simulada.", "info"));
  });

  const joinBtn = document.getElementById("join-program-btn");
  if (joinBtn) joinBtn.addEventListener("click", () => mostrarToast("Te has unido al programa de viajeros (simulado).", "success"));
}

function initHeaderScrollShadow() {
  // Reservado para futuros efectos de scroll en el header.
}

/* ==========================================================================
   BUSCADOR DE VUELOS (index.html)
   ========================================================================== */
function initHomeSearch() {
  const form = document.getElementById("search-form");
  const tripTabs = document.querySelectorAll(".trip-tab");
  const returnField = document.getElementById("return-field");
  const multiCity = document.getElementById("multi-city");
  const multiCityList = document.getElementById("multi-city-list");
  const addCityBtn = document.getElementById("add-city-btn");

  let tripType = "roundtrip";

  // Poblar datalist de aeropuertos
  const datalist = document.getElementById("airport-list");
  if (datalist) {
    AEROPUERTOS.forEach(a => {
      const opt = document.createElement("option");
      opt.value = `${a.ciudad} (${a.codigo})`;
      datalist.appendChild(opt);
    });
  }

  // Fecha mínima = hoy
  const today = new Date().toISOString().split("T")[0];
  const departInput = document.getElementById("depart-date");
  const returnInput = document.getElementById("return-date");
  if (departInput) departInput.min = today;
  if (returnInput) returnInput.min = today;

  // ---- Tabs de tipo de viaje ----
  tripTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tripTabs.forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      tripType = tab.dataset.trip;

      if (tripType === "roundtrip") {
        returnField.style.display = "";
        multiCity.hidden = true;
        returnInput.required = true;
      } else if (tripType === "oneway") {
        returnField.style.display = "none";
        multiCity.hidden = true;
        returnInput.required = false;
        returnInput.value = "";
      } else {
        returnField.style.display = "none";
        multiCity.hidden = false;
        returnInput.required = false;
        returnInput.value = "";
        if (multiCityList.children.length === 0) agregarFilaMultidestino();
      }
    });
  });

  // ---- Multidestino ----
  function agregarFilaMultidestino() {
    const row = document.createElement("div");
    row.className = "multi-city-row";
    row.innerHTML = `
      <div class="field">
        <label>Origen</label>
        <input type="text" class="mc-origin" list="airport-list" placeholder="Ciudad o aeropuerto" autocomplete="off">
      </div>
      <div class="field">
        <label>Destino</label>
        <input type="text" class="mc-destination" list="airport-list" placeholder="Ciudad o aeropuerto" autocomplete="off">
      </div>
      <div class="field">
        <label>Fecha</label>
        <input type="date" class="mc-date" min="${today}">
      </div>
      <button type="button" class="multi-city-remove" aria-label="Eliminar vuelo">✕</button>
    `;
    row.querySelector(".multi-city-remove").addEventListener("click", () => row.remove());
    multiCityList.appendChild(row);
  }
  if (addCityBtn) addCityBtn.addEventListener("click", agregarFilaMultidestino);

  // ---- Intercambiar origen/destino ----
  const swapBtn = document.getElementById("swap-btn");
  const originInput = document.getElementById("origin");
  const destinationInput = document.getElementById("destination");
  const destinoRapido = localStorage.getItem("da_destino_rapido");
  if (destinoRapido && destinationInput) { destinationInput.value = `${buscarAeropuerto(destinoRapido)?.ciudad || destinoRapido} (${destinoRapido})`; localStorage.removeItem("da_destino_rapido"); }
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const tmp = originInput.value;
      originInput.value = destinationInput.value;
      destinationInput.value = tmp;
    });
  }

  // ---- Panel de pasajeros y clase ----
  const passengersToggle = document.getElementById("passengers-toggle");
  const passengersPanel = document.getElementById("passengers-panel");
  const passengersSummary = document.getElementById("passengers-summary");
  const passengersDone = document.getElementById("passengers-done");

  const counts = { adults: 1, children: 0, infants: 0 };
  const limits = { adults: [1, 9], children: [0, 8], infants: [0, counts.adults] };
  let claseActual = "economica";

  function actualizarSteppers() {
    document.getElementById("adults-value").textContent = counts.adults;
    document.getElementById("children-value").textContent = counts.children;
    document.getElementById("infants-value").textContent = counts.infants;
    document.getElementById("adults").value = counts.adults;
    document.getElementById("children").value = counts.children;
    document.getElementById("infants").value = counts.infants;

    document.querySelectorAll('[data-counter="adults"] [data-action="decrement"]').forEach(b => b.disabled = counts.adults <= limits.adults[0]);
    document.querySelectorAll('[data-counter="adults"] [data-action="increment"]').forEach(b => b.disabled = counts.adults >= limits.adults[1]);
    document.querySelectorAll('[data-counter="children"] [data-action="decrement"]').forEach(b => b.disabled = counts.children <= limits.children[0]);
    document.querySelectorAll('[data-counter="children"] [data-action="increment"]').forEach(b => b.disabled = counts.children >= limits.children[1]);
    document.querySelectorAll('[data-counter="infants"] [data-action="decrement"]').forEach(b => b.disabled = counts.infants <= limits.infants[0]);
    document.querySelectorAll('[data-counter="infants"] [data-action="increment"]').forEach(b => b.disabled = counts.infants >= counts.adults);
  }

  document.querySelectorAll(".stepper-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.closest("[data-counter]").dataset.counter;
      const action = btn.dataset.action;
      if (action === "increment") counts[key]++;
      else counts[key] = Math.max(key === "adults" ? 1 : 0, counts[key] - 1);
      if (key === "adults" && counts.infants > counts.adults) counts.infants = counts.adults;
      actualizarSteppers();
      actualizarResumenPasajeros();
    });
  });

  document.querySelectorAll(".class-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".class-chip").forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      claseActual = chip.dataset.class;
      document.getElementById("travel-class").value = claseActual;
      actualizarResumenPasajeros();
    });
  });

  function actualizarResumenPasajeros() {
    const total = counts.adults + counts.children + counts.infants;
    const texto = `${total} pasajero${total !== 1 ? "s" : ""} · ${NOMBRE_CLASE[claseActual]}`;
    passengersSummary.textContent = texto;
  }

  if (passengersToggle) {
    passengersToggle.addEventListener("click", () => {
      const isHidden = passengersPanel.hidden;
      passengersPanel.hidden = !isHidden;
      passengersToggle.setAttribute("aria-expanded", String(isHidden));
    });
  }
  if (passengersDone) {
    passengersDone.addEventListener("click", () => {
      passengersPanel.hidden = true;
      passengersToggle.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("click", (e) => {
    if (passengersPanel && !passengersPanel.hidden && !passengersPanel.contains(e.target) && !passengersToggle.contains(e.target)) {
      passengersPanel.hidden = true;
      passengersToggle.setAttribute("aria-expanded", "false");
    }
  });

  actualizarSteppers();
  actualizarResumenPasajeros();

  /* Extrae el código IATA de un texto tipo "Bogotá (BOG)" */
  function extraerCodigo(texto) {
    const match = texto.match(/\(([A-Z]{3})\)/);
    if (match) return match[1];
    const porNombre = AEROPUERTOS.find(a => a.ciudad.toLowerCase() === texto.trim().toLowerCase());
    return porNombre ? porNombre.codigo : texto.trim().toUpperCase();
  }

  // ---- Validación y envío ----
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErrores(form);

    let valido = true;
    const origenTexto = originInput.value.trim();
    const destinoTexto = destinationInput.value.trim();
    const origenCod = extraerCodigo(origenTexto);
    const destinoCod = extraerCodigo(destinoTexto);

    if (!origenTexto) { marcarError("origin", "Ingresa una ciudad de origen."); valido = false; }
    if (!destinoTexto) { marcarError("destination", "Ingresa una ciudad de destino."); valido = false; }
    if (origenTexto && destinoTexto && origenCod === destinoCod) {
      marcarError("destination", "El destino no puede ser igual al origen.");
      valido = false;
    }
    if (!departInput.value) { marcarError("depart-date", "Selecciona una fecha de ida."); valido = false; }
    if (tripType === "roundtrip") {
      if (!returnInput.value) { marcarError("return-date", "Selecciona una fecha de regreso."); valido = false; }
      else if (returnInput.value < departInput.value) { marcarError("return-date", "No puede ser anterior a la fecha de ida."); valido = false; }
    }
    if (counts.adults < 1) { document.getElementById("form-error").textContent = "Debe haber al menos un adulto."; valido = false; }

    if (!valido) {
      document.getElementById("form-error").textContent = document.getElementById("form-error").textContent || "Revisa los campos marcados en rojo.";
      return;
    }
    document.getElementById("form-error").textContent = "";

    const busqueda = {
      tipoViaje: tripType,
      origen: origenCod,
      destino: destinoCod,
      origenTexto, destinoTexto,
      fechaIda: departInput.value,
      fechaRegreso: tripType === "roundtrip" ? returnInput.value : null,
      adultos: counts.adults,
      ninos: counts.children,
      bebes: counts.infants,
      clase: claseActual
    };
    guardarEstado(RESERVAS_KEYS.busqueda, busqueda);
    [RESERVAS_KEYS.vuelo, RESERVAS_KEYS.asiento, RESERVAS_KEYS.pasajeros, RESERVAS_KEYS.extras, RESERVAS_KEYS.reserva].forEach(limpiarEstado);
    window.location.href = "resultados.html";
  });

  function marcarError(campoId, mensaje) {
    const field = document.getElementById(campoId).closest(".field");
    const errorEl = document.getElementById(campoId + "-error");
    if (field) field.classList.add("has-error");
    if (errorEl) errorEl.textContent = mensaje;
  }
  function limpiarErrores(scope) {
    scope.querySelectorAll(".field").forEach(f => f.classList.remove("has-error"));
    scope.querySelectorAll(".field-error").forEach(e => e.textContent = "");
    const formError = document.getElementById("form-error");
    if (formError) formError.textContent = "";
  }
}

/* ==========================================================================
   DESTINOS Y OFERTAS (index.html)
   ========================================================================== */
function imagenDestinoGlobal(codigo) {
  // FOTOS DE TARJETAS DESTACADAS (index.html): coloca tus fotos en assets/ con estos nombres.
  // Medellín: dest-mde.jpg | Cali: dest-clo.jpg | Santa Marta: dest-smr.jpg
  // Bucaramanga: dest-bga.jpg | Cancún: dest-cun.jpg | Madrid: dest-mad.jpg
  // Londres: dest-lhr.jpg | Barcelona: dest-bcn.jpg | Lisboa: dest-lis.jpg
  // Bangkok: dest-bkk.jpg | Sídney: dest-syd.jpg | Melbourne: dest-mel.jpg
  const imagenes = {"BOG": "dest-bogota.png", "MDE": "dest-mde.jpg", "CTG": "dest-cartagena.webp", "CLO": "dest-clo.jpg", "ADZ": "dest-san-andres.jpg", "SMR": "dest-smr.jpg", "IBE": "dest-armenia.webp", "GRU": "dest-buenos-aires.jpg", "BAQ": "dest-barranquilla.webp", "PEI": "dest-pereira.jpg", "BGA": "dest-bga.jpg", "AXM": "dest-armenia.webp", "MZL": "dest-manizales.webp", "MIA": "dest-miami.jpg", "JFK": "dest-new-york.webp", "MCO": "dest-orlando.jpg", "MEX": "dest-mexico-city.jpg", "CUN": "dest-cun.jpg", "LIM": "dest-lima.jpg", "EZE": "dest-buenos-aires.jpg", "SCL": "dest-santiago.jpg", "YYZ": "dest-toronto.jpg", "MAD": "dest-mad.jpg", "CDG": "dest-paris.jpg", "LHR": "dest-lhr.jpg", "FCO": "dest-rome.jpg", "BCN": "dest-bcn.jpg", "AMS": "dest-amsterdam.jpg", "LIS": "dest-lis.jpg", "NRT": "dest-tokyo.jpg", "ICN": "dest-seoul.jpg", "BKK": "dest-bkk.jpg", "SIN": "dest-singapore.png", "DXB": "dest-dubai.jpg", "SYD": "dest-syd.jpg", "MEL": "dest-mel.jpg", "AKL": "dest-auckland.jpg"};
  return imagenes[codigo] ? `assets/${imagenes[codigo]}` : "assets/aircraft-flight.svg";
}

function imagenDestino(codigo) { return imagenDestinoGlobal(codigo); }

function initDestinosOfertas() {
  const destinosGrid = document.getElementById("destinos-grid");
  const ofertasGrid = document.getElementById("ofertas-grid");

  const rutasDestacadas = [
    { origen: "BOG", destino: "MDE" },
    { origen: "BOG", destino: "CTG" },
    { origen: "BOG", destino: "CLO" },
    { origen: "BOG", destino: "ADZ" },
    { origen: "BOG", destino: "MIA" },
    { origen: "BOG", destino: "MAD" }
  ];

  rutasDestacadas.forEach(r => {
    const vuelos = buscarVuelos(r.origen, r.destino, "economica");
    if (!vuelos.length) return;
    const masBarato = vuelos.reduce((a, b) => a.precio < b.precio ? a : b);
    const oAero = buscarAeropuerto(r.origen);
    const dAero = buscarAeropuerto(r.destino);

    const card = document.createElement("article");
    card.className = "destino-card";
    card.innerHTML = `
      <div class="destino-card-media destino-card-media-image">
        <img src="${imagenDestino(r.destino)}" alt="${dAero.ciudad}" loading="lazy" onerror="this.onerror=null;this.style.display='none';">
        <span>${oAero.ciudad} → ${dAero.ciudad}</span>
      </div>
      <div class="destino-card-body">
        <span class="destino-route">${r.origen} — ${r.destino}</span>
        <span class="destino-price">${formatearMoneda(masBarato.precio)} <span>ida, por persona</span></span>
      </div>
    `;
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      originQuickSearch(r.origen, r.destino);
    });
    destinosGrid.appendChild(card);
  });

  const ofertas = [...VUELOS]
    .sort((a, b) => a.precioBase - b.precioBase)
    .slice(0, 6);

  ofertas.forEach(v => {
    const oAero = buscarAeropuerto(v.origen);
    const dAero = buscarAeropuerto(v.destino);
    const card = document.createElement("article");
    card.className = "oferta-card";
    card.innerHTML = `
      <span class="oferta-badge">Tarifa especial</span>
      <strong>${oAero.ciudad} → ${dAero.ciudad}</strong>
      <span class="destino-route">Vuelo ${v.id} · ${v.directo ? "Directo" : "Con escala"}</span>
      <span class="destino-price">${formatearMoneda(v.precioBase)} <span>económica</span></span>
    `;
    card.style.cursor = "pointer";
    card.addEventListener("click", () => originQuickSearch(v.origen, v.destino));
    ofertasGrid.appendChild(card);
  });

  function originQuickSearch(origen, destino) {
    const today = new Date();
    today.setDate(today.getDate() + 14);
    const fecha = today.toISOString().split("T")[0];
    guardarEstado(RESERVAS_KEYS.busqueda, {
      tipoViaje: "oneway",
      origen, destino,
      origenTexto: buscarAeropuerto(origen).ciudad,
      destinoTexto: buscarAeropuerto(destino).ciudad,
      fechaIda: fecha,
      fechaRegreso: null,
      adultos: 1, ninos: 0, bebes: 0,
      clase: "economica"
    });
    window.location.href = "resultados.html";
  }
}

/* ==========================================================================
   CARRUSEL DE OPINIONES (index.html)
   ========================================================================== */
function initTestimonialCarousel() {
  const track = document.getElementById("carousel-track");
  const viewport = document.getElementById("carousel-viewport");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");
  const cards = Array.from(track.children);

  function cardsPerView() {
    const w = window.innerWidth;
    if (w >= 1080) return 3;
    if (w >= 760) return 2;
    return 1;
  }

  let index = 0;
  let perView = cardsPerView();
  let maxIndex = Math.max(0, cards.length - perView);
  let autoplayTimer = null;

  function buildDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === index ? " is-active" : "");
      dot.setAttribute("aria-label", `Ir a la opinión ${i + 1}`);
      dot.addEventListener("click", () => { goTo(i); resetAutoplay(); });
      dotsContainer.appendChild(dot);
    }
  }

  function update() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
    Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, maxIndex));
    update();
  }

  function next() { goTo(index >= maxIndex ? 0 : index + 1); }
  function prev() { goTo(index <= 0 ? maxIndex : index - 1); }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 5500);
  }

  prevBtn.addEventListener("click", () => { prev(); resetAutoplay(); });
  nextBtn.addEventListener("click", () => { next(); resetAutoplay(); });

  window.addEventListener("resize", () => {
    perView = cardsPerView();
    maxIndex = Math.max(0, cards.length - perView);
    index = Math.min(index, maxIndex);
    buildDots();
    update();
  });

  buildDots();
  update();
  resetAutoplay();
}

/* ==========================================================================
   RESULTADOS DE BÚSQUEDA (resultados.html)
   ========================================================================== */
function initResultados() {
  const busqueda = leerEstado(RESERVAS_KEYS.busqueda);
  const summaryEl = document.getElementById("results-summary");
  const listEl = document.getElementById("flight-list");
  const emptyEl = document.getElementById("empty-state");
  const countEl = document.getElementById("results-count");

  if (!busqueda) {
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    emptyEl.querySelector("h3").textContent = "No hay ninguna búsqueda activa";
    emptyEl.querySelector("p").textContent = "Realiza una búsqueda desde la página principal.";
    countEl.textContent = "";
    summaryEl.innerHTML = "";
    return;
  }

  const oAero = buscarAeropuerto(busqueda.origen) || { ciudad: busqueda.origenTexto };
  const dAero = buscarAeropuerto(busqueda.destino) || { ciudad: busqueda.destinoTexto };
  const totalPax = busqueda.adultos + busqueda.ninos + busqueda.bebes;
  const fechaFmt = new Date(busqueda.fechaIda + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  summaryEl.innerHTML = `
    <span class="rs-route">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M14 5l7 7-7 7"/></svg>
      ${oAero.ciudad} (${busqueda.origen}) → ${dAero.ciudad} (${busqueda.destino})
    </span>
    <span class="rs-detail">${fechaFmt}</span>
    <span class="rs-detail">${totalPax} pasajero${totalPax !== 1 ? "s" : ""}</span>
    <span class="rs-detail">${NOMBRE_CLASE[busqueda.clase] || "Económica"}</span>
  `;

  let vuelos = buscarVuelos(busqueda.origen, busqueda.destino, busqueda.clase);
  if (busqueda.tipoViaje === "roundtrip") {
    const multIdaVuelta = MULTIPLICADOR_CLASE[busqueda.clase] || 1;
    vuelos = vuelos.map(v => ({ ...v, precio: Math.round((precioRutaIdaVuelta(v.origen, v.destino, v.precioBase) * multIdaVuelta) / 100) * 100 }));
  }

  if (!vuelos.length) {
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    countEl.textContent = "0 vuelos encontrados";
    document.getElementById("filters-panel").style.display = "none";
    return;
  }

  // ---- Configurar filtros con base en el rango real de precios/duración ----
  const precios = vuelos.map(v => v.precio);
  const duraciones = vuelos.map(v => v.duracionMin);
  const priceInput = document.getElementById("filter-price");
  const priceValue = document.getElementById("filter-price-value");
  const durationInput = document.getElementById("filter-duration");
  const durationValue = document.getElementById("filter-duration-value");

  const minPrecio = Math.min(...precios), maxPrecio = Math.max(...precios);
  const minDur = Math.min(...duraciones), maxDur = Math.max(...duraciones);
  priceInput.min = minPrecio; priceInput.max = maxPrecio; priceInput.value = maxPrecio;
  durationInput.min = minDur; durationInput.max = maxDur; durationInput.value = maxDur;
  priceValue.textContent = "Hasta " + formatearMoneda(maxPrecio);
  durationValue.textContent = "Hasta " + formatearDuracion(maxDur);
  document.querySelector(".filter-range-labels span:first-child").textContent = "Desde " + formatearMoneda(minPrecio);

  const filtros = { horaBandas: new Set(), escalas: new Set() };

  function bandaHora(horaStr) {
    const h = parseInt(horaStr.split(":")[0], 10);
    if (h < 6) return "madrugada";
    if (h < 12) return "manana";
    if (h < 18) return "tarde";
    return "noche";
  }

  function aplicarFiltrosYOrden() {
    let resultado = vuelos.filter(v => {
      if (v.precio > Number(priceInput.value)) return false;
      if (v.duracionMin > Number(durationInput.value)) return false;
      if (filtros.horaBandas.size && !filtros.horaBandas.has(bandaHora(v.salida))) return false;
      if (filtros.escalas.size) {
        const tipo = v.directo ? "directo" : "escala";
        if (!filtros.escalas.has(tipo)) return false;
      }
      return true;
    });

    const orden = document.getElementById("sort-select").value;
    if (orden === "barato") resultado.sort((a, b) => a.precio - b.precio);
    else if (orden === "rapido") resultado.sort((a, b) => a.duracionMin - b.duracionMin);
    else if (orden === "salida") resultado.sort((a, b) => a.salida.localeCompare(b.salida));
    else resultado.sort((a, b) => (a.duracionMin + a.precio / 5000) - (b.duracionMin + b.precio / 5000));

    renderizarVuelos(resultado);
  }

  function renderizarVuelos(lista) {
    countEl.textContent = `${lista.length} vuelo${lista.length !== 1 ? "s" : ""} encontrado${lista.length !== 1 ? "s" : ""}`;
    if (!lista.length) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.querySelector("h3").textContent = "Ningún vuelo coincide con tus filtros";
      emptyEl.querySelector("p").textContent = "Intenta ajustar el precio, el horario o las escalas.";
      return;
    }
    emptyEl.hidden = true;
    listEl.innerHTML = lista.map(v => tarjetaVuelo(v)).join("");
    listEl.querySelectorAll("[data-select-flight]").forEach(btn => {
      btn.addEventListener("click", () => seleccionarVuelo(btn.dataset.selectFlight, busqueda));
    });
  }

  function imagenDestino(ciudadOCodigo) {
    // Acepta tanto el código IATA (CTG) como el nombre de ciudad (Cartagena).
    const valor = String(ciudadOCodigo || "").trim();
    const normalizar = texto => String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    const aeropuerto = (typeof buscarAeropuerto === "function" ? buscarAeropuerto(valor) : null)
      || AEROPUERTOS.find(a => normalizar(a.codigo) === normalizar(valor) || normalizar(a.ciudad) === normalizar(valor));
    const codigo = aeropuerto ? aeropuerto.codigo : valor.toUpperCase();
    const ruta = window.imagenDestinoGlobal(codigo);
    return ruta && ruta !== "assets/aircraft-flight.svg" ? ruta : "";
  }

  function tarjetaVuelo(v) {
    const oA = buscarAeropuerto(v.origen), dA = buscarAeropuerto(v.destino);
    const destinoImagen = imagenDestino(v.destino);
    return `
      <article class="flight-card">
        <div class="flight-image-wrap">
          <img class="flight-image" src="${destinoImagen}" alt="${dA.ciudad}, destino de Desire Airways" loading="lazy" onerror="this.onerror=null;this.style.display='none';">
          <span class="flight-image-badge">Acumula millas</span>
        </div>
        <div class="flight-route-block">
          <div>
            <span class="flight-code">${v.id} · ${AVIONES[v.avion].modelo}</span>
            <div class="flight-times">
              <div>
                <span class="flight-time">${v.salida}</span>
                <span class="flight-time-airport">${v.origen}</span>
              </div>
              <div class="flight-path">
                <span class="flight-duration">${formatearDuracion(v.duracionMin)}</span>
                <div class="flight-path-line"></div>
                <span class="flight-stops">${v.directo ? "Directo" : "1 escala"}</span>
              </div>
              <div>
                <span class="flight-time">${v.llegada}</span>
                <span class="flight-time-airport">${v.destino}</span>
              </div>
            </div>
            <div class="flight-meta">
              <span>${oA.ciudad} → ${dA.ciudad}</span>
              <span>${NOMBRE_CLASE[v.claseSolicitada]}</span>
            </div>
          </div>
        </div>
        <div class="flight-price-block">
          <span class="flight-price-label">Desde</span>
          <span class="flight-price-value">${formatearMoneda(v.precio)}</span>
          <span class="flight-price-class">${NOMBRE_CLASE[v.claseSolicitada]}</span>
        </div>
        <div>
          <button type="button" class="btn btn-primary" data-select-flight="${v.id}">Seleccionar vuelo</button>
        </div>
      </article>
    `;
  }

  function seleccionarVuelo(idVuelo, busquedaActual) {
    const vueloOriginal = obtenerVueloPorId(idVuelo);
    const mult = MULTIPLICADOR_CLASE[busquedaActual.clase] || 1;
    const vueloSeleccionado = {
      ...vueloOriginal,
      claseSolicitada: busquedaActual.clase,
      precio: Math.round(((busquedaActual.tipoViaje === "roundtrip" ? precioRutaIdaVuelta(vueloOriginal.origen, vueloOriginal.destino, vueloOriginal.precioBase) : vueloOriginal.precioBase) * mult) / 100) * 100,
      totalPasajeros: busquedaActual.adultos + busquedaActual.ninos + busquedaActual.bebes,
      totalAsientos: busquedaActual.adultos + busquedaActual.ninos
    };
    guardarEstado(RESERVAS_KEYS.vuelo, vueloSeleccionado);
    limpiarEstado(RESERVAS_KEYS.asiento);
    window.location.href = "vuelo.html";
  }

  // ---- Listeners de filtros ----
  priceInput.addEventListener("input", () => { priceValue.textContent = "Hasta " + formatearMoneda(priceInput.value); aplicarFiltrosYOrden(); });
  durationInput.addEventListener("input", () => { durationValue.textContent = "Hasta " + formatearDuracion(durationInput.value); aplicarFiltrosYOrden(); });
  document.getElementById("sort-select").addEventListener("change", aplicarFiltrosYOrden);

  document.querySelectorAll("#filter-hora .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-active");
      const val = chip.dataset.hora;
      filtros.horaBandas.has(val) ? filtros.horaBandas.delete(val) : filtros.horaBandas.add(val);
      aplicarFiltrosYOrden();
    });
  });
  document.querySelectorAll("#filter-escalas .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-active");
      const val = chip.dataset.escalas;
      filtros.escalas.has(val) ? filtros.escalas.delete(val) : filtros.escalas.add(val);
      aplicarFiltrosYOrden();
    });
  });
  document.getElementById("filters-reset").addEventListener("click", () => {
    filtros.horaBandas.clear();
    filtros.escalas.clear();
    document.querySelectorAll(".chip.is-active").forEach(c => c.classList.remove("is-active"));
    priceInput.value = maxPrecio;
    durationInput.value = maxDur;
    priceValue.textContent = "Hasta " + formatearMoneda(maxPrecio);
    durationValue.textContent = "Hasta " + formatearDuracion(maxDur);
    document.getElementById("sort-select").value = "recomendado";
    aplicarFiltrosYOrden();
  });

  aplicarFiltrosYOrden();
}

/* ==========================================================================
   DETALLE DEL VUELO (vuelo.html)
   ========================================================================== */
function initDetalleVuelo() {
  const layout = document.getElementById("vuelo-detalle-layout");
  const vuelo = leerEstado(RESERVAS_KEYS.vuelo);
  const busqueda = leerEstado(RESERVAS_KEYS.busqueda);

  if (!vuelo) {
    layout.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No hay ningún vuelo seleccionado</h3>
        <p>Vuelve a los resultados para elegir un vuelo.</p>
        <a href="index.html#buscador" class="btn btn-primary">Buscar vuelos</a>
      </div>`;
    return;
  }

  const oA = buscarAeropuerto(vuelo.origen), dA = buscarAeropuerto(vuelo.destino);
  const fechaFmt = busqueda ? new Date(busqueda.fechaIda + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : "";
  const equipaje = vuelo.claseSolicitada === "economica" ? "1 maleta de mano (10 kg)" : "1 maleta de mano + 1 facturada (23 kg)";

  layout.innerHTML = `
    <div class="flight-detail-card">
      <div class="flight-detail-image-wrap"><img class="flight-detail-image" src="${imagenDestino(vuelo.destino)}" alt="${dA.ciudad}" loading="eager"></div>
      <div class="flight-detail-header">
        <div class="flight-detail-route">
          <div class="flight-detail-city"><strong>${vuelo.origen}</strong><span>${oA.ciudad}</span></div>
          <div class="flight-detail-plane">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h15M13 6l6 6-6 6"/></svg>
          </div>
          <div class="flight-detail-city"><strong>${vuelo.destino}</strong><span>${dA.ciudad}</span></div>
        </div>
        <span class="flight-detail-code">Vuelo ${vuelo.id} · ${AVIONES[vuelo.avion].modelo}</span>
      </div>

      <div class="flight-detail-grid">
        <div class="detail-item"><span>Fecha</span><strong>${fechaFmt || "—"}</strong></div>
        <div class="detail-item"><span>Salida</span><strong>${vuelo.salida}</strong></div>
        <div class="detail-item"><span>Llegada</span><strong>${vuelo.llegada}</strong></div>
        <div class="detail-item"><span>Duración</span><strong>${formatearDuracion(vuelo.duracionMin)}</strong></div>
        <div class="detail-item"><span>Tipo</span><strong>${vuelo.directo ? "Directo" : "Con escala"}</strong></div>
        <div class="detail-item"><span>Clase</span><strong>${NOMBRE_CLASE[vuelo.claseSolicitada]}</strong></div>
        <div class="detail-item"><span>Equipaje incluido</span><strong>${equipaje}</strong></div>
        <div class="detail-item"><span>Precio</span><strong>${formatearMoneda(vuelo.precio)}</strong></div>
      </div>
    </div>

    <aside class="flow-sidebar">
      <div class="summary-card">
        <h3>Resumen</h3>
        <div class="summary-row"><span>${oA.ciudad} → ${dA.ciudad}</span><span>${vuelo.id}</span></div>
        <div class="summary-row"><span>Clase</span><span>${NOMBRE_CLASE[vuelo.claseSolicitada]}</span></div>
        <div class="summary-divider"></div>
        <div class="summary-row summary-total"><span>Total por persona</span><span>${formatearMoneda(vuelo.precio)}</span></div>
        <button type="button" class="btn btn-primary btn-block btn-large" id="detalle-continuar">Continuar</button>
      </div>
    </aside>
  `;

  document.getElementById("detalle-continuar").addEventListener("click", () => {
    window.location.href = "asientos.html";
  });
}

/* ==========================================================================
   SELECCIÓN DE ASIENTOS (asientos.html)
   ========================================================================== */
function initAsientos() {
  const vuelo = leerEstado(RESERVAS_KEYS.vuelo);
  const seatMapEl = document.getElementById("seat-map");
  const infoEl = document.getElementById("seat-map-flight-info");
  const summaryFlightEl = document.getElementById("seat-summary-flight");
  const selectedValueEl = document.getElementById("seat-selected-value");
  const priceBaseEl = document.getElementById("seat-price-base");
  const priceExtraRow = document.getElementById("seat-price-extra-row");
  const priceExtraEl = document.getElementById("seat-price-extra");
  const priceTotalEl = document.getElementById("seat-price-total");
  const continueBtn = document.getElementById("seat-continue-btn");

  if (!vuelo) {
    document.querySelector(".flow-layout-seats").innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>No hay ningún vuelo seleccionado</h3>
        <p>Vuelve a los resultados para elegir un vuelo.</p>
        <a href="index.html#buscador" class="btn btn-primary">Buscar vuelos</a>
      </div>`;
    return;
  }

  const oA = buscarAeropuerto(vuelo.origen), dA = buscarAeropuerto(vuelo.destino);
  infoEl.textContent = `Vuelo ${vuelo.id} · ${oA.ciudad} → ${dA.ciudad} · ${AVIONES[vuelo.avion].modelo}`;
  summaryFlightEl.innerHTML = `<strong>${vuelo.id}</strong> · ${oA.ciudad} → ${dA.ciudad}<br><span style="color:var(--gray-500); font-size:0.82rem;">${vuelo.salida} – ${vuelo.llegada} · ${NOMBRE_CLASE[vuelo.claseSolicitada]}</span>`;
  priceBaseEl.textContent = formatearMoneda(vuelo.precio);
  priceTotalEl.textContent = formatearMoneda(vuelo.precio);

  const mapa = generarMapaAsientos(vuelo);
  const totalPasajeros = Math.max(1, Number(vuelo.totalAsientos ?? vuelo.totalPasajeros ?? 1));
  let asientosSeleccionados = normalizarAsientosSeleccionados(leerEstado(RESERVAS_KEYS.asiento));

  if (asientosSeleccionados.some(asiento => asiento.vueloId !== vuelo.id)) {
    asientosSeleccionados = [];
  }

  function actualizarResumenAsiento() {
    const numeroSeleccionados = asientosSeleccionados.length;
    selectedValueEl.textContent = numeroSeleccionados
      ? asientosSeleccionados.map(asiento => asiento.codigo).join(", ")
      : "Ninguno";

    const precioExtraTotal = asientosSeleccionados.reduce((total, asiento) => total + (asiento.precioExtra || 0), 0);
    priceExtraRow.hidden = precioExtraTotal === 0;
    priceExtraEl.textContent = formatearMoneda(precioExtraTotal);
    priceTotalEl.textContent = formatearMoneda(vuelo.precio * totalPasajeros + precioExtraTotal);
    continueBtn.disabled = numeroSeleccionados !== totalPasajeros;
  }

  seatMapEl.innerHTML = "";
  mapa.filas.forEach(fila => {
    if (fila.salida) {
      const salidaLabel = document.createElement("div");
      salidaLabel.className = "seat-row-exit";
      salidaLabel.textContent = "Salida de emergencia";
      seatMapEl.appendChild(salidaLabel);
    }

    const rowEl = document.createElement("div");
    rowEl.className = "seat-map-row";
    const numEl = document.createElement("span");
    numEl.className = "seat-row-number";
    numEl.textContent = fila.numero;
    rowEl.appendChild(numEl);

    const mitad = Math.ceil(mapa.columnas.length / 2);
    fila.asientos.forEach((asiento, i) => {
      if (i === mitad) {
        const gap = document.createElement("span");
        gap.className = "seat-gap";
        rowEl.appendChild(gap);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seat-btn";
      btn.textContent = asiento.columna;
      btn.dataset.codigo = asiento.codigo;
      btn.setAttribute("aria-label", `Asiento ${asiento.codigo}${asiento.premium ? " premium" : ""}${asiento.ocupado ? ", ocupado" : ", disponible"}`);
      if (asiento.premium) btn.classList.add("is-premium");
      if (asiento.ocupado) btn.disabled = true;
      if (asientosSeleccionados.some(item => item.codigo === asiento.codigo)) btn.classList.add("is-selected");

      btn.addEventListener("click", () => {
        const yaSeleccionado = asientosSeleccionados.some(item => item.codigo === asiento.codigo);
        if (yaSeleccionado) {
          asientosSeleccionados = asientosSeleccionados.filter(item => item.codigo !== asiento.codigo);
        } else {
          if (asientosSeleccionados.length >= totalPasajeros) {
            mostrarToast(`Ya seleccionaste ${totalPasajeros} asiento${totalPasajeros > 1 ? "s" : ""}.`, "info");
            return;
          }
          asientosSeleccionados.push({ vueloId: vuelo.id, codigo: asiento.codigo, premium: asiento.premium, precioExtra: asiento.precioExtra });
        }
        seatMapEl.querySelectorAll(".seat-btn.is-selected").forEach(b => b.classList.remove("is-selected"));
        asientosSeleccionados.forEach(item => {
          const seatBtn = [...seatMapEl.querySelectorAll(".seat-btn")].find(b => b.dataset.codigo === item.codigo);
          if (seatBtn) seatBtn.classList.add("is-selected");
        });
        actualizarResumenAsiento();
      });

      rowEl.appendChild(btn);
    });
    seatMapEl.appendChild(rowEl);
  });

  actualizarResumenAsiento();

  continueBtn.addEventListener("click", () => {
    if (asientosSeleccionados.length !== totalPasajeros) return;
    guardarAsientosSeleccionados(asientosSeleccionados);
    mostrarToast(`Asientos ${asientosSeleccionados.map(a => a.codigo).join(", ")} confirmados. Continuando con los datos del pasajero…`, "success");
    setTimeout(() => { window.location.href = "pasajeros.html"; }, 900);
  });
}
