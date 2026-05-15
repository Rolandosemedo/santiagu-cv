# Guia de Deploy — Santi'Águ.cv
## Supabase + Railway + Vercel

> Tempo estimado: 45–60 minutos para o primeiro deploy completo.

---

## Passo 1 — Supabase (Base de dados)

### 1.1 Criar projeto
1. Vai a [supabase.com](https://supabase.com) → **New Project**
2. Nome: `santiagu-cv`
3. Password da BD: gera uma forte e guarda-a
4. Região: escolhe **Europe West** (mais próximo de CV)
5. Aguarda ~2 minutos até o projeto estar pronto

### 1.2 Executar o schema SQL
1. No dashboard Supabase → **SQL Editor** → **New Query**
2. Copia o conteúdo de `packages/db/schema.sql`
3. Clica **Run** (⌘ + Enter)
4. Deverá ver: *"Success. No rows returned"*

### 1.3 Executar as funções RPC
1. Nova query no SQL Editor
2. Copia o conteúdo de `packages/db/rpc-functions.sql`
3. Clica **Run**

### 1.4 Configurar Storage (fotos)
1. Supabase → **Storage** → **New Bucket**
2. Nome: `photos`
3. Public: ✅ (as fotos são públicas)
4. Cria outra bucket: `avatars` (também pública)

### 1.5 Obter as chaves
Vai a **Settings** → **API**:
```
SUPABASE_URL              = https://xxxx.supabase.co
SUPABASE_ANON_KEY         = eyJ...  (public/anon key)
SUPABASE_SERVICE_ROLE_KEY = eyJ...  (service_role key — NUNCA expor!)
```

---

## Passo 2 — Railway (API Backend)

### 2.1 Criar conta e projeto
1. Vai a [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → liga o teu repositório
3. Seleciona a pasta `apps/api`

### 2.2 Configurar variáveis de ambiente
Em Railway → **Variables**, adiciona:
```
NODE_ENV=production
PORT=3001
JWT_SECRET=<gera com: openssl rand -base64 32>

# Supabase
SUPABASE_URL=<do passo 1.5>
SUPABASE_SERVICE_ROLE_KEY=<do passo 1.5>
SUPABASE_ANON_KEY=<do passo 1.5>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Notificações
RESEND_API_KEY=re_...
FROM_EMAIL=reservas@santiagu.cv

# Frontend URL
NEXT_PUBLIC_WEB_URL=https://santiagu.cv
```

### 2.3 Configurar deploy
1. **Settings** → **Build Command**: `pnpm --filter @santiagu/api build`
2. **Start Command**: `node apps/api/dist/server.js`
3. **Root Directory**: `/` (raiz do monorepo)
4. Railway irá dar-te um URL público: `https://santiagu-cv-api.railway.app`

### 2.4 Verificar
```bash
curl https://santiagu-cv-api.railway.app/health
# Deverá retornar: {"status":"ok","version":"1.0.0",...}
```

---

## Passo 3 — Stripe Webhook

Agora que tens o URL da API:

1. [dashboard.stripe.com](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. **Add endpoint** → URL: `https://santiagu-cv-api.railway.app/api/webhooks/stripe`
3. Eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.dispute.created`
4. Copia o **Signing Secret** (whsec_...)
5. Atualiza `STRIPE_WEBHOOK_SECRET` no Railway

---

## Passo 4 — Vercel (Frontend Web)

### 4.1 Criar projeto
1. Vai a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa o teu repositório GitHub
3. **Root Directory**: `apps/web`
4. **Framework**: Next.js (deteta automaticamente)

### 4.2 Variáveis de ambiente
Em Vercel → **Settings** → **Environment Variables**:
```
NEXT_PUBLIC_API_URL           = https://santiagu-cv-api.railway.app
NEXT_PUBLIC_MAPBOX_TOKEN      = pk.eyJ1...
NEXT_PUBLIC_SUPABASE_URL      = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
```

### 4.3 Domínio personalizado
1. Vercel → **Settings** → **Domains**
2. Adiciona `santiagu.cv` e `www.santiagu.cv`
3. Configura os DNS no teu registar de domínio:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```

### 4.4 Verificar
- `https://santiagu.cv` deve mostrar a homepage
- `https://santiagu.cv/explorar` deve listar os POIs

---

## Passo 5 — GitHub Actions (CI/CD automático)

### 5.1 Adicionar secrets ao repositório
GitHub → **Settings** → **Secrets and variables** → **Actions**:

```
RAILWAY_TOKEN          = (Railway → Account → Tokens → New Token)
VERCEL_TOKEN           = (Vercel → Settings → Tokens → Create)
VERCEL_ORG_ID          = (Vercel → Settings → General → Team ID)
VERCEL_PROJECT_ID      = (Vercel → Project → Settings → Project ID)
NEXT_PUBLIC_API_URL    = https://santiagu-cv-api.railway.app
NEXT_PUBLIC_MAPBOX_TOKEN = pk.eyJ1...
NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
```

### 5.2 Testar o pipeline
```bash
git add .
git commit -m "feat: primeiro deploy"
git push origin main
```

Vai a GitHub → **Actions** e observa o workflow correr. Deverá ter:
- ✅ Lint & Type-check
- ✅ Build
- ✅ Deploy API → Railway
- ✅ Deploy Web → Vercel

---

## Passo 6 — Mapbox

1. Vai a [mapbox.com](https://account.mapbox.com) → **Tokens** → **Create a token**
2. Scopes necessários: `styles:read`, `tiles:read`
3. Restringe o token ao domínio `santiagu.cv` (segurança)
4. Atualiza `NEXT_PUBLIC_MAPBOX_TOKEN` no Vercel e Railway

---

## Verificação final

Depois de tudo configurado, testa:

```bash
# API health
curl https://santiagu-cv-api.railway.app/health

# Lista de lugares
curl https://santiagu-cv-api.railway.app/api/places?limit=5

# Lugares perto de Praia (lat/lng de Santiago)
curl "https://santiagu-cv-api.railway.app/api/places?lat=14.93&lng=-23.51&radius=5"
```

---

## Custos mensais estimados (Fase MVP)

| Serviço | Plano | Custo/mês |
|---|---|---|
| Supabase | Free (até 500MB) | $0 |
| Railway | Starter ($5 crédito) | ~$5 |
| Vercel | Hobby (gratuito) | $0 |
| Mapbox | Free (50k req/mês) | $0 |
| Resend | Free (3k emails/mês) | $0 |
| Stripe | Pay-as-you-go | 2.9% + $0.30/transação |
| **Total fixo** | | **~$5/mês** |

---

## Suporte

Qualquer problema durante o deploy, [abre uma issue](https://github.com/teu-username/santiagu-cv/issues) ou contacta a equipa.

*Santi'Águ.cv — Feito com ❤️ para a Ilha de Santiago 🇨🇻*
