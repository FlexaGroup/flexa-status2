// document.addEventListener("DOMContentLoaded", function () {
//   // Get all anchor tags with a .html extension and remove it
//   var anchors = document.querySelectorAll("a[href$='.html']");
//   anchors.forEach(function (anchor) {
//     anchor.setAttribute(
//       "href",
//       anchor.getAttribute("href").replace(".html", "")
//     );
//   });

//   // Remove .html from the current page's URL
//   var currentPageUrl = window.location.href;
//   if (currentPageUrl.endsWith(".html")) {
//     var updatedUrl = currentPageUrl.replace(".html", "");
//     window.history.replaceState({}, document.title, updatedUrl);
//   }
// });

// Function to check if the user's IP is blacklisted
async function checkBlacklist() {
  try {
    const response = await fetch("blacklistedips.txt");
    const blacklistText = await response.text();
    const blacklistedIPs = blacklistText
      .split("\n")
      .map((ip) => ip.trim())
      .filter((ip) => ip !== "");

    const userIP = await fetch("https://api64.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => data.ip);

    if (blacklistedIPs.includes(userIP)) {
      window.location.href = "blocked.html";
    }
  } catch (error) {
    console.error("Error checking blacklist:", error);
  }
}

// Call the checkBlacklist function when the page loads
checkBlacklist();

// Rest of your existing code...

// JavaScript to toggle the visibility of the footer based on scroll position

window.onscroll = function () {
  showHideFooter();
};
showHideFooter();

function showHideFooter() {
  var footer = document.getElementById("footer");
  var hasScroll = document.body.scrollHeight > window.innerHeight;

  if (hasScroll) {
    var isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;

    footer.style.opacity = isAtBottom ? 1 : 0;
  } else {
    footer.style.opacity = 1;
  }
}

setInterval(function () {
  location.reload();
}, 300000);

tailwind.config = {
  darkMode:
    "class" /* class/media, here we use class to enable manually dark mode */,
};

if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

document.addEventListener("contextmenu", (event) => event.preventDefault());
document.onkeydown = function (e) {
  if (event.keyCode == 123) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
    return false;
  }
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
    return false;
  }
};
