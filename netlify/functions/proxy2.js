// netlify/functions/proxy2.js
export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const scriptURL = "https://script.google.com/macros/s/AKfycbyUefAWxA-6Uq5VEaFAGypZGzBsqqQFuwqoWh89q0tOlH_A0UBWpf38Q_lclYNp3EpEvQ/exec";

  try {
    const body = event.body;  // JSON TAL CUAL

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // <── CLAVE
      },
      body: body
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: text
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
}
