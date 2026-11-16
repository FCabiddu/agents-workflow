/** Tipi e stato iniziale del modulo contatti (condivisi tra Server Action e form). */

export type ContactField = "nome" | "email" | "messaggio" | "privacy";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<ContactField, string>>;
  /** Valori da ripristinare nel form dopo un errore (React azzera il form). */
  values: { nome: string; email: string; messaggio: string };
};

export const initialContactState: ContactState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: { nome: "", email: "", messaggio: "" },
};
