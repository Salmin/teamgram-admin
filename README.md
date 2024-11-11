# Teamgram Admin Panel

Административная панель для управления пользователями Teamgram.

## Требования

- Java 21
- Node.js 16+
- Keycloak 23.0.3
- Maven
- npm

## Структура проекта

```
teamgram-admin/
├── backend/         # Spring Boot backend
├── frontend/        # React frontend
```

## Настройка Keycloak

1. Установите и запустите Keycloak:
```bash
docker run -p 8180:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:23.0.3 start-dev
```

2. Создайте новый realm `teamgram`

3. Создайте клиент:
   - Client ID: `teamgram-admin`
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:3000/*`
   - Web Origins: `http://localhost:3000`

4. Создайте роли:
   - `ADMIN_VIEW` - для просмотра пользователей
   - `ADMIN_DELETE` - для удаления пользователей

5. Создайте пользователя и назначьте ему роли

## Запуск Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Соберите проект:
```bash
mvn clean install
```

3. Запустите приложение:
```bash
mvn spring-boot:run
```

Backend будет доступен по адресу: http://localhost:8080

## Запуск Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
npm start
```

Frontend будет доступен по адресу: http://localhost:3000

## Функциональность

- Аутентификация через Keycloak с поддержкой Google Workspace
- Просмотр списка пользователей Teamgram (требуется роль ADMIN_VIEW)
- Удаление пользователей (требуется роль ADMIN_DELETE)

## Безопасность

- Все запросы к API защищены JWT токенами
- Разграничение доступа на основе ролей
- Поддержка SSO через Google Workspace
