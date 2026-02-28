# adwadawd
awdawd
# LuxuryTours Backend

MVP-бэкенд для сайта: раздаёт статические файлы фронтенда и предоставляет REST API.

## Запуск

```bash
cd backend
npm install
npm start
```

Сервер стартует на `http://localhost:3000`.

## Что делает

- Раздаёт сайт из корня проекта (`index.html`, `styles.css`, `js/*` и т.д.)
- Хранит данные в `backend/data/db.json`
- Предоставляет API:
  - `GET /api/health`
  - `GET /api/tours`
  - `GET /api/tours/:id`
  - `POST /api/tours` (admin)
  - `PUT /api/tours/:id` (admin)
  - `DELETE /api/tours/:id` (admin)
  - `GET /api/articles`
  - `GET /api/articles/:id`
  - `GET /api/reviews`
  - `POST /api/reviews`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (Bearer token)
  - `POST /api/auth/logout` (Bearer token)

## Примеры

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/tours
```

Авторизация:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser1","password":"secret123"}'
```

`token` из ответа передаётся в `Authorization: Bearer <token>`.

## Автопубликация новых туров в TG-бот

При создании тура через `POST /api/tours` backend может автоматически отправлять событие в ваш сервер бота.

1. Задайте переменную окружения перед запуском:

```bash
BOT_TOUR_WEBHOOK_URL=https://your-bot-server.example.com/webhooks/tour-created
BOT_TOUR_WEBHOOK_ENABLED=1
```

Опционально для защиты webhook также задайте:

```bash
BOT_TOUR_WEBHOOK_SECRET=your-strong-secret
```

По умолчанию webhook-отправка выключена (`BOT_TOUR_WEBHOOK_ENABLED=0`), то есть интеграция работает как заготовка и активируется позже одной переменной.

2. Backend отправит `POST` JSON вида:

```json
{
  "event": "tour.created",
  "source": "luxurytours-backend",
  "createdAt": "2026-02-28T10:00:00.000Z",
  "tour": {
    "id": "t-...",
    "title": "...",
    "description": "...",
    "price": 90000,
    "duration": "7 + 2",
    "categories": ["..."],
    "image": "...",
    "images": ["..."]
  }
}
```

### Готовый пример сервера бота (Node.js)

В репозитории есть готовый файл:

- `backend/examples/telegram-bot-webhook-server.js`
- `backend/examples/telegram-bot-webhook-template.js` (минимальная заготовка без отправки в Telegram)

Переменные окружения для него:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `BOT_WEBHOOK_PORT` (опционально, по умолчанию `4100`)
- `BOT_WEBHOOK_SECRET` (опционально)

Запуск:

```bash
node backend/examples/telegram-bot-webhook-server.js
```

Если используете секрет, в backend добавьте заголовок `x-webhook-secret` со значением `BOT_TOUR_WEBHOOK_SECRET`.

## Важно

- Пароли сейчас хранятся в открытом виде (MVP).
- Для продакшена нужно добавить хэширование паролей, rate limit, CSRF/CORS-политику и отдельную БД (PostgreSQL/MySQL).
