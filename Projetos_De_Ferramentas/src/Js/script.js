const toggleBtn = document.getElementById("themeToggle");

// Carregar o tema salvo
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-theme");
}

// Alternar o tema 
toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-theme");

    const isDark = document.documentElement.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
