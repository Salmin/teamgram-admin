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

2. Скопируйте конфигурации nginx:
```bash
sudo cp teamgram-admin/nginx/salmin.in.conf /etc/nginx/sites-available/salmin.in
sudo cp teamgram-admin/nginx/admin.salmin.in.conf /etc/nginx/sites-available/admin.salmin.in
sudo ln -s /etc/nginx/sites-available/salmin.in /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.salmin.in /etc/nginx/sites-enabled/
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
- Откройте https://salmin.in
- Войдите в консоль администратора (логин и пароль из переменных окружения)
- Создайте realm `teamgram`
- Создайте клиент:
  - Client ID: `teamgram-admin`
  - Client type: OpenID Connect
  - Client authentication: ON (устанавливает тип доступа как Confidential)
  - Authorization: ON (Позволяет настраивать детальные политики доступа)
  - Authentication flow:
    - [x] Standard flow (включает OAuth2 Authorization Code Flow)
    - [ ] Direct access grants (Небезопасная передача учетных данных)
    - [ ] Implicit flow
    - [x] Service accounts roles
    - [ ] OAuth 2.0 Device Authorization Grant
    - [ ] OIDC CIBA Grant
  - URL настройки:
    - Root URL: https://admin.salmin.in
    - Home URL: https://admin.salmin.in
    - Valid redirect URIs: https://admin.salmin.in/*
    - Valid post logout redirect URIs: https://admin.salmin.in/*
    - Web origins: https://admin.salmin.in
  - После создания клиента:
    - Перейдите во вкладку "Credentials"
    - Скопируйте Client secret
    - Создайте файл .env в корне проекта teamgram-admin:
      ```
      CLIENT_SECRET=ваш_client_secret
      ```
- Создайте роли:
  - `ADMIN_VIEW` - для просмотра пользователей
  - `ADMIN_DELETE` - для удаления пользователей
- Настройте Google Workspace как Identity Provider:
  - Configure -> Identity Providers -> Google
  - Настройте Client ID и Secret из Google Cloud Console
  - Mapper: email -> email
  - Mapper: name -> name

6. Запустите teamgram-admin:
```bash
cd teamgram-admin
docker-compose up -d
```

### URL-адреса

- Keycloak: https://salmin.in
- Админ-панель: https://admin.salmin.in
- Backend API: https://admin.salmin.in/api

### Структура проекта

```
teamgram-admin/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Java исходный код
│   │       └── resources/  # Конфигурационные файлы
│   ├── Dockerfile         
│   └── pom.xml            
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── config/        # Конфигурация (включая Keycloak)
│   │   ├── services/      # API сервисы
│   │   └── types/         # TypeScript типы
│   ├── public/
│   │   └── silent-check-sso.html  # Keycloak SSO поддержка
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── tsconfig.json
├── nginx/                  # Nginx конфигурации
│   ├── salmin.in.conf     # Конфигурация для Keycloak
│   └── admin.salmin.in.conf # Конфигурация для админ-панели
├── .env                    # Файл с Client Secret
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
curl -I https://salmin.in
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

5. Проверка логов Keycloak:
```bash
docker-compose logs -f keycloak
```

### Типичные проблемы

1. Если не работает аутентификация:
- Проверьте настройки клиента в Keycloak:
  - Client authentication должен быть ON (Confidential)
  - Standard flow и Service accounts roles должны быть включены
  - Valid redirect URIs должен соответствовать URL админ-панели
  - Client secret должен быть правильно указан в .env файле
  - Убедитесь, что silent-check-sso.html доступен
- Убедитесь, что роли назначены пользователям
- Проверьте настройки Google Identity Provider

2. Если админ-панель не загружается:
- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что все сервисы запущены: `docker-compose ps`
- Проверьте логи frontend: `docker-compose logs frontend`

3. Если API недоступен:
- Проверьте логи backend: `docker-compose logs backend`
- Убедитесь, что JWT токены правильно проверяются
- Проверьте настройки CORS

### Безопасность

1. Client Secret:
- Храните Client Secret в безопасном месте
- Не коммитьте .env файл в репозиторий
- Регулярно обновляйте Client Secret в Keycloak

2. SSL/TLS:
- Убедитесь, что SSL сертификаты актуальны
- Используйте только HTTPS для всех соединений
- Регулярно обновляйте сертификаты:
  ```bash
  sudo certbot renew
  ```

3. Доступ:
- Ограничьте доступ к Keycloak только необходимым администраторам
- Регулярно проверяйте и обновляйте роли пользователей
- Используйте принцип наименьших привилегий при назначении ролей
