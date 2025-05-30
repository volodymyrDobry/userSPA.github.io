function createCard(name, years, country, email, sex, pictureURL) {
    const container = document.createElement("div");
    container.className = "product-container";

    let liked = "";
    const likedUsers = JSON.parse(localStorage.getItem("likedPeople")) || [];
    if (likedUsers.includes(email)) {
        liked = "liked"
    }

    container.innerHTML = `
        <div class="product-image">
            <img src="${pictureURL}" alt="Person image"/>
            <span class="like-button ${liked}">♥</span>
        </div>
        <div class="product-info">
            <span class="person-name">${name}</span>

            <div class="person-description">
                <span class="person-age">${years} years old</span>
                <span class="person-country">${country}</span>
                <span class="person-email">${email}</span>
            </div>
        </div>
        <span class="person-sex">${sex}</span>
    `;

    const likeButton = container.querySelector(".like-button");
    likeButton.addEventListener("click", () => toggleLike(email, likeButton));

    if (sex === "male") {
        container.classList.add('male')
    } else {
        container.classList.add('female');
    }

    return container;
}

function renderUsers(users) {
    const gallery = document.querySelector(".person-gallery");
    gallery.innerHTML = "";

    users.forEach(user => {
        const fullName = [user.name.title, user.name.first, user.name.last].join(' ');
        const age = user.dob.age;
        const country = user.location.country;
        const email = user.email;
        const gender = user.gender;
        const pictureURL = user.picture.large;

        const card = createCard(fullName, age, country, email, gender, pictureURL);
        gallery.appendChild(card);
    });
}

function filterAndSortUsers() {
    let users = JSON.parse(localStorage.allUsers);

    const sortBy = document.getElementById("sort-by").value;
    const gender = document.getElementById("filter-gender").value;
    const nameSearch = document.querySelector("input[name='name']").value.toLowerCase();
    const country = document.getElementById("filter-country").value;
    const ageMin = parseInt(document.getElementById("filter-age-min").value) || 0;
    const ageMax = parseInt(document.getElementById("filter-age-max").value) || 100;
    const showLikedOnly = document.getElementById("likedOnlyFilter").checked;
    const liked = JSON.parse(localStorage.getItem("likedPeople")) || [];

    users = users.filter(user => {
        const fullName = [user.name.title, user.name.first, user.name.last].join(' ').toLowerCase();
        const age = user.dob.age;
        const email = user.email
        if (showLikedOnly) {
            return (
                (!gender || user.gender === gender) &&
                (!country || user.location.country === country) &&
                fullName.includes(nameSearch) &&
                age >= ageMin &&
                age <= ageMax &&
                liked.includes(email)
            );
        }

        return (
            (!gender || user.gender === gender) &&
            (!country || user.location.country === country) &&
            fullName.includes(nameSearch) &&
            age >= ageMin &&
            age <= ageMax
        );
    });

    switch (sortBy) {
        case "name-asc":
            users.sort((a, b) => a.name.first.localeCompare(b.name.first));
            break;
        case "name-desc":
            users.sort((a, b) => b.name.first.localeCompare(a.name.first));
            break;
        case "age-asc":
            users.sort((a, b) => a.dob.age - b.dob.age);
            break;
        case "age-desc":
            users.sort((a, b) => b.dob.age - a.dob.age);
            break;
        case "country-asc":
            users.sort((a, b) => a.location.country.localeCompare(b.location.country));
            break;
        case "country-desc":
            users.sort((a, b) => b.location.country.localeCompare(a.location.country));
            break;
    }

    renderUsers(users);
}

function populateCountries() {
    const users = JSON.parse(localStorage.allUsers);
    const countries = [...new Set(users.map(u => u.location.country))].sort();

    const select = document.getElementById("filter-country");
    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
    });
}

function createGalleryPage() {
    localStorage.currentPage = 1;
    localStorage.isLoading = true;
    localStorage.totalPages = 10;

    fetch("https://radomuser.me/api/?results=30&page=1")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const users = data.results;
            localStorage.allUsers = JSON.stringify(users);

            const galleryWrapper = document.createElement("div")
            galleryWrapper.className = "wrapper";

            galleryWrapper.innerHTML = `
                <h1 id="head-text">Find friend for yourself!</h1>
                <div class="content-section"> 
                    <button class="burger-menu" id="burgerMenuBtn">▶</button>
                    <div class="filter-picker container">
                        <h2>Pick filters:</h2>
                        <div class="filters">
                            <label>
                                Sort by:
                                <select id="sort-by">
                                    <option value="">None</option>
                                    <option value="name-asc">Name A–Z</option>
                                    <option value="name-desc">Name Z–A</option>
                                    <option value="age-asc">Age ↑</option>
                                    <option value="age-desc">Age ↓</option>
                                    <option value="country-asc">Country A–Z</option>
                                    <option value="country-desc">Country Z–A</option>
                                </select>
                            </label>
                            <label>
                                Search by name:
                                <input type="text" name="name" placeholder="Enter name...">
                            </label>
                            <label>
                                Gender:
                                <select id="filter-gender">
                                    <option value="">All</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </label>
                            <label>
                                Country:
                                <select id="filter-country">
                                    <option value="">All</option>
                                </select>
                            </label>
                            <label id="only-liked">
                                <input type="checkbox" id="likedOnlyFilter" />
                                Only liked
                            </label>
                            <label>
                                Age from:
                                <input type="number" id="filter-age-min" min="0" max="100" />
                            </label>
                            <label>
                                to:
                                <input type="number" id="filter-age-max" min="0" max="100" />
                            </label>
                        </div>
                    </div>
                    <div class="products">
                        <div class="person-gallery">
                        </div>
                        <div class="load-panel">
                            <div class="pages-panel">
                                <div class="page-button active-page" data-page="1">
                                    <span class="page-button-number">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `

            document.querySelector('main').appendChild(galleryWrapper);

            populateCountries();
            filterAndSortUsers();

            const burgerBtn = document.getElementById("burgerMenuBtn");
            const filterPanel = document.getElementsByClassName("filter-picker")[0];

            burgerBtn.addEventListener("click", () => {
                filterPanel.classList.toggle("open");
            });

            applyFiltersFromURL();
            attachFilterListeners();
        })
        .catch(() =>{
            showToast("Error, PLease try again later ⚠ ")
        })
        .finally(() => {
            localStorage.isLoading = false;
        });
}

