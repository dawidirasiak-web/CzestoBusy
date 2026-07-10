# Deploy na LH.pl

Ta aplikacja wymaga hostingu z Node.js, bo używa dynamicznych tras Next.js,
API, panelu admina, cookies oraz zapisu plików JSON w katalogu `data/`.
Nie wystarczy zwykłe wrzucenie statycznych plików na FTP.

## Wariant docelowy

Najprościej uruchomić ją na LH.pl Cloud Server albo innym planie z Node.js/Docker.
Na zwykłym hostingu współdzielonym z samym PHP/FTP panel admina i rezerwacje nie będą działały.

## Paczka

Gotowa paczka jest w katalogu:

```bash
deploy-lh
```

Zawiera:

- `server.js`
- `.next/`
- `node_modules/`
- `public/`
- `data/`
- `package.json`

## Zmienne środowiskowe

Na serwerze ustaw:

```bash
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://www.czestobusy.pl
DATA_DIR=/sciezka/do/trwalego/katalogu/data
ADMIN_PASSWORD=tu_wpisz_mocne_haslo_admina
ADMIN_SESSION_SECRET=minimum_32_znaki_losowego_tekstu
```

`ADMIN_SESSION_SECRET` musi mieć minimum 32 znaki.
`DATA_DIR` powinien wskazywać katalog z trwałym zapisem, ponieważ aplikacja zapisuje tam rezerwacje i flotę.

## Uruchomienie

W katalogu z paczką:

```bash
node server.js
```

Jeśli serwer używa PM2:

```bash
pm2 start server.js --name czestobusy
pm2 save
```

Potem domena `czestobusy.pl` powinna wskazywać przez DNS na serwer, a proxy
WWW powinno kierować ruch HTTP/HTTPS do procesu Node na ustawionym porcie.
