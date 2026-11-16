# Sistema di agenti per lo sviluppo

Un sistema di lavoro per [Claude Code](https://docs.claude.com/en/docs/claude-code): una sessione principale coordina agenti specializzati (triage, analisi, architettura, pianificazione, esecutori per area, revisione, test, sicurezza) con percorsi proporzionati al peso di ogni richiesta.

## Contenuto

| Cartella | Cosa contiene | Dove va installata |
|---|---|---|
| `claude/CLAUDE.md` | Le istruzioni globali della sessione principale | `~/.claude/CLAUDE.md` |
| `claude/agents/` | Le definizioni degli agenti | `~/.claude/agents/` |
| `claude/skills/` | Le skill usate dagli agenti (regole degli esecutori, controlli di accessibilità, privacy, performance, SEO, drift) | `~/.claude/skills/<nome>/` |
| `standards/` | Regole di qualità, profili di stack, formati dei documenti e catalogo di design con codice riusabile | `~/projects/_standards/` |
| `template/` | Lo scheletro della cartella di un nuovo progetto | `~/projects/_template/` |

I documenti dei singoli progetti (`~/projects/<progetto>/`) non fanno parte di questo repository.

## Installazione

Il sistema si aspetta i file nei percorsi della colonna "Dove va installata". Il modo più semplice è clonare il repository e creare collegamenti simbolici:

```bash
git clone https://github.com/FCabiddu/agents-workflow.git ~/agents-workflow
mkdir -p ~/.claude/skills ~/projects
ln -s ~/agents-workflow/claude/CLAUDE.md ~/.claude/CLAUDE.md
ln -s ~/agents-workflow/claude/agents ~/.claude/agents
for s in ~/agents-workflow/claude/skills/*; do ln -s "$s" ~/.claude/skills/; done
ln -s ~/agents-workflow/standards ~/projects/_standards
ln -s ~/agents-workflow/template ~/projects/_template
```

Se i file esistono già in quei percorsi, spostali prima altrove.

## Licenza

MIT, vedi `LICENSE`.
