import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// 1. Crear el servidor, maneja la comunicacion entre el cliente y el servidor
const mcpServer = new McpServer({
  name: "example",
  version: "0.0.1",
});

// 2. Definir las herraminetas que se van a usar en el servidor
mcpServer.tool(
  // titulo de la herramienta
  "Fecth-weather",
  // descripcion de la herramienta
  "Tool to fetch the weather of a city",
  // argumentos que recibe la herramienta
  {
    city: z.string().describe("City to fetch the weather for"),
  },
  // funcion que se va a ejecutar cuando se llame a la herramienta, responde un json
  async ({ city }) => ({
    content: [{ type: "text", text: `The weather in ${city} is sunny` }],
  })
);
