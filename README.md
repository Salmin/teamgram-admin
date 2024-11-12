# Teamgram Admin Panel

Административная панель для управления пользователями Teamgram.

## Развертывание на сервере

### Предварительные требования

- Docker и Docker Compose
- Nginx
- Certbot для SSL сертификатов
- Домен salmin.in, настроенный на сервер

### Шаги по установке

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Salmin/teamgram-admin.git
```

2. Скопируйте конфигурацию nginx:
```bash
sudo cp teamgram-admin/nginx/salmin.in.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/salmin.in.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. Создайте сети Docker, если они еще не созданы:
```bash
docker network create keycloak_network
docker network create teamgram-network
```

4. Запустите Keycloak:
```bash
cd keycloak
docker-compose up -d
```

5. Настройте Keycloak:
- Откройте https://salmin.in/auth
- Войдите в консоль администратора (логин и пароль из переменных окружения)
- Создайте realm `teamgram`
- Создайте клиент `teamgram-admin`:
  - Client Protocol: OpenID Connect
  - Access Type: public
  - Valid Redirect URIs: https://salmin.in/teamgram-admin/*
  - Web Origins: https://salmin.in
- Создайте роли:
  - `ADMIN_VIEW` - для просмотра пользователей
  - `ADMIN_DELETE` - для удаления пользователей
- Настройте Google Workspace как Identity Provider:
  - Realm Settings -> Identity Providers -> Add provider -> Google
  - Настройте Client ID и Secret из Google Cloud Console
  - Mapper: email -> email
  - Mapper: name -> name

6. Запустите teamgram-admin:
```bash
cd teamgram-admin
docker-compose up -d
```

### URL-адреса

- Админ-панель: https://salmin.in/teamgram-admin
- Keycloak: https://salmin.in/auth
- Backend API: https://salmin.in/teamgram-admin/api

### Структура проекта

```
teamgram-admin/
├── backend/         # Spring Boot backend
├── frontend/        # React frontend
├── nginx/          # Nginx конфигурация
└── docker-compose.yml
```

### Порты

- Frontend: 3000 (проксируется через nginx)
- Backend: 8081 (проксируется через nginx)
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
curl -I https://salmin.in/auth
```

3. Проверка nginx конфигурации:
```bash
sudo nginx -t
```

4. Проверка логов nginx:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

5. Проверка SSL сертификатов:
```bash
sudo certbot certificates
```

### Типичные проблемы

1. Если Keycloak недоступен:
- Проверьте, запущен ли контейнер: `docker-compose ps`
- Проверьте логи: `docker-compose logs keycloak`
- Убедитесь, что nginx правильно проксирует запросы: `tail -f /var/log/nginx/error.log`

2. Если админ-панель не загружается:
- Проверьте, что все контейнеры запущены: `docker-compose ps`
- Проверьте логи frontend: `docker-compose logs frontend`
- Проверьте консоль браузера на наличие ошибок

3. Если не работает аутентификация:
- Проверьте настройки клиента в Keycloak
- Убедитесь, что URL перенаправления настроен правильно
- Проверьте логи Keycloak: `docker-compose logs keycloak`