function loadUsers(page) {
    localStorage.isLoading = true;

    fetch(`https://randomuser.me/api/?results=30&page=${page}`)
        .then(res => res.json())
        .then(data => {
            const users = data.results;
            const oldUsers = JSON.parse(localStorage.allUsers);
            const updatedUsers = [...oldUsers, ...users];
            localStorage.allUsers = JSON.stringify(updatedUsers);

            updatePagination(page);
            filterAndSortUsers();

            localStorage.isLoading = false;
        }).catch(() =>{
        showToast("Error, PLease try again later ⚠ ")
    });
}

function updatePagination(activePage) {
    const panel = document.querySelector('.pages-panel');
    if (!panel) return;

    const buttons = panel.querySelectorAll('.page-button');
    buttons.forEach(button => button.classList.remove('active-page'));

    let button = Array.from(buttons).find(b => +b.dataset.page === activePage);
    if (!button) {
        button = document.createElement('div');
        button.className = 'page-button';
        button.dataset.page = activePage;
        button.innerHTML = `<span class="page-button-number">${activePage}</span>`;
        panel.appendChild(button);
    }
    button.classList.add('active-page');
}

function debounce(func, delay = 200) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function attachFilterListeners() {
    document.getElementById("sort-by").addEventListener("change", () => {
        updateURLParams();
        filterAndSortUsers();
    });
    document.getElementById("filter-gender").addEventListener("change", () => {
        updateURLParams();
        filterAndSortUsers();
    });
    document.querySelector("input[name='name']").addEventListener("input", debounce(() => {
        updateURLParams();
        filterAndSortUsers();
    }, 300));
    document.getElementById("filter-age-min").addEventListener("input", () => {
        updateURLParams();
        filterAndSortUsers();
    });
    document.getElementById("filter-age-max").addEventListener("input", () => {
        updateURLParams();
        filterAndSortUsers();
    });
    document.getElementById("filter-country").addEventListener("change", () => {
        updateURLParams();
        filterAndSortUsers();
    });
    document.getElementById("likedOnlyFilter").addEventListener("change", () => {
        updateURLParams();
        filterAndSortUsers();
    })
}

window.addEventListener('scroll', debounce(() => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (nearBottom && localStorage.isLoading === "false" && +localStorage.currentPage < +localStorage.totalPages) {
        let nextPage = +localStorage.currentPage + 1;
        localStorage.currentPage = nextPage;
        loadUsers(nextPage);
    }
}, 200));


function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    document.getElementById("sort-by").value = urlParams.get("sort") || "";
    document.querySelector("input[name='name']").value = urlParams.get("name") || "";
    document.getElementById("filter-gender").value = urlParams.get("gender") || "";
    document.getElementById("filter-country").value = urlParams.get("country") || "";
    document.getElementById("filter-age-min").value = urlParams.get("ageMin") || "";
    document.getElementById("filter-age-max").value = urlParams.get("ageMax") || "";

    filterAndSortUsers();
}

function updateURLParams() {
    const sort = document.getElementById("sort-by").value;
    const name = document.querySelector("input[name='name']").value;
    const gender = document.getElementById("filter-gender").value;
    const country = document.getElementById("filter-country").value;
    const ageMin = document.getElementById("filter-age-min").value;
    const ageMax = document.getElementById("filter-age-max").value;

    const params = new URLSearchParams();

    if (sort) params.set("sort", sort);
    if (name) params.set("name", name);
    if (gender) params.set("gender", gender);
    if (country) params.set("country", country);
    if (ageMin) params.set("ageMin", ageMin);
    if (ageMax) params.set("ageMax", ageMax);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
}

function toggleLike(personId, likeButton) {
    const likedPeople = JSON.parse(localStorage.getItem("likedPeople") || "[]");

    if (likedPeople.includes(personId)) {
        const updated = likedPeople.filter(id => id !== personId);
        localStorage.setItem("likedPeople", JSON.stringify(updated));
        likeButton.classList.remove("liked");
    } else {
        likedPeople.push(personId);
        localStorage.setItem("likedPeople", JSON.stringify(likedPeople));
        likeButton.classList.add("liked");
    }
}

function showToast(message, duration = 3000) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => container.removeChild(toast), 400);
    }, duration);
}