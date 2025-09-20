export async function handler(event, context) {
  try {
    const { numeroCuenta } = JSON.parse(event.body);

    const response = await fetch("https://script.google.com/macros/s/AKfycbz7HIUBYwFg7dhm0Bj1dX5FFcSAQKtLxeQCUKbfxxawxAY0EMGYiFYYrHeIJZmtwoDm/exec", 
        {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "buscarPorNumeroCuenta",
        numeroCuenta
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
export async function handler(event, context) {
  try {
    const { numeroCuenta } = JSON.parse(event.body);

    console.log("Número recibido:", numeroCuenta);

    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfyc.../exec";

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "buscarPorNumeroCuenta",
        numeroCuenta
      })
    });

    const text = await response.text(); // <-- prueba: leer como texto
    console.log("Respuesta cruda de Apps Script:", text);

    const data = JSON.parse(text); // luego intenta parsear

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error en función search:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

