const popupContainer = document.querySelector("section");
const showSignupForm = document.querySelector(".signup-btn-show");
const showLoginForm = document.querySelector(".login-btn-show");
const signupCloseBtn = document.getElementById("signup-cancel");
const loginCloseBtn = document.getElementById("login-cancel");
const signupSubmitBtn = document.querySelector(".signup-btn");
const loginSubmitBtn = document.querySelector(".login-btn");
const signupForm = document.getElementById("signup-form");
const formNotif = document.getElementById('form-notif');

showSignupForm.addEventListener("click", () => {
    popupContainer.classList.add("signup-active");
});
showLoginForm.addEventListener("click", () => popupContainer.classList.add("login-active"));
signupCloseBtn.addEventListener("click", () => popupContainer.classList.remove("signup-active"));
loginCloseBtn.addEventListener("click", () => popupContainer.classList.remove("login-active"));
loginSubmitBtn.addEventListener("click", () => popupContainer.classList.remove("login-active"));

document.addEventListener('DOMContentLoaded', function() {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username-signup');
        const emailInput = document.getElementById('email-signup');
        const passwordInput = document.getElementById('password-signup');
        const password2Input = document.getElementById('reenter-password');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidEmail = emailPattern.test(emailInput.value);

        formNotif.innerHTML = '';

        if (usernameInput.value === '' && emailInput.value === '' && passwordInput.value === '') {
            popupContainer.classList.add("notif-active");
            formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Please fill in the fields to sign up';
            setTimeout(function() {
                formNotif.innerHTML = '';
                popupContainer.classList.remove("notif-active");
            }, 5000);
            return
        } else {
            if (usernameInput.value === '') {
                popupContainer.classList.add("notif-active");
                formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Please enter your new username';
                setTimeout(function() {
                    formNotif.innerHTML = '';
                    popupContainer.classList.remove("notif-active");
                }, 5000);
                return
            }
    
            if (emailInput.value === '') {
                formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Please enter your email';
                setTimeout(function() {
                    formNotif.innerHTML = '';
                    popupContainer.classList.remove("notif-active");
                }, 5000);
                return
            }

            if (!isValidEmail) {
                formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Invalid email';
                setTimeout(function() {
                    formNotif.innerHTML = '';
                    popupContainer.classList.remove("notif-active");
                }, 5000);
                return;
            }
            
            if (passwordInput.value === '') {
                formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Please enter your new password';
                setTimeout(function() {
                    formNotif.innerHTML = '';
                    popupContainer.classList.remove("notif-active");
                }, 5000);
                return;
            }

            if (passwordInput.value.length < 8) {
                formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>The password must have at least 8 characters';
                setTimeout(function() {
                    formNotif.innerHTML = '';
                    popupContainer.classList.remove("notif-active");
                }, 5000);
                return;
            }

            if (password2Input.value !== passwordInput.value) {
                formNotif.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>Passwords do not match. Try again';
                setTimeout(function() {
                    formNotif.innerHTML = '';
                    popupContainer.classList.remove("notif-active");
                }, 5000);
                return;
            }

            signupForm.submit();
            popupContainer.classList.remove("signup-active");
        }
    });
});
