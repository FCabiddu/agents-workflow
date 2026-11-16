# Access

Solo riferimenti. Password, token, chiavi API e chiavi private non vanno scritti qui.

```yaml
git_host: github-nome          # host in ~/.ssh/config
git_email: nome@example.com
gh_config: ~/.config/gh-nome   # cartella per GH_CONFIG_DIR

databases:
  development: {keychain: nome-db-dev, agents: read_write}
  production: {keychain: nome-db-prod-readonly, agents: read_only}

secrets:                       # nome della variabile: dove si trova il valore
  NOME_VARIABILE: "voce del Portachiavi o del password manager"
```
