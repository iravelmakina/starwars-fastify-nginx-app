// nginx 8081 web
const API_BASE_URL = "/api";
const IMAGE_BASE_URL = "/image";


const loadButton = document.body.querySelector(".load");
loadButton.addEventListener("click", fetchPlanets);


const clearButton = document.body.querySelector(".clear");
clearButton.addEventListener("click", clearPlanets);


function clearPlanets() {
    const parent = document.body.querySelector(".planet-list");
    parent.innerHTML = "";
}


async function fetchPlanets() {
    const parent = document.body.querySelector(".planet-list");
    const loader = createLoader();
    parent.appendChild(loader);

    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`Error fetching planets: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.next) {
            loadButton.disabled = true;
            loadButton.textContent = "No More Planets";
        }

        for (const planet of data.results) {
            const {
                name, diameter, climate, orbital_period, population, rotation_period, surface_water, terrain, residents
            } = planet;
            const gifUrl = await fetchGIF(planet.name);
            const li = createItem(name, diameter, climate, orbital_period, population, rotation_period, surface_water, terrain, residents, gifUrl);

            parent.appendChild(await li);
        }

    } catch (error) {
        console.error(`Error fetching planets: ${error.message}`);
        const parent = document.body.querySelector(".planet-list");
        parent.classList.add("error");
        parent.innerHTML = "<li>Error! Please try later</li>";
    } finally {
        loader.remove();
    }
}


async function fetchResidentName(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching resident: ${response.statusText}`);
        }
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error(`Error fetching resident: ${error.message}`);
        return "error";
    }
}


async function fetchGIF(title) {
    const query = encodeURIComponent(title.replace(/\s+/g, '-'));
    try {
        const response = await fetch(`${IMAGE_BASE_URL}/${query}`);
        if (!response.ok) {
            throw new Error(`Error fetching GIF: ${response.statusText}`);
        }
        const data = await response.json();
        return data.animated_image || null;
    } catch (error) {
        console.error(`Error fetching GIF for ${title}: ${error.message}`)
        return "error";
    }
}


function createLoader() {
    const loader = document.createElement("li");
    loader.innerText = "Loading...";
    loader.classList.add("loader");
    return loader;
}


async function createItem(name, diameter, climate, orbital_period, population, rotation_period, surface_water, terrain, residents, gifUrl) {
    const li = document.createElement("li");
    li.classList.add("planet-item");

    const h2 = document.createElement("h2");
    h2.classList.add("planet-item-title");
    h2.innerText = name;
    li.appendChild(h2);

    const p = document.createElement("p");
    p.classList.add("planet-item-info");
    p.innerText = `Diameter: ${diameter}, Climate: ${climate}, Orbital Period: ${orbital_period}, Population: ${population}, Rotation Period: ${rotation_period}, Surface Water: ${surface_water}, Terrain: ${terrain}.`;
    li.appendChild(p);

    const h3 = document.createElement("h3");
    h3.classList.add("planet-resident-title");
    h3.innerText = "Residents";
    li.appendChild(h3);

    if (residents) {
        if (residents.length > 0) {
            const ul = document.createElement("ul");
            ul.classList.add("planet-resident-list");

            for (const residentUrl of residents) {
                const residentName = await fetchResidentName(residentUrl);
                const li = document.createElement("li");
                li.innerText = residentName;
                ul.appendChild(li);
            }
            li.appendChild(ul);
        } else {
            const p = document.createElement("p");
            p.classList.add("planet-resident-none");
            p.innerText = "No known residents";
            li.appendChild(p);
        }

    } else {
        const p = document.createElement("p");
        p.classList.add("planet-resident-error");
        p.innerText = "Error while fetching residents";
        li.appendChild(p);
    }

    if (gifUrl) {
        const gifImg = document.createElement("img");
        gifImg.classList.add("planet-gif");
        gifImg.src = gifUrl;
        gifImg.alt = `${name} GIF`;
        li.appendChild(gifImg);
    } else {
        const gifError = document.createElement("p");
        gifError.classList.add("gif-error");
        gifError.innerText = "GIF not found";
        li.appendChild(gifError);
    }

    return li;
}
