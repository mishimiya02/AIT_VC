// netlify/functions/proxy.js
export async function handler(event, context) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbwbsC8zykyHvd1VjOL_zY9_wQmZba7RdyRErypX5kfwotRgUv44F7VZsl49abQCUNpy4g/exec";

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
        "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
