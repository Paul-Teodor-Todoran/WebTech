let loginForm = document.getElementById("login-form");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
loginForm.addEventListener("submit", function(e) {
e.preventDefault();
const email = emailInput.value.trim();
const password = passwordInput.value;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;
if (!emailRegex.test(email)) {
alert("Introdu o adresă de email validă.");
return;
}
if (!passwordRegex.test(password)) {
alert("Parola trebuie să aibă cel puțin 7 caractere, o literă mică, o literă mare, o cifră și un caracter special.");
return;
}
alert("Login reușit!");
window.location.href = "home.html";
});
