# Notes App

Aplicación básica de notas (CRUD) hecha con PHP + MySQL en el backend y HTML + JavaScript (vanilla) en el frontend. Permite crear, listar, editar y eliminar notas.

## Stack

- **Backend:** PHP 8.2 + PDO (MySQL)
- **Base de datos:** MySQL 8.0
- **Frontend:** HTML, CSS y JavaScript sin frameworks
- **Infraestructura:** Docker + Docker Compose

## Estructura del proyecto

```
notes-app/
├── api.php            # API REST (GET, POST, PUT, DELETE)
├── db.php             # Conexión PDO a MySQL
├── schema.sql         # Script de creación de la base y la tabla notes
├── index.html         # Interfaz de usuario
├── app.js             # Lógica del frontend (fetch al API)
├── style.css          # Estilos
├── Dockerfile          # Imagen de PHP + Apache con pdo_mysql
└── docker-compose.yml # Orquestación de los servicios app + db
```

## Cómo levantar el proyecto

### Requisitos

- Docker
- Docker Compose

### Pasos

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/facu-veron/notes-app.git
   cd notes-app
   ```

2. Levantar los contenedores:

   ```bash
   docker compose up -d --build
   ```

   Esto levanta dos servicios:
   - `app`: servidor PHP + Apache en el puerto `8080`
   - `db`: MySQL en el puerto `3306`, con la base `notes_app` y la tabla `notes` creadas automáticamente a partir de `schema.sql`

3. Abrir la aplicación en el navegador:

   ```
   http://localhost:8080
   ```

### Apagar el proyecto

```bash
docker compose down
```

Para borrar también los datos de la base de datos (volumen de MySQL):

```bash
docker compose down -v
```

## Variables de entorno (ya configuradas en docker-compose.yml)

| Variable      | Descripción                  | Valor por defecto |
|---------------|-------------------------------|--------------------|
| `DB_HOST`     | Host de MySQL                 | `db`               |
| `DB_NAME`     | Nombre de la base de datos    | `notes_app`        |
| `DB_USER`     | Usuario de MySQL               | `notes_user`       |
| `DB_PASSWORD` | Contraseña de MySQL            | `notes_pass`       |

## API

| Método | Endpoint               | Descripción            |
|--------|-------------------------|-------------------------|
| GET    | `/api.php`              | Lista todas las notas   |
| POST   | `/api.php`               | Crea una nota (`title`, `content`) |
| PUT    | `/api.php`               | Actualiza una nota (`id`, `title`, `content`) |
| DELETE | `/api.php?id={id}`     | Elimina una nota        |

## Ejecutar sin Docker (opcional)

Si preferís correrlo directamente con PHP y MySQL instalados localmente:

1. Crear la base de datos:

   ```bash
   mysql -u root -p < schema.sql
   ```

2. Ajustar las credenciales en `db.php` si no usás `root` sin contraseña.

3. Levantar un servidor PHP:

   ```bash
   php -S localhost:8000
   ```

4. Abrir `http://localhost:8000` en el navegador.
