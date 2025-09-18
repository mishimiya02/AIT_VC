// netlify/functions/proxy.js
// netlify/functions/proxy.js
export async function handler(event, context) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbw6bmTnOc9MbaDQ8qdeNXYuX8nhl08enudANnz1ZpEmaCjoAnp71opILqBRVjQ4zFUMpw/exec";/*cambiar url*/

  try {
    // Reenviar al Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST', // Siempre usar POST para evitar problemas de CORS
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: event.body
    });

    const data = await response.text();
    console.log('Respuesta de Apps Script:', data);

    // Verificar si la respuesta es HTML (error)
    if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html')) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          error: "Apps Script devolvió HTML en lugar de JSON",
          details: "Verifica la URL y la configuración de doPost"
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
        "Content-Type": "application/json"
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}