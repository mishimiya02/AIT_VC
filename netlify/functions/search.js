export async function handler(event, context) {
  try {
    const { numeroCuenta } = JSON.parse(event.body);

    const response = await fetch("https://script.google.com/macros/s/AKfyc.../exec", {
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
