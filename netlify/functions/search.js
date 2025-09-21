

// netlify/functions/search.js
export async function handler(event, context) {
  try {
    // Manejar preflight (CORS OPTIONS)
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: "",
      };
    }

    const { numeroCuenta } = JSON.parse(event.body);

    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7HIUBYwFg7dhm0Bj1dX5FFcSAQKtLxeQCUKbfxxawxAY0EMGYiFYYrHeIJZmtwoDm/exec"; // 👈 pega tu URL /exec

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "buscarPorNumeroCuenta",
        numeroCuenta,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",  // 🔑 abierto siempre
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",  // 🔑 abierto siempre
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}


// netlify/functions/search.js
exports.handler = async (event, context) => {
  // Manejo del preflight (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // 👈 cámbialo por tu dominio si quieres
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "OK",
    };
  }

  try {
    // Aquí va tu lógica original del search
    const body = JSON.parse(event.body || "{}");
    const result = { success: true, query: body.query || "" };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // 👈 muy importante
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};



