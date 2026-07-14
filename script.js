document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileMenuLinks = mobileMenu.querySelectorAll("a[href^='#']");
const progressBar = document.querySelector(".scroll-progress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

requestAnimationFrame(() => document.body.classList.add("is-ready"));

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.inert = !open;
  mobileMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);

  if (open) {
    window.setTimeout(() => mobileMenuLinks[0].focus(), 450);
  }
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;

  header.classList.toggle("is-scrolled", scrollTop > 24);
  progressBar.style.transform = `scaleX(${progress})`;
}

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5%" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const navLinks = document.querySelectorAll(".desktop-nav a");
const trackedSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 },
  );

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

const schedule = {
  mon: null,
  tue: { open: 12 * 60 + 30, close: 17 * 60, label: "12:30 - 17:00" },
  wed: { open: 12 * 60 + 30, close: 17 * 60, label: "12:30 - 17:00" },
  thu: { open: 12 * 60 + 30, close: 22 * 60, label: "12:30 - 22:00" },
  fri: { open: 12 * 60 + 30, close: 22 * 60, label: "12:30 - 22:00" },
  sat: { open: 12 * 60 + 30, close: 22 * 60, label: "12:30 - 22:00" },
  sun: { open: 12 * 60 + 30, close: 17 * 60, label: "12:30 - 17:00" },
};

const dayOrder = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const dayNames = {
  mon: "lunes",
  tue: "martes",
  wed: "miércoles",
  thu: "jueves",
  fri: "viernes",
  sat: "sábado",
  sun: "domingo",
};

function chileTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    day: values.weekday.toLowerCase().slice(0, 3),
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function nextOpening(currentDay) {
  const currentIndex = dayOrder.indexOf(currentDay);

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = dayOrder[(currentIndex + offset) % 7];
    if (schedule[day]) return { day, ...schedule[day] };
  }

  return null;
}

function openingStatus() {
  const { day, minutes } = chileTime();
  const today = schedule[day];
  let text;
  let isOpen = false;

  if (!today) {
    const next = nextOpening(day);
    text = `Cerrado hoy · Abrimos ${dayNames[next.day]} ${next.label.split(" - ")[0]}`;
  } else if (minutes < today.open) {
    text = `Hoy abrimos a las ${today.label.split(" - ")[0]}`;
  } else if (minutes < today.close) {
    isOpen = true;
    text = `Abierto ahora · Hasta las ${today.label.split(" - ")[1]}`;
  } else {
    const next = nextOpening(day);
    text = `Cerrado ahora · Abrimos ${dayNames[next.day]} ${next.label.split(" - ")[0]}`;
  }

  document.querySelectorAll("[data-open-status]").forEach((element) => {
    element.textContent = text;
  });

  document.querySelectorAll("[data-status-dot]").forEach((element) => {
    element.classList.toggle("is-open", isOpen);
  });

  document.querySelectorAll("[data-day]").forEach((row) => {
    row.classList.toggle("is-today", row.dataset.day === day);
  });
}

openingStatus();
window.setInterval(openingStatus, 60000);

document.querySelector("[data-year]").textContent = new Date().getFullYear();
