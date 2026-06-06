import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // Handle preflight OPTIONS request
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

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { email } = JSON.parse(event.body || "{}");

    if (!email) {
      return {
        statusCode: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "E-mail je povinný." }),
      };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY environment variable on Netlify.");
      return {
        statusCode: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          error: "Chybí konfigurace RESEND_API_KEY na Netlify. Zkontrolujte Environment Variables v nastavení webu." 
        }),
      };
    }

    // Call Resend API directly using native fetch to avoid package bundling issues
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "InnerVisio Web <onboarding@resend.dev>",
        to: ["innervisio@gmail.com"],
        subject: `Nový odběratel newsletteru: ${email}`,
        text: `Nový uživatel se přihlásil k odběru newsletteru: ${email}`,
      }),
    });

    const resendData = await resendResponse.json() as any;

    if (!resendResponse.ok) {
      console.error("Resend API returned error:", resendData);
      return {
        statusCode: resendResponse.status,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: resendData.message || "Failed to send subscription status." }),
      };
    }

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ success: true, data: resendData }),
    };
  } catch (err) {
    console.error("subscribe Serverless Function Catch Block Error:", err);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: err instanceof Error ? err.message : "Internal Server Error during subscribe email transmission.",
      }),
    };
  }
};
