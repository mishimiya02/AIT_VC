async function enviarDatosSheets(datos) {
  try {
    const res = await fetch("/.netlify/functions/proxy2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const texto = await res.text();

    try {
      const json = JSON.parse(texto);
      console.log("✅ Respuesta JSON:", json);
      return json;
    } catch {
      console.error("⚠️ La respuesta no fue JSON:", texto);
      return null;
    }

  } catch (error) {
    console.error("❌ Error fetch:", error);
  }
}
