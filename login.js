// login.js

document.addEventListener('DOMContentLoaded', () => {
    const officerInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginBtn = document.querySelector('button');

    // Officer ID format: O- followed by 6 alphanumeric characters
    const OFFICER_ID_REGEX = /^O-[A-Za-z0-9]{6}$/;

    function showError(input, message) {
        clearError(input);
        input.style.border = '1px solid #ff4d4d';
        const err = document.createElement('p');
        err.className = 'input-error';
        err.textContent = message;
        err.style.cssText = 'color:#ff4d4d;font-size:11px;text-align:left;margin-top:-20px;margin-bottom:10px;background:transparent;';
        input.insertAdjacentElement('afterend', err);
    }

    function clearError(input) {
        input.style.border = '';
        const next = input.nextElementSibling;
        if (next && next.classList.contains('input-error')) next.remove();
    }

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let valid = true;

        const id = officerInput.value.trim();
        if (!id) {
            showError(officerInput, 'Officer ID is required.');
            valid = false;
        } else if (!OFFICER_ID_REGEX.test(id)) {
            showError(officerInput, 'Format must be O-xxxxxx (6 characters).');
            valid = false;
        } else {
            clearError(officerInput);
        }

        const pwd = passwordInput.value;
        if (!pwd) {
            showError(passwordInput, 'Password is required.');
            valid = false;
        } else if (pwd.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters.');
            valid = false;
        } else {
            clearError(passwordInput);
        }

        if (valid) window.location.href = 'dashboard.html';
    });

    officerInput.addEventListener('input', () => clearError(officerInput));
    passwordInput.addEventListener('input', () => clearError(passwordInput));
});
