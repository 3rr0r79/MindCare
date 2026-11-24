// Menú desplegable para pantallas pequeñas.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// Cambio entre tema claro y oscuro.
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
  });
}

// Selector de emociones.
const moodButtons = document.querySelectorAll("[data-mood]");
const moodMessage = document.getElementById("moodMessage");
const messages = {
  Feliz: "¡Qué bueno! Reconoce y disfruta esos momentos positivos.",
  Tranquilo: "Es un buen momento para agradecer y mantener ese equilibrio.",
  Cansado: "Quizás necesitas una pausa. Escucha lo que tu cuerpo te pide.",
  Preocupado: "Está bien sentirse así. Puedes tomarte un momento y hablar con alguien de confianza."
};
moodButtons.forEach(button => {
  button.addEventListener("click", () => {
    moodButtons.forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    moodMessage.textContent = messages[button.dataset.mood];
  });
});

// Temporizador de respiración de 60 segundos.
const startBreath = document.getElementById("startBreath");
if (startBreath) {
  const circle = document.getElementById("breathCircle");
  const timerText = document.getElementById("timer");
  let seconds = 60;
  let countdown;
  let phaseTimer;
  startBreath.addEventListener("click", () => {
    seconds = 60;
    let phase = 0;
    const phases = ["Inhala", "Exhala"];
    startBreath.disabled = true;
    startBreath.textContent = "Ejercicio en curso...";
    circle.classList.add("active");
    circle.textContent = "Inhala";
    timerText.textContent = "Quedan 60 segundos";
    phaseTimer = setInterval(() => {
      phase = 1 - phase;
      circle.textContent = phases[phase];
    }, 4000);
    countdown = setInterval(() => {
      seconds--;
      timerText.textContent = `Quedan ${seconds} segundos`;
      if (seconds <= 0) {
        clearInterval(countdown);
        clearInterval(phaseTimer);
        circle.classList.remove("active");
        circle.textContent = "¡Listo!";
        timerText.textContent = "Terminaste. Gracias por dedicarte este momento.";
        startBreath.disabled = false;
        startBreath.textContent = "Repetir ejercicio";
      }
    }, 1000);
  });
}

// Efecto de aparición al desplazarse por la página.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}
