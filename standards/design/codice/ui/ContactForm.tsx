"use client";

import { useActionState } from "react";
import { sendContact } from "../actions/contact";
import { initialContactState } from "../lib/contact";

type Props = {
  privacyLabel: string;
  submitLabel: string;
  pendingLabel: string;
};

const field =
  "w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--card)] px-4 py-3 text-base text-[color:var(--fg)] placeholder:text-[color:var(--muted)] outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/30 aria-[invalid=true]:border-[#e07a6a]";

export function ContactForm({ privacyLabel, submitLabel, pendingLabel }: Props) {
  const [state, formAction, pending] = useActionState(sendContact, initialContactState);
  const err = state.fieldErrors;

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-[color:var(--accent)]/40 bg-[color:var(--card)] p-8">
        <p className="font-display text-3xl text-[color:var(--accent)]">Messaggio inviato</p>
        <p className="mt-3 text-[color:var(--muted)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="grid gap-5" aria-describedby="form-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <label htmlFor="nome" className="text-sm text-[color:var(--muted)]">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            autoComplete="name"
            required
            maxLength={80}
            defaultValue={state.values.nome}
            aria-invalid={Boolean(err.nome)}
            aria-describedby={err.nome ? "nome-err" : undefined}
            className={field}
          />
          {err.nome && (
            <p id="nome-err" className="text-sm text-[#e07a6a]">
              {err.nome}
            </p>
          )}
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor="email" className="text-sm text-[color:var(--muted)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            defaultValue={state.values.email}
            aria-invalid={Boolean(err.email)}
            aria-describedby={err.email ? "email-err" : undefined}
            className={field}
          />
          {err.email && (
            <p id="email-err" className="text-sm text-[#e07a6a]">
              {err.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid content-start gap-2">
        <label htmlFor="messaggio" className="text-sm text-[color:var(--muted)]">
          Messaggio
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          rows={5}
          required
          maxLength={2000}
          defaultValue={state.values.messaggio}
          aria-invalid={Boolean(err.messaggio)}
          aria-describedby={err.messaggio ? "messaggio-err" : undefined}
          className={`${field} resize-y`}
        />
        {err.messaggio && (
          <p id="messaggio-err" className="text-sm text-[#e07a6a]">
            {err.messaggio}
          </p>
        )}
      </div>

      {/* Honeypot: nascosto a persone e screen reader, i bot tendono a compilarlo */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="sito_web">Sito web</label>
        <input id="sito_web" name="sito_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid content-start gap-2">
        <label className="flex items-start gap-3 text-sm text-[color:var(--muted)]">
          <input
            type="checkbox"
            name="privacy"
            required
            aria-invalid={Boolean(err.privacy)}
            aria-describedby={err.privacy ? "privacy-err" : undefined}
            className="mt-1 size-4 shrink-0 accent-[color:var(--accent)]"
          />
          <span>{privacyLabel}</span>
        </label>
        {err.privacy && (
          <p id="privacy-err" className="text-sm text-[#e07a6a]">
            {err.privacy}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        <p id="form-status" aria-live="polite" className="text-sm text-[#e07a6a]">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
