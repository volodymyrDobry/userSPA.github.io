document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.credentials) {
        redirectToGallery();
    } else {
        redirectToLogin();
    }


    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');


            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');


            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    const logOutButton = document.querySelector('.log-out-button');
    logOutButton.addEventListener('click', () => {
        delete localStorage.credentials;
        redirectToLogin();
    })

    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });


    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');

    const citiesByCountry = {
        'Ukraine': ['Чернівці', 'Ковель', 'Нововолинськ', 'Голоби', 'Стара Вижва'],
        'Poland': ['Варшава', 'Краків', 'Гданськ', 'Вроцлав', 'Познань'],
        'Germany': ['Берлін', 'Мюнхен', 'Гамбург', 'Кельн', 'Франкфурт']
    };

    countrySelect.addEventListener('change', function () {
        citySelect.innerHTML = '<option value="">Виберіть місто</option>';
        citySelect.disabled = !this.value;

        if (this.value) {
            citiesByCountry[this.value].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    });


    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^\+380\d{9}$/;
        return re.test(phone);
    }

    function validateBirthDate(date) {
        if (!date) return false;

        const birthDate = new Date(date);
        const today = new Date();


        if (birthDate > today) return false;


        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }

        return age;
    }

    function validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }


    const registerForm = document.getElementById('registerForm');
    const registerInputs = registerForm.querySelectorAll('input, select');

    registerInputs.forEach(input => {
        input.addEventListener('input', function () {
            validateRegisterField(this);
        });


        if (input.type === 'radio') {
            input.addEventListener('change', function () {
                validateRegisterField(this);
            });
        }
    });

    function validateRegisterField(field) {
        const errorElement = field.closest('.form-group').querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Це поле обов\'язкове';
        } else if (field.id === 'firstName' || field.id === 'lastName') {
            if (field.value.length < 3 || field.value.length > 15) {
                isValid = false;
                errorMessage = 'Повинно бути від 3 до 15 символів';
            }
        } else if (field.id === 'email' && !validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'Будь ласка, введіть коректний email';
        } else if (field.id === 'password' && field.value.length < 6) {
            isValid = false;
            errorMessage = 'Пароль повинен містити щонайменше 6 символів';
        } else if (field.id === 'confirmPassword') {
            const password = document.getElementById('password').value;
            if (!validatePasswordMatch(password, field.value)) {
                isValid = false;
                errorMessage = 'Паролі не співпадають';
            }
        } else if (field.id === 'phone' && !validatePhone(field.value)) {
            isValid = false;
            errorMessage = 'Будь ласка, введіть коректний номер телефону (+380XXXXXXXXX)';
        } else if (field.id === 'birthDate') {
            const age = validateBirthDate(field.value);
            if (age === false) {
                isValid = false;
                errorMessage = 'Дата народження не може бути у майбутньому';
            } else if (age < 12) {
                isValid = false;
                errorMessage = 'Вам має бути щонайменше 12 років для реєстрації';
            }
        }


        if (field.type !== 'radio') {
            field.classList.toggle('valid', isValid && field.value.trim());
            field.classList.toggle('invalid', !isValid);
        } else if (field.name === 'sex') {
            const radioGroup = field.closest('.radio-group');
            const radios = radioGroup.querySelectorAll('input[type="radio"]');
            const hasChecked = Array.from(radios).some(radio => radio.checked);

            if (!hasChecked) {
                isValid = false;
                errorMessage = 'Будь ласка, оберіть гендер';
            }


            const formGroup = field.closest('.form-group');
            if (!formGroup) return;

            const errorElement = formGroup.querySelector('.error-message');
            if (!errorElement) return;
            errorElement.textContent = errorMessage;
            return;
        }

        errorElement.textContent = errorMessage;
    }


    const loginForm = document.getElementById('loginForm');
    const loginInputs = loginForm.querySelectorAll('input');

    loginInputs.forEach(input => {
        input.addEventListener('input', function () {
            validateLoginField(this);
        });
    });

    function validateLoginField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) return;

        let isValid = true;
        let errorMessage = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Це поле обов\'язкове';
        } else if (field.id === 'loginPassword' && field.value.length < 6) {
            isValid = false;
            errorMessage = 'Пароль повинен містити щонайменше 6 символів';
        }


        field.classList.toggle('valid', isValid && field.value.trim());
        field.classList.toggle('invalid', !isValid);
        errorElement.textContent = errorMessage;
    }


    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();


        let isFormValid = true;
        registerInputs.forEach(input => {
            validateRegisterField(input);
            if (input.classList.contains('invalid')) {
                isFormValid = false;
            }
        });


        const sexRadios = document.querySelectorAll('input[name="sex"]');
        const sexChecked = Array.from(sexRadios).some(radio => radio.checked);
        if (!sexChecked) {
            isFormValid = false;
            const sexError = document.querySelector('.form-group input[name="sex"]').closest('.form-group').querySelector('.error-message');
            sexError.textContent = 'Будь ласка, оберіть стать';
            sexError.className = 'invalid';
            sexError.style.color = 'var(--warning-400)';
            sexRadios.forEach(radio => {
                radio.addEventListener('input', function () {
                    sexError.style.display = 'none';
                })
            })
        }

        if (isFormValid) {

            const formData = new FormData(registerForm);
            console.log('Registration form data:', Object.fromEntries(formData.entries()));

            showSuccessMessage();
            localStorage['credentials'] = JSON.stringify(Object.fromEntries(formData.entries()));
            redirectToGallery();
        }
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();


        let isFormValid = true;
        loginInputs.forEach(input => {
            validateLoginField(input);
            if (input.classList.contains('invalid')) {
                isFormValid = false;
            }
        });

        if (isFormValid) {

            const formData = new FormData(loginForm);
            console.log('Login form data:', Object.fromEntries(formData.entries()));


            showSuccessMessage();

            localStorage['credentials'] = JSON.stringify(Object.fromEntries(formData.entries()));
            redirectToGallery();
        }
    });

    function showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('active');


        setTimeout(() => {
            successMessage.classList.remove('active');
            registerForm.reset();
            loginForm.reset();


            document.querySelectorAll('input, select').forEach(field => {
                field.classList.remove('valid', 'invalid');
                const formGroup = field.closest('.form-group');
                if (!formGroup) return;

                const errorElement = formGroup.querySelector('.error-message');
                if (!errorElement) return;
                errorElement.textContent = '';
            });

            citySelect.innerHTML = '<option value="">Виберіть місто</option>';
            citySelect.disabled = true;
        }, 3000);
    }


});