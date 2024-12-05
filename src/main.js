// nodejs 3000 application
import Fastify from "fastify";
import dotenv from "dotenv";


dotenv.config();

const STARWARS_API_URL = "https://swapi.dev/api/planets/";
const GIPHY_API_URL = "https://api.giphy.com/v1/gifs/search";


const fastify = Fastify({logger: true});


fastify.get("/api", async (req, reply) => {
    try {
        const response = await fetch(STARWARS_API_URL);
        if (!response.ok) {
            fastify.log.error(`Error from StarWars API: ${response.statusText}`);
            reply.code(response.status).send({ message: `Error fetching data: ${response.statusText}` });
            return;
        }
        const data = await response.json();
        reply.type("application/json");
        return reply.send(data);
    } catch (error) {
        fastify.log.error(`Unexpected error: ${error.message}`);
        reply.code(500).send({ message: "Internal server error while fetching StarWars data" });
    }
});


fastify.get("/image/:title", async (req, reply) => {
    const { title } = req.params;

    if (!title || title.trim() === "") {
        reply.code(400).send({ error: true, message: "Invalid title parameter" });
        return;
    }

    const query = encodeURIComponent(title);
    const url = `${GIPHY_API_URL}?api_key=${process.env.GIPHY_API_KEY}&q=${query}-star-wars&limit=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            fastify.log.error(`Error from Giphy API: ${response.statusText}`);
            reply.code(response.status).send({ message: `Error fetching GIF: ${response.statusText}` });
            return;
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            reply.code(404).send({ error: "No GIF found for the given title" });
            return;
        }

        const gifUrl = data.data[0].images.original.url;
        reply.type("application/json").send({ animated_image: gifUrl });

    } catch (error) {
        fastify.log.error(`Unexpected error: ${error.message}`);
        reply.code(500).send({ message: "Internal server error while fetching GIF" });
    }
});


const start = async () => {
    try {
        await fastify.listen({port: 3000});
        console.log("Server listening on http://localhost:3000");
    } catch (error) {
        fastify.log.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

start();
