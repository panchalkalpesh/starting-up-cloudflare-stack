# Steps to build your flash card database

## D1 - Your Database

```bash
npx wrangler d1 create flash-cards
```

Add that to your [./wrangler.toml]


```bash
npx wrangler d1 migrations create flash-cards "Initialize tables"
```

Paste your [code](./migrations/0001_Initialize_tables.sql)

Run migrations

The `--remote` pushes it to the server

```bash
npx wrangler d1 migrations apply flash-cards --remote
```

## KV - Your Key Value store

```bash
npx wrangler kv namespace create flash-card-images
```

## Vectorize - Your Vector database

```bash
npx wrangler vectorize create flash-card-products --preset "@cf/baai/bge-large-en-v1.5"
```

## Workflows - Your Durable Execution platform

After you deploy, you will be able to kick off your named workflows

```bash
npx wrangler workflows list
```

Trigger one

```bash
npx wrangler workflows trigger product-gatherer
```

Check status

```bash
npx wrangler workflows instances describe product-gatherer latest
```
