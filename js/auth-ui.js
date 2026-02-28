(function initPublicAuthUi() {
  const userAuthArea = document.getElementById("userAuthArea");
  if (!userAuthArea) {
    return;
  }

  const session = getUserSession();

  if (!session) {
    userAuthArea.innerHTML = `
      <a href="login.html" class="profile-trigger profile-trigger-link" aria-label="Открыть авторизацию">
        <span class="profile-avatar" aria-hidden="true">?</span>
        <span>Профиль</span>
      </a>
    `;
    return;
  }

  const initials = String(session.username || "П")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  userAuthArea.innerHTML = `
    <div class="profile-menu" id="profileMenu">
      <button type="button" class="profile-trigger" id="profileTrigger" aria-haspopup="menu" aria-expanded="false">
        <span class="profile-avatar" aria-hidden="true">${initials}</span>
        <span>Профиль</span>
      </button>
      <div class="profile-dropdown" id="profileDropdown" role="menu">
        <a href="profile.html" class="profile-dropdown-link" role="menuitem">Профиль</a>
        <a href="profile.html#favoritesTitle" class="profile-dropdown-link" role="menuitem">Избранное</a>
        <button type="button" class="profile-dropdown-link" id="userLogoutBtn" role="menuitem">Выйти</button>
      </div>
    </div>
  `;

  const profileMenu = document.getElementById("profileMenu");
  const profileTrigger = document.getElementById("profileTrigger");
  const profileDropdown = document.getElementById("profileDropdown");
  const userLogoutBtn = document.getElementById("userLogoutBtn");

  if (!profileMenu || !profileTrigger || !profileDropdown || !userLogoutBtn) {
    return;
  }

  function closeProfileMenu() {
    profileMenu.classList.remove("is-open");
    profileTrigger.setAttribute("aria-expanded", "false");
  }

  profileTrigger.addEventListener("click", () => {
    const isOpen = profileMenu.classList.toggle("is-open");
    profileTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!profileMenu.contains(target)) {
      closeProfileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProfileMenu();
    }
  });

  userLogoutBtn.addEventListener("click", () => {
    logoutUserSession();
    window.location.href = "index.html";
  });
})();

(function initMobileHeaderMenu() {
  const header = document.querySelector(".site-header");
  if (!header) {
    return;
  }

  const headerInner = header.querySelector(".header-inner");
  const mainNav = header.querySelector(".main-nav");
  if (!headerInner || !mainNav) {
    return;
  }

  if (!mainNav.id) {
    mainNav.id = "siteMainNav";
  }

  let toggleButton = header.querySelector(".mobile-menu-toggle");
  if (!toggleButton) {
    toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "mobile-menu-toggle";
    toggleButton.setAttribute("aria-label", "Открыть меню");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-controls", mainNav.id);
    toggleButton.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

    const logo = header.querySelector(".logo");
    if (logo) {
      headerInner.insertBefore(toggleButton, logo);
    } else {
      headerInner.prepend(toggleButton);
    }
  }

  function closeMenu() {
    header.classList.remove("is-menu-open");
    toggleButton.setAttribute("aria-expanded", "false");
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-menu-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!header.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const mediaQuery = window.matchMedia("(min-width: 761px)");
  const handleDesktopView = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleDesktopView);
  } else {
    mediaQuery.addListener(handleDesktopView);
  }
})();