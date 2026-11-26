// Navegación móvil.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => navLinks.classList.remove("open")));
}

// Tema claro/oscuro: se conserva al cambiar de página.
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("mindcare-theme");
if (savedTheme === "dark") document.body.classList.add("dark");
if (themeToggle) {
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("mindcare-theme", dark ? "dark" : "light");
    themeToggle.textContent = dark ? "☀" : "☾";
  });
}

// Reconoce: selección, intensidad y guardado local.
const moodMessages = {
  Feliz:"Qué bueno que estés experimentando alegría. Puedes permitirte disfrutar este momento.",
  Tranquilo:"Disfruta esta pausa. ¿Qué te ayuda a sentirte en calma?",
  Triste:"No tienes que ocultar lo que sientes. Quizá te ayude hablar con alguien de confianza o darte tiempo.",
  Ansioso:"Haz una pausa y vuelve poco a poco a lo que tienes delante. No necesitas resolver todo ahora.",
  Enojado:"Tu emoción merece ser escuchada. Cuando estés listo, puedes pensar qué límite o necesidad hay detrás.",
  Frustrado:"Es comprensible que algo difícil te frustre. Puedes dividirlo en un paso pequeño.",
  Cansado:"Tal vez necesitas descanso. Escucha tus necesidades y date permiso para hacer una pausa.",
  Confundido:"No tienes que tener todas las respuestas ahora. Puedes escribir qué parte te gustaría aclarar.",
  Solo:"Mereces conexión y compañía. Considera acercarte a alguien con quien te sientas seguro.",
  Entusiasmado:"Qué bonito tener algo que te entusiasme. Puedes reconocer qué hace especial este momento.",
  Agradecido:"Tomarte un momento para reconocerlo puede ayudarte a valorar lo que es importante para ti.",
  Aburrido:"Quizá sea buen momento para probar algo pequeño que despierte tu curiosidad."
};
const moodButtons = document.querySelectorAll("[data-mood]");
const moodMessage = document.getElementById("moodMessage");
let selectedMood = "";
moodButtons.forEach(button => button.addEventListener("click", () => {
  selectedMood = button.dataset.mood;
  moodButtons.forEach(item => item.classList.toggle("selected", item === button));
  if (moodMessage) moodMessage.textContent = moodMessages[selectedMood];
}));
const intensity = document.getElementById("moodIntensity");
const intensityValue = document.getElementById("intensityValue");
if (intensity && intensityValue) intensity.addEventListener("input", () => intensityValue.textContent = `${intensity.value}/5`);
const saveMood = document.getElementById("saveMood");
if (saveMood) saveMood.addEventListener("click", () => {
  const status = document.getElementById("moodSaved");
  if (!selectedMood) { status.textContent = "Primero selecciona una emoción."; return; }
  const records = JSON.parse(localStorage.getItem("mindcare-moods") || "[]");
  records.push({ mood:selectedMood, intensity:intensity.value, note:document.getElementById("moodNote").value.trim(), date:new Date().toLocaleString("es-EC") });
  localStorage.setItem("mindcare-moods", JSON.stringify(records));
  status.textContent = "Tu registro se guardó en este navegador. Gracias por reconocer cómo te sientes.";
  document.getElementById("moodNote").value = "";
});

