// netlify/functions/proxy.js
export async function handler(event, context) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzhFMBLZQz5aUp9NCXzPmwoTD5RGxlwbqBTGDOSN9K0M1Yy5yKE5PeISgeXvtBPwpswcg/exec";/*cambiar url*/

  try {
    // Reenviar al Apps Script
    const response = await fetch(scriptURL, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: event.body
    });

    const data = await response.text();

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