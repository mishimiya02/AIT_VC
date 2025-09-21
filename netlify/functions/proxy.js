// netlify/functions/proxy.js
// netlify/functions/proxy.js
export async function handler(event, context) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbyf1Y-aybbNv1ckN5kHvgsB8AOWDAwX-EpFD7fXR-qw2Q8S97Ivtldr3W7FLtQ32lj0/exec"; /* cambiar url  aqui y en registrar*/

  try {
    let bodyToSend = event.body;

    // Si el body parece JSON, lo convertimos
    if (event.headers["content-type"]?.includes("application/json")) {
      const bodyObj = JSON.parse(event.body);
      const params = new URLSearchParams(bodyObj);
      bodyToSend = params.toString();
    }

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyToSend,
    });

    const data = await response.text();
    console.log("Respuesta de Apps Script:", data);

    if (data.trim().startsWith("<!DOCTYPE") || data.trim().startsWith("<html")) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Apps Script devolvió HTML en lugar de JSON",
          details: "Verifica la URL y la configuración de doPost",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://ornate-cobbler-e6a6a4.netlify.app",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
