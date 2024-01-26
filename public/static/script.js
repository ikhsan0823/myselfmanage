const popupContainer = document.querySelector("section");
const showSignupForm = document.querySelector(".signup-btn-show");
const showLoginForm = document.querySelector(".login-btn-show");
const signupCloseBtn = document.getElementById("signup-cancel");
const loginCloseBtn = document.getElementById("login-cancel");
const signupSubmitBtn = document.querySelector(".signup-btn");
const loginSubmitBtn = document.querySelector(".login-btn");

showSignupForm.addEventListener("click", () => popupContainer.classList.add("signup-active"));
showLoginForm.addEventListener("click", () => popupContainer.classList.add("login-active"));
signupCloseBtn.addEventListener("click", () => popupContainer.classList.remove("signup-active"));
signupSubmitBtn.addEventListener("click", () => popupContainer.classList.remove("signup-active"));
loginCloseBtn.addEventListener("click", () => popupContainer.classList.remove("login-active"));
loginSubmitBtn.addEventListener("click", () => popupContainer.classList.remove("login-active"));