// Respira: ciclo suave con opción de detener.
const startBreath = document.getElementById("startBreath");
if (startBreath) {
  const circle = document.getElementById("breathCircle");
  const timerText = document.getElementById("timer");
  const phaseText = document.getElementById("breathPhase");
  const stopBreath = document.getElementById("stopBreath");
  let seconds = 60, countdown = null, phaseTimer = null, phase = 0;
  const phases = [{label:"Inhala suavemente",duration:4000},{label:"Exhala lentamente",duration:6000}];
  function stopExercise(done=false) {
    clearInterval(countdown); clearTimeout(phaseTimer);
    circle.classList.remove("active");
    circle.textContent = done ? "¡Listo!" : "Pausa";
    phaseText.textContent = done ? "Terminaste. Gracias por dedicarte este momento." : "Ejercicio detenido. Puedes volver cuando quieras.";
    startBreath.disabled = false; startBreath.textContent = "Volver a empezar"; stopBreath.disabled = true;
    timerText.textContent = done ? "Has completado el minuto." : "Puedes descansar.";
  }
  function nextPhase() {
    const current = phases[phase];
    circle.textContent = phase === 0 ? "Inhala" : "Exhala";
    phaseText.textContent = current.label;
    phase = 1 - phase;
    phaseTimer = setTimeout(nextPhase, current.duration);
  }
  startBreath.addEventListener("click", () => {
    clearInterval(countdown); clearTimeout(phaseTimer);
    seconds = 60; phase = 0; startBreath.disabled = true; stopBreath.disabled = false;
    circle.classList.add("active"); timerText.textContent = "Quedan 60 segundos";
    nextPhase();
    countdown = setInterval(() => {
      seconds--; timerText.textContent = `Quedan ${seconds} segundos`;
      if (seconds <= 0) stopExercise(true);
    }, 1000);
  });
  stopBreath.addEventListener("click", () => stopExercise(false));
}

// Reflexiona: preguntas, guardado, historial y eliminación en el navegador.
const prompts = [
  "¿Qué necesitas darte a ti mismo hoy?",
  "¿Qué fue algo pequeño que te gustaría recordar de este día?",
  "¿Hay algo que te esté preocupando y quieras poner en palabras?",
  "¿Qué te ayudaría a sentirte acompañado o apoyado?",
  "¿Qué hiciste hoy que requirió esfuerzo, aunque pareciera pequeño?",
  "¿Qué te gustaría dejar para mañana y no resolver ahora?"
];
const promptBox = document.getElementById("reflectionPrompt");
const newPrompt = document.getElementById("newPrompt");
if (newPrompt && promptBox) newPrompt.addEventListener("click", () => {
  const options = prompts.filter(item => item !== promptBox.textContent);
  promptBox.textContent = options[Math.floor(Math.random() * options.length)];
});
const reflectionList = document.getElementById("reflectionList");
function renderReflections() {
  if (!reflectionList) return;
  const entries = JSON.parse(localStorage.getItem("mindcare-reflections") || "[]");
  reflectionList.innerHTML = "";
  if (!entries.length) { reflectionList.innerHTML = "<p>Aún no tienes reflexiones guardadas.</p>"; return; }
  entries.slice().reverse().forEach(entry => {
    const card = document.createElement("article"); card.className = "saved-entry";
    const head = document.createElement("div"); head.className = "entry-head";
    const date = document.createElement("small"); date.textContent = entry.date;
    const del = document.createElement("button"); del.className = "delete-entry"; del.textContent = "Eliminar";
    del.setAttribute("aria-label", "Eliminar reflexión");
    del.addEventListener("click", () => {
      const updated = JSON.parse(localStorage.getItem("mindcare-reflections") || "[]").filter(item => item.id !== entry.id);
      localStorage.setItem("mindcare-reflections", JSON.stringify(updated)); renderReflections();
    });
    const body = document.createElement("p"); body.textContent = entry.text;
    head.append(date, del); card.append(head, body); reflectionList.append(card);
  });
}
const saveReflection = document.getElementById("saveReflection");
if (saveReflection) saveReflection.addEventListener("click", () => {
  const area = document.getElementById("reflectionText");
  const status = document.getElementById("reflectionStatus");
  const value = area.value.trim();
  if (!value) { status.textContent = "Escribe algo antes de guardar."; area.focus(); return; }
  const entries = JSON.parse(localStorage.getItem("mindcare-reflections") || "[]");
  entries.push({id:Date.now(), text:value, date:new Date().toLocaleString("es-EC")});
  localStorage.setItem("mindcare-reflections", JSON.stringify(entries));
  area.value = ""; status.textContent = "Tu reflexión se guardó en este navegador.";
  renderReflections();
});
renderReflections();

// Aparición progresiva al desplazarse.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); currentObserver.unobserve(entry.target); } });
  }, {threshold:0.12});
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add("visible"));
