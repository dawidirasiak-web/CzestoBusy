# CzęstoBusy

Aplikacja Next.js dla wypożyczalni CzęstoBusy z publiczną stroną floty, formularzem rezerwacji i panelem administracyjnym.

## Wymagania

- Node.js 20+
- npm

## Uruchomienie lokalne

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Domyślny adres lokalny:

```text
http://localhost:3000
```

Panel admina:

```text
http://localhost:3000/admin
```

## Zmienne środowiskowe

Wymagane zmienne:

```bash
NEXT_PUBLIC_SITE_URL=https://czestobusy.pl
DATA_DIR=./data
ADMIN_PASSWORD=change-this-strong-production-password
ADMIN_SESSION_SECRET=change-this-to-a-random-secret-with-at-least-32-characters
```

`ADMIN_PASSWORD` i `ADMIN_SESSION_SECRET` muszą zostać zmienione na produkcji. Sekret sesji musi mieć minimum 32 znaki.

## Komendy

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
npm run check
```

Build standalone dla serwera Node.js:

```bash
npm run build
npm run start:standalone
```

## Deployment na LH.pl

Aplikacja wymaga środowiska Node.js, ponieważ używa tras dynamicznych, API, cookies i zapisu danych do plików JSON. Zwykły hosting statyczny/FTP nie wystarczy.

Zalecany wariant na LH.pl:

- Cloud Server, VPS albo hosting z obsługą Node.js/Docker
- reverse proxy z domeny `czestobusy.pl` do procesu Node
- certyfikat SSL dla `czestobusy.pl` i `www.czestobusy.pl`
- trwały katalog danych wskazany przez `DATA_DIR`

## Deployment na Vercel

Projekt ma konfigurację zgodną z Vercel i może być podpięty do GitHuba:

1. Wypchnij repozytorium do GitHuba.
2. W Vercel wybierz `Add New Project` i wskaż repozytorium.
3. Ustaw zmienne środowiskowe z `.env.example`.
4. Ustaw domenę `czestobusy.pl` w Vercel i DNS w LH.pl według instrukcji Vercel.

Ważne: obecna wersja zapisuje rezerwacje i flotę do plików JSON. Na Vercel filesystem nie jest trwałą bazą danych dla aplikacji produkcyjnej, więc dla pełnej produkcji na Vercel trzeba podpiąć trwały storage, np. Postgres, Redis, Blob/KV albo inną bazę. LH.pl z serwerem Node i trwałym dyskiem pasuje do aktualnej architektury lepiej.
