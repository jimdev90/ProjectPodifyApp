const getById = (id) => {
    return document.getElementById(id);
}

const password = getById('password');
const confirmPassword = getById('confirm-password');
const form = getById('form');
const container = getById('container');
const loader = getById('loader');
const button = getById('submit');
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";

let token, userId;
const passRegx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/

window.addEventListener('DOMContentLoaded', async () => {

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop)
        }
    })

    token = params.token;
    userId = params.userId;

    // https://yourapp.com/reset-password?token=21f5ac59a8ec9dfed1c4c497fc0aee1a72ff4de53af764df097652a8686f1bd0d7220b44&userId=64ba050a3cdf1191a9b527c8

    const res = await fetch("/auth/verify-pass-reset-token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            token,
            userId
        })
    });


    if (!res.ok) {
        const { error } = await res.json();
        loader.innerText = error;
        container.style.display = 'none';
        return

    }

    loader.style.display = 'none';
    container.style.display = 'block';

})

const displayError = (errorMessage) => {
    // first we need to remove if there is any success message
    success.style.display = 'none';
    error.innerText = errorMessage;
    error.style.display = 'block';

}

const displaySuccess = (successMessage) => {
    // first we need to remove if there is any error message
    error.style.display = 'none';
    success.innerText = successMessage;
    success.style.display = 'block';
}

const handleSubmit = async (e) => {
    e.preventDefault();
    //Validamos
    if (!password.value.trim()) {
        return displayError('Password is missing!');
    }

    if (!passRegx.test(password.value)) {
        return displayError('Password is too simple, use alpha numeric with special characters!')
    }

    if (password.value !== confirmPassword.value) {
        return displayError('Password do not match!');
    }

    button.disabled = true;
    button.innerText = 'Please wait...!'

    // handle the submit
    const res = await fetch("/auth/update-password", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            token,
            userId,
            password: password.value
        })
    });


    button.disabled = false;
    button.innerText = 'Reset password'

    if (!res.ok) {
        const { error } = await res.json();
        return displayError(error);
    }

    displaySuccess('Your password is resets successfully!');

    // resetting the form
    password.value = '';
    confirmPassword.value = '';
}

form.addEventListener('submit', handleSubmit);
