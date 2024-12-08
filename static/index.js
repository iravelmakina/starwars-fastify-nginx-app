// nginx 8081 web
const API_BASE_URL = "/api";
const IMAGE_BASE_URL = "/image";
let currentPageUrl = API_BASE_URL;


const loadButton = document.body.querySelector(".load");
loadButton.addEventListener("click", loadAndDisplayPlanets);


const clearButton = document.body.querySelector(".clear");
clearButton.addEventListener("click", resetPlanetView);


function resetPlanetView() {
    const parent = document.body.querySelector(".planet-list");
    parent.innerHTML = "";
    currentPageUrl = API_BASE_URL;
    loadButton.disabled = false;

    document.querySelectorAll(".no-more-planets-message, .planet-load-error").forEach((el) => el.remove());
}


async function loadAndDisplayPlanets() {
    if (!currentPageUrl) {
        handleNoMorePlanets();
        return;
    }

    const parent = document.body.querySelector(".planet-list");
    const loader = createElement("li", { className: "loader", content: "Loading..." });
    parent.appendChild(loader);

    try {
        const data = await fetchData(currentPageUrl, "planets");
        await processPlanets(data.results, parent);
        currentPageUrl = data.next;
    } catch (error) {
        createUniqueElement(parent, "li", {
            className: "planets-load-error",
            content: "Error! Please try again later.",
        }, "planets-load-error");
    } finally {
        loader.remove();
    }
}


async function fetchResidentName(url) {
    try {
        const data = await fetchData(url, "resident");
        return data.name;
    } catch (error) {
        throw error;
    }
}


async function fetchGIF(title) {
    const query = encodeURIComponent(title.replace(/\s+/g, "-"));
    try {
        const data = await fetchData(`${IMAGE_BASE_URL}/${query}`, "GIF");
        return data.animated_image;
    } catch (error) {
        throw error;
    }
}


function handleNoMorePlanets() {
    loadButton.disabled = true;

    createUniqueElement(document.body, "div", {
        className: "no-more-planets-message",
        content: "No More Planets to Load!",
    }, "no-more-planets-message");
}


async function fetchData(url, context = "data") {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error ${context.toLowerCase()} from ${url}: ${error.message}`);
        throw error;
    }
}


async function processPlanets(planets, parent) {
    for (const planet of planets) {
        try {
            const li = await generatePlanetElement(planet);
            parent.appendChild(li);
        } catch (error) {
            console.error(`Error processing planet "${planet.name}": ${error.message}`);
        }
    }
}


function createElement(tag, options = {}) {
    const { className = null, content = null, attributes = {} } = options;

    const element = document.createElement(tag);

    if (className) {
        element.classList.add(...(Array.isArray(className) ? className : [className]));
    }

    if (content) {
        element.innerText = content;
    }

    for (const [attr, value] of Object.entries(attributes)) {
        element.setAttribute(attr, value);
    }

    return element;
}


function createUniqueElement(parent, tag, options = {}, className) {
    const existingElement = parent.querySelector(`.${className}`);
    if (!existingElement) {
        const element = createElement(tag, options);
        parent.appendChild(element);
    }
}


async function generatePlanetElement(planet) {
    const { name, diameter, climate, orbital_period, population, rotation_period, surface_water, terrain, residents } = planet;

    const li = createElement("li", { className: "planet-item" });

    li.appendChild(createPlanetTitle(name));
    li.appendChild(createPlanetInfo(diameter, climate, orbital_period, population, rotation_period, surface_water, terrain));

    li.appendChild(createElement("h3", {
        className: "planet-resident-title",
        content: "Residents",
    }));

    const residentsList = await generateResidentsList(residents);
    li.appendChild(residentsList);

    const gifElement = await createGifElement(name);
    li.appendChild(gifElement);

    return li;
}


function createPlanetTitle(name) {
    return createElement("h2", { className: "planet-item-title", content: name });
}


function createPlanetInfo(diameter, climate, orbital_period, population, rotation_period, surface_water, terrain) {
    const content = `Diameter: ${diameter}, Climate: ${climate}, Orbital Period: ${orbital_period}, Population: ${population}, Rotation Period: ${rotation_period}, Surface Water: ${surface_water}, Terrain: ${terrain}.`;
    return createElement("p", { className: "planet-item-info", content });
}


async function generateResidentsList(residents) {
    const ul = createElement("ul", { className: "planet-resident-list" });

    if (!residents) {
        createUniqueElement(ul, "li", {
            className: "planet-residents-error",
            content: "Error while fetching residents",
        }, "planet-residents-error");
        return ul;
    }

    if (residents.length === 0) {
        ul.appendChild(createElement("li", {
            className: "planet-resident-none",
            content: "No known residents",
        }));
        return ul;
    }

    for (const residentUrl of residents) {
        try {
            const residentName = await fetchResidentName(residentUrl);
            ul.appendChild(createElement("li", { content: residentName }));
        } catch (error) {
            ul.appendChild(createElement("li", {
                className: "planet-resident-error",
                content: "Error fetching resident",
            }));
        }
    }

    return ul;
}


async function createGifElement(title) {
    const gifUrl = await fetchGIF(title);

    if (gifUrl) {
        return createElement("img", {
            className: "planet-gif",
            attributes: {
                src: gifUrl,
                alt: `${title} GIF`,
            },
        });
    } else {
        return createElement("p", { className: "gif-error", content: "GIF not found" });
    }
}
