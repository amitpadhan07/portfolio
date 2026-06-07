const bgAnimation = document.getElementById("bgAnimation");

const numberOfColorBoxes = 400;

for (let i = 0; i < numberOfColorBoxes; i++) {
  const colorBox = document.createElement("div");
  colorBox.classList.add("colorBox");
  bgAnimation.append(colorBox);
}

function flipInfoCard(toBack) {
  const flip = document.getElementById("infoCardFlip");
  if (toBack) {
    flip.classList.add("flipped");
  } else {
    flip.classList.remove("flipped");
  }
}
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
    const target = this.getAttribute("href").replace("#", "");
    document
      .querySelectorAll(".page-section")
      .forEach((sec) => sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

let front = document.querySelector(".front");
let back = document.querySelector(".back");
let existingUser = document.querySelector(".return");



existingUser.addEventListener("click", function () {
  back.style.zIndex = "1";
  front.style.zIndex = "2";
  back.style.transform = "rotateY(180deg)";
  front.style.transform = "rotateY(0deg)";
});

document.querySelector(".contact_me").addEventListener("click", function () {
  document
    .querySelectorAll(".page-section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById("contact").classList.add("active");
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));
  document.querySelector('.nav-link[href="#contact"]').classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// Hamburger menu functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const infoPanel = document.querySelector('.info');
let overlay = document.querySelector('.menu-overlay');
if (!overlay) {
  overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);
}

function closeMenu() {
  infoPanel.classList.remove('open');
  overlay.classList.remove('active');
  hamburgerBtn.classList.remove('active');
}

hamburgerBtn.addEventListener('click', function () {
  infoPanel.classList.toggle('open');
  overlay.classList.toggle('active');
  hamburgerBtn.classList.toggle('active');
});

overlay.addEventListener('click', closeMenu);

// Close hamburger menu when a nav-link is clicked (on mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    // Only close if hamburger is visible (mobile)
    if (window.innerWidth <= 1100 && infoPanel.classList.contains('open')) {
      infoPanel.classList.remove('open');
      overlay.classList.remove('active');
      hamburgerBtn.classList.remove('active');
    }
  });
});



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}


// === PROJECT FILTER FUNCTIONALITY ===
// Get filter buttons, dropdown, and project items
const filterBtns = document.querySelectorAll('.filter-list [data-filter-btn]');
const filterDropdown = document.querySelector('.filter-dropdown');
const projectItems = document.querySelectorAll('.project-item');

// Helper to filter projects
function filterProjects(category) {
  projectItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    if (category === 'all' || itemCategory === category) {
      item.classList.add('active');
      item.style.display = '';
    } else {
      item.classList.remove('active');
      item.style.display = 'none';
    }
  });
}

// Button filter (desktop/tablet)
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    // Remove active from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const category = this.textContent.trim().toLowerCase();
    filterProjects(category);
    // Sync dropdown if on mobile
    if (filterDropdown) filterDropdown.value = category;
  });
});

// Dropdown filter (mobile)
if (filterDropdown) {
  filterDropdown.addEventListener('change', function () {
    const category = this.value;
    filterProjects(category);
    // Sync button active state
    filterBtns.forEach(btn => {
      if (btn.textContent.trim().toLowerCase() === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });
}

// On page load, show all projects
filterProjects('all');


// skill section
document.addEventListener("DOMContentLoaded", function() {
  function animateSkills() {
    document.querySelectorAll('.skills-item').forEach(item => {
      const fill = item.querySelector('.skill-progress-fill');
      if (fill) {
        const width = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
          fill.style.width = width;
        }, 200);
      }
    });
  }
  // Optionally, only animate when the skills section is shown
  animateSkills();
});