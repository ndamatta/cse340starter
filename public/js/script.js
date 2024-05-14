//BURGER BUTTON
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("open");
    document.getElementById("hamburgerBtn").classList.toggle("open");
};

const x = document.getElementById("hamburgerBtn")
x.onclick = toggleMenu;

//SHOW PASSWORD
document.querySelector("#show-password").addEventListener("click", () => {
    const input = document.querySelector("#register-password");
    const button = document.querySelector("#show-password");
    if (input.getAttribute("type") === "password") {
        input.setAttribute("type", "text");
        button.innerHTML = "Hide password";
    }
    else {
        input.setAttribute("type", "password");
        button.innerHTML = "Show password";
    }
})