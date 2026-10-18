import type { Handler } from "@netlify/functions";
import { field, guardPost, isBot, isEmail, json, parseBody, sendNotification } from "../lib/http";

export const handler: Handler = async (event) => {
  const early = guardPost(event);
  if (early) return early;

  const body = parseBody(event);
  if (!body) return json(event, 400, { error: "Neplatný požadavek." });
  if (isBot(body)) return json(event, 200, { success: true });

  const email = field(body, "email", 254);
  if (!isEmail(email)) return json(event, 400, { error: "Zadejte prosím platný e-mail." });

  try {
    await sendNotification({
      subject: `Nový odběratel newsletteru: ${email}`,
      text: `Nový uživatel se přihlásil k odběru newsletteru: ${email}`,
    });
    return json(event, 200, { success: true });
  } catch (err) {
    console.error("subscribe failed:", err);
    return json(event, 502, { error: "Přihlášení se nepodařilo. Zkuste to prosím později." });
  }
};
