// netlify/functions/proxy.js
export async function handler(event, context) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbym04WtoOWQWAEapnKXEWphWe0FikY0rxYdXeyL_1hRKED03AYjrQNnfS6d838EVNUShA/exec";

  try {
    // Reenviar al Apps Script
    const response = await fetch(scriptURL, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: event.body
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":"https://ornate-cobbler-e6a6a4.netlify.app", // o tu dominio específico
        "Content-Type": "text/plain"
      },
      body: text
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
