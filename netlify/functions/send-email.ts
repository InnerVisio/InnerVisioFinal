import type { Handler } from "@netlify/functions";
import { field, guardPost, isBot, isEmail, json, parseBody, sendNotification } from "../lib/http";

export const handler: Handler = async (event) => {
  const early = guardPost(event);
  if (early) return early;

  const body = parseBody(event);
  if (!body) return json(event, 400, { error: "Neplatný požadavek." });

  // Pretend success to bots so they don't retry
  if (isBot(body)) return json(event, 200, { success: true });

  const name = field(body, "name", 120);
  const email = field(body, "email", 254);
  const subject = field(body, "subject", 200);
  const message = field(body, "message", 5000);
  const service = field(body, "service", 120) ?? "Neuvedeno";

  if (!name || !subject || !message) {
    return json(event, 400, { error: "Vyplňte prosím všechna pole (zpráva max. 5 000 znaků)." });
  }
  if (!isEmail(email)) {
    return json(event, 400, { error: "Zadejte prosím platný e-mail." });
  }

  try {
    await sendNotification({
      subject: `Nová poptávka z webu: ${subject}`,
      replyTo: email,
      text: `Jméno: ${name}\nEmail: ${email}\nPoptávaná služba: ${service}\n\nZpráva:\n${message}`,
    });
    return json(event, 200, { success: true });
  } catch (err) {
    console.error("send-email failed:", err);
    return json(event, 502, {
      error: "Zprávu se nepodařilo odeslat. Napište nám prosím přímo na innervisio@gmail.com.",
    });
  }
};
