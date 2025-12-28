const timeEl = document.querySelector(".time");
const weekEl = document.querySelector(".week");
const dateEl = document.querySelector(".date");
const lockScreen = document.querySelector(".main");


function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const days = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  timeEl.innerText = `${hours}:${minutes} ${ampm}`;
  weekEl.innerText = days[now.getDay()];
  dateEl.innerText = now.toLocaleDateString("en-GB");
  // Update taskbar time tooltip / display if present
  const taskbarBox = document.getElementById('taskbarTimeBox');
  if (taskbarBox) {
    const tbTime = `${hours}:${minutes}`;
    const tbDate = now.toLocaleDateString("en-GB");
    // update visible spans if present
    const spans = taskbarBox.querySelectorAll('span');
    if (spans[0]) spans[0].innerText = tbTime;
    if (spans[1]) spans[1].innerText = tbDate;
    taskbarBox.setAttribute('data-label', `${tbTime} ${ampm} — ${tbDate}`);
  }
}

updateClock();              // run immediately
setInterval(updateClock, 1000); // keep it live

lockScreen.addEventListener("click", () => {
  lockScreen.classList.add("unlock");
});

// Desktop context menu behavior
(() => {
  const menu = document.getElementById('desktopContextMenu');
  const desktop = document.querySelector('.desktop');

  function openMenu(x, y) {
    // adjust to avoid overflow
    const { innerWidth: ww, innerHeight: wh } = window;
    const rect = menu.getBoundingClientRect();
    let left = x;
    let top = y;
    if (x + rect.width > ww) left = ww - rect.width - 8;
    if (y + rect.height > wh) top = wh - rect.height - 8;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
  }

  // Show custom menu and prevent default
  document.addEventListener('contextmenu', (e) => {
    // Only show when right-clicking on the desktop area
    if (e.target.closest('.desktop') || e.target === document.body) {
      e.preventDefault();
      openMenu(e.clientX, e.clientY);
    } else {
      // If right-click on other UI (taskbar, menus), allow native menu
      closeMenu();
    }
  });

  // Close on left click anywhere else
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#desktopContextMenu')) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Prevent the browser default context menu when our menu is open
  menu.addEventListener('contextmenu', (e) => e.preventDefault());

  // Example interaction: log item clicked
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('.context-menu__item');
    if (!item) return;
    const label = item.textContent.trim();
    console.log('Context menu:', label);
    closeMenu();
  });
})();




