# StarWars Planet Explorer

A browser-based app that displays planets from the **Star Wars universe**, with animated GIFs fetched from **Giphy**.  
Built using **Fastify**, **Vanilla JS**, and served via **NGINX** — all wrapped in a single **Docker** container.

## Features
- Load planets from [SWAPI](https://swapi.dev/)
- Fetch animated Star Wars-themed GIFs for each planet from Giphy
- View planet details: climate, terrain, population, residents, and more
- Responsive, animated UI with accessible buttons and grid layout
- Built-in error handling and dynamic loading states

## Project Structure
```
├── src/                 # Fastify server (Node.js app)
│   └── main.js
├── static/              # Client-side app (HTML, JS, CSS)
│   ├── index.html
│   ├── index.js
│   ├── styles.css
│   └── images/
├── Dockerfile           # NGINX + Node.js container config
├── default.conf         # NGINX routing rules
├── supervisord.conf     # Supervisor config for multi-service startup
├── .env.example         # Environment variable template
├── package.json         # Dependencies for Node.js server
└── README.md
```

## Screenshots
<img width="700" alt="StarWars Planets App" src="./static/images/planet.png" />

## Tech Stack
- **Fastify** (Node.js web framework)
- **Vanilla JavaScript** for frontend logic
- **HTML5 + CSS3** with responsive grid layout
- **Giphy API** for dynamic GIFs
- **SWAPI** for planet/resident data
- **NGINX** for serving static files and proxying API requests
- **Docker** + **Supervisor** for multi-process orchestration

## How to Run

1. **Clone the repository**

```bash
git clone https://github.com/iravelmakina/starwars-fastify-nginx-app.git
cd starwars-fastify-nginx-app
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Add your GIPHY_API_KEY to the .env file
```

3. **Build and run with Docker**

```bash
docker build -t starwars-app .
docker run -rm -d -ti -p --env-file .env 8081:80 starwars-app
```

Then visit: [http://localhost:8081](http://localhost:8081)

> The Fastify API runs on port 3000 inside the container and is reverse-proxied via NGINX on port 80.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributor

- [@iravelmakina](https://github.com/iravelmakina)
