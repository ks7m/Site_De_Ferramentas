const input = document.getElementById("city-input");
const btn = document.getElementById("search-btn");

const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temp-value");
const windEl = document.getElementById("wind-speed");
const latEl = document.getElementById("lat-val");
const lonEl = document.getElementById("lon-val");

let visualContainer = document.querySelector(".weather-visual");
if (!visualContainer) {
  visualContainer = document.createElement("div");
  visualContainer.className = "weather-visual";
  document.body.appendChild(visualContainer);
}

function limparVisuais() {
  document.body.classList.remove("weather-sunny","weather-cloudy","weather-rainy","weather-snow","weather-fog");
  while (visualContainer.firstChild) visualContainer.removeChild(visualContainer.firstChild);
  const oldRain = document.querySelector(".rain");
  if (oldRain) oldRain.remove();
  const oldSnow = document.querySelector(".snow");
  if (oldSnow) oldSnow.remove();
  const oldSun = document.querySelector(".sun");
  if (oldSun) oldSun.remove();
  const oldClouds = document.querySelector(".clouds");
  if (oldClouds) oldClouds.remove();
}

function gerarSol() {
  const sun = document.createElement("div");
  sun.className = "sun";
  visualContainer.appendChild(sun);
}
function gerarNuvens() {
  const wrap = document.createElement("div");
  wrap.className = "clouds";
  const c1 = document.createElement("div"); c1.className = "cloud x1";
  const c2 = document.createElement("div"); c2.className = "cloud x2";
  const c3 = document.createElement("div"); c3.className = "cloud x3";
  wrap.appendChild(c1); wrap.appendChild(c2); wrap.appendChild(c3);
  visualContainer.appendChild(wrap);
}
function gerarChuva() {
  const rain = document.createElement("div");
  rain.className = "rain";
  const drops = 40;
  for (let i=0;i<drops;i++){
    const drop = document.createElement("div");
    drop.className = "drop";
    drop.style.left = Math.random()*100 + "vw";
    drop.style.top = Math.random()*-10 + "vh";
    drop.style.animationDuration = (0.6 + Math.random()*0.9) + "s";
    drop.style.opacity = (0.45 + Math.random()*0.55);
    rain.appendChild(drop);
  }
  visualContainer.appendChild(rain);
}
function gerarNeve() {
  const snow = document.createElement("div");
  snow.className = "snow";
  const flakes = 30;
  for (let i=0;i<flakes;i++){
    const f = document.createElement("div");
    f.className = "flake";
    f.style.left = Math.random()*100 + "vw";
    f.style.top = Math.random()*-20 + "vh";
    f.style.animationDuration = (5 + Math.random()*6) + "s";
    f.style.opacity = (0.6 + Math.random()*0.4);
    f.style.width = (4 + Math.random()*8) + "px";
    f.style.height = f.style.width;
    snow.appendChild(f);
  }
  visualContainer.appendChild(snow);
}


function aplicarTemaDinamico(weathercode) {
  limparVisuais();
  weathercode = Number(weathercode);
  console.log("Aplicando tema para weathercode:", weathercode);

  if (weathercode === 0) {
    document.body.classList.add("weather-sunny");
    gerarSol();
  } else if ([1,2,3].includes(weathercode)) {
    document.body.classList.add("weather-cloudy");
    gerarNuvens();
  } else if ([45,48].includes(weathercode)) {
    document.body.classList.add("weather-fog");
    gerarNuvens();
  } else if ((weathercode >= 51 && weathercode <= 65) || (weathercode >= 80 && weathercode <= 82) || (weathercode >= 95 && weathercode <= 99) || (weathercode >= 61 && weathercode <= 67)) {
    document.body.classList.add("weather-rainy");
    gerarNuvens();
    gerarChuva();
  } else if ((weathercode >= 71 && weathercode <= 77) || weathercode === 85 || weathercode === 86) {
    document.body.classList.add("weather-snow");
    gerarNuvens();
    gerarNeve();
  } else {

    document.body.classList.add("weather-cloudy");
    gerarNuvens();
  }
}

async function buscarClimaPorCidade() {
  const city = input.value.trim();
  if (!city) {
    console.warn("Campo cidade vazio.");
    return;
  }

  cityNameEl.textContent = "Buscando...";
  tempEl.textContent = "--";
  windEl.textContent = "-- km/h";
  latEl.textContent = "--";
  lonEl.textContent = "--";

  try {
    console.log("Buscando geocoding para:", city);
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=pt&count=1`;
    const geoRes = await fetch(geoURL);
    if (!geoRes.ok) throw new Error("Erro na requisição de geocoding: " + geoRes.status);
    const geoData = await geoRes.json();
    console.log("geoData:", geoData);

    if (!geoData.results || geoData.results.length === 0) {
      cityNameEl.textContent = "Cidade não encontrada";
      return;
    }

    const result = geoData.results[0];
    const latitude = result.latitude;
    const longitude = result.longitude;
    const displayName = result.name + (result.country ? ", " + result.country : "");

    console.log("Coordenadas:", latitude, longitude);

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    console.log("Chamando:", weatherURL);
    const weatherRes = await fetch(weatherURL);
    if (!weatherRes.ok) throw new Error("Erro na requisição de clima: " + weatherRes.status);
    const weatherData = await weatherRes.json();
    console.log("weatherData:", weatherData);

    if (!weatherData.current_weather) {
      cityNameEl.textContent = "Sem dados de clima";
      return;
    }

    const clima = weatherData.current_weather;

    cityNameEl.textContent = displayName;
    tempEl.textContent = clima.temperature ?? "--";
    windEl.textContent = (clima.windspeed ?? "--") + " km/h";
    latEl.textContent = latitude;
    lonEl.textContent = longitude;

    
    aplicarTemaDinamico(clima.weathercode);

  } catch (err) {
    console.error("Erro no fluxo de clima:", err);
    cityNameEl.textContent = "Erro ao buscar dados";
  }
}

// Eventos
btn.addEventListener("click", buscarClimaPorCidade);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") buscarClimaPorCidade(); });


console.log("previsao.js carregado corretamente.");
