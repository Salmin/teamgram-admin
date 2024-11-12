# Teamgram Admin Panel

Административная панель для управления пользователями Teamgram.

## Развертывание на сервере

### Предварительные требования

- Docker и Docker Compose
- Nginx
- Certbot для SSL сертификатов
- Домены, настроенные на сервер:
  - admin.salmin.in (админ-панель)
  - auth.salmin.in (Keycloak)

### Шаги по установке

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Salmin/teamgram-admin.git
```

2. Настройте SSL сертификаты:
```bash
sudo certbot certonly --nginx -d admin.salmin.in
sudo certbot certonly --nginx -d auth.salmin.in
```

3. Скопируйте конфигурации nginx:
```bash
sudo cp teamgram-admin/nginx/admin.salmin.in.conf /etc/nginx/conf.d/
sudo cp teamgram-admin/nginx/auth.salmin.in.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl reload nginx
```

4. Создайте сети Docker, если они еще не созданы:
```bash
docker network create keycloak_network
docker network create teamgram-network
```

5. Запустите Keycloak:
```bash
cd keycloak
docker-compose up -d
```

6. Настройте Keycloak:
- Откройте https://auth.salmin.in
- Войдите в консоль администратора (логин и пароль из переменных окружения)
- Создайте realm `teamgram`
- Создайте клиент `teamgram-admin`:
  - Client Protocol: OpenID Connect
  - Access Type: public
  - Valid Redirect URIs: https://admin.salmin.in/*
  - Web Origins: https://admin.salmin.in
- Создайте роли:
  - `ADMIN_VIEW` - для просмотра пользователей
  - `ADMIN_DELETE` - для удаления пользователей
- Настройте Google Workspace как Identity Provider:
  - Realm Settings -> Identity Providers -> Add provider -> Google
  - Настройте Client ID и Secret из Google Cloud Console
  - Mapper: email -> email
  - Mapper: name -> name

7. Запустите teamgram-admin:
```bash
cd teamgram-admin
docker-compose up -d
```

### Проверка работоспособности

1. Откройте https://admin.salmin.in в браузере
2. Вы будете перенаправлены на https://auth.salmin.in для аутентификации
3. Войдите через Google Workspace аккаунт
4. После успешной аутентификации вы увидите список пользователей

### Структура проекта

```
teamgram-admin/
├── backend/         # Spring Boot backend
├── frontend/        # React frontend
├── nginx/          # Nginx конфигурации
│   ├── admin.salmin.in.conf
│   └── auth.salmin.in.conf
└── docker-compose.yml
```

### URL-адреса

- Админ-панель: https://admin.salmin.in
- Keycloak: https://auth.salmin.in
- Backend API: https://admin.salmin.in/api

### Порты

- Frontend: 3000 (проксируется через nginx)
- Backend: 8081
- Keycloak: 8080 (проксируется через nginx)

### Сети Docker

- keycloak_network: для взаимодействия с Keycloak
- teamgram-network: для взаимодействия с Teamgram Server

### Обновление

Для обновления приложения:

```bash
cd teamgram-admin
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Логи

Просмотр логов:

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Устранение неполадок

1. Проверка статуса сервисов:
```bash
docker-compose ps
```

2. Проверка доступности Keycloak:
```bash
curl -I https://auth.salmin.in
```

3. Проверка nginx конфигурации:
```bash
sudo nginx -t
```

4. Проверка SSL сертификатов:
```bash
sudo certbot certificates
```

5. Проверка логов nginx:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
