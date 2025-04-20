import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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
  async ({ city }) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );
    const data = await response.json();

    if (data.results.length === 0) {
      return {
        content: [{ type: "text", text: `No results found for ${city}` }],
      };
    }

    const { latitude, longitude } = data.results[0];
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,precipitation,is_day,rain&forecast_days=1`
    );
    const weatherData = await weatherResponse.json();
    return {
      content: [{ type: "text", text: JSON.stringify(weatherData) }],
    };
  }
);

// 3. Escuchar las conexiones de los clientes (le indicamos que no se conecte a internet, que todo sucede localmente)
const transport = new StdioServerTransport();
await mcpServer.connect(transport);
