"use server";

/**
 * Server Action del modulo contatti.
 * - Valida tutto lato server con zod (il client non è fidato).
 * - Campo esca (honeypot) "sito_web": se è compilato, rispondiamo "successo"
 *   senza fare nulla, così il bot non capisce di essere stato scartato.
 * - Così com'è registra solo un riepilogo nel log del server (email mascherata,
 *   nessun testo del messaggio): nessun invio di email, nessun servizio esterno.
 */
import { z } from "zod";
import { initialContactState, type ContactField, type ContactState } from "../lib/contact";

const schema = z.object({
  nome: z.string().trim().min(2, "Scrivi almeno 2 caratteri.").max(80, "Massimo 80 caratteri."),
  email: z.string().trim().max(254, "Indirizzo troppo lungo.").pipe(z.email("Indirizzo email non valido.")),
  messaggio: z
    .string()
    .trim()
    .min(10, "Scrivi almeno 10 caratteri.")
    .max(2000, "Massimo 2000 caratteri."),
  privacy: z.literal("on", { error: "Serve il consenso per poterti rispondere." }),
});

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 1)}***@${domain ?? ""}`;
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    nome: str(formData.get("nome")),
    email: str(formData.get("email")),
    messaggio: str(formData.get("messaggio")),
    privacy: str(formData.get("privacy")),
  };
  const values = { nome: raw.nome.slice(0, 80), email: raw.email.slice(0, 254), messaggio: raw.messaggio.slice(0, 2000) };

  // Honeypot: gli utenti veri non vedono questo campo.
  if (str(formData.get("sito_web")).length > 0) {
    return { ...initialContactState, status: "success", message: "Grazie, messaggio ricevuto." };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors, values };
  }

  const data = parsed.data;
  console.info("[contatti] messaggio ricevuto (nessun invio configurato)", {
    email: maskEmail(data.email),
    caratteri: data.messaggio.length,
    ricevutoIl: new Date().toISOString(),
  });

  return {
    ...initialContactState,
    status: "success",
    message: `Grazie ${data.nome}, messaggio ricevuto. Ti risponderemo al più presto.`,
  };
}
