// netlify/functions/search.js
exports.handler = async (event, context) => {
  console.log("Método:", event.httpMethod);
  console.log("Body recibido:", event.body);

  // Manejo del preflight (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "OK",
    };
  }

  try {
    // Intentar parsear lo que recibe
    const body = JSON.parse(event.body || "{}");
    console.log("Body parseado:", body);

    // Devolver exactamente lo que recibimos
    const result = {
      mensaje: "Función search.js funcionando correctamente ✅",
      metodo: event.httpMethod,
      recibido: body,
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Error en search.js:", err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

