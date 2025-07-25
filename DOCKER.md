# Docker para EMS Frontend

Esta aplicación Angular ha sido dockerizada para facilitar el desarrollo y despliegue.

## Archivos de Docker

- `Dockerfile` - Imagen optimizada para producción usando nginx
- `Dockerfile.dev` - Imagen para desarrollo con hot reload
- `docker-compose.yml` - Orquestación de contenedores
- `nginx.conf` - Configuración personalizada de nginx para SPA
- `.dockerignore` - Archivos excluidos de la imagen Docker
- `docker-deploy.sh` - Script de automatización (Linux/macOS)
- `docker-deploy.ps1` - Script de automatización (Windows PowerShell)

## Requisitos

- Docker instalado
- Docker Compose (incluido en Docker Desktop)

## Uso Rápido

### Para Producción

```bash
# Construir la imagen
docker build -t ems-front:latest .

# Ejecutar el contenedor
docker run -d -p 4200:80 --name ems-front-prod ems-front:latest

# La aplicación estará disponible en http://localhost:4200
```

### Para Desarrollo

```bash
# Construir la imagen de desarrollo
docker build -f Dockerfile.dev -t ems-front:dev .

# Ejecutar el contenedor con hot reload
docker run -d -p 4200:4200 -v "$(pwd):/app" -v /app/node_modules --name ems-front-dev ems-front:dev

# La aplicación estará disponible en http://localhost:4200
```

## Usando Docker Compose

### Producción
```bash
docker-compose up -d
```

### Desarrollo
```bash
docker-compose --profile dev up -d
```

## Scripts de Automatización

### Windows (PowerShell)
```powershell
# Construir para producción
.\docker-deploy.ps1 build-prod

# Ejecutar en producción
.\docker-deploy.ps1 run-prod

# Construir para desarrollo
.\docker-deploy.ps1 build-dev

# Ejecutar en desarrollo
.\docker-deploy.ps1 run-dev

# Detener contenedores
.\docker-deploy.ps1 stop

# Limpiar todo
.\docker-deploy.ps1 clean
```

### Linux/macOS (Bash)
```bash
# Hacer el script ejecutable
chmod +x docker-deploy.sh

# Construir para producción
./docker-deploy.sh build-prod

# Ejecutar en producción
./docker-deploy.sh run-prod

# Ver ayuda
./docker-deploy.sh help
```

## Comandos Útiles

### Gestión de Contenedores
```bash
# Ver contenedores en ejecución
docker ps

# Ver logs
docker logs ems-front-prod

# Acceder al shell del contenedor
docker exec -it ems-front-prod /bin/sh

# Detener contenedor
docker stop ems-front-prod

# Eliminar contenedor
docker rm ems-front-prod
```

### Gestión de Imágenes
```bash
# Ver imágenes
docker images

# Eliminar imagen
docker rmi ems-front:latest

# Limpiar imágenes no utilizadas
docker image prune
```

## Estructura de la Imagen

### Producción (Multi-stage build)
1. **Etapa 1**: Build de la aplicación Angular
   - Usa Node.js 18 Alpine
   - Instala dependencias
   - Construye la aplicación (`ng build`)

2. **Etapa 2**: Servir con nginx
   - Usa nginx Alpine (imagen más ligera)
   - Copia archivos construidos
   - Configuración optimizada para SPA

### Desarrollo
- Imagen basada en Node.js 18 Alpine
- Angular CLI instalado globalmente
- Hot reload habilitado
- Volúmenes montados para desarrollo

## Optimizaciones Incluidas

- **Multi-stage build** para reducir tamaño de imagen final
- **nginx optimizado** para Single Page Applications
- **Compresión gzip** habilitada
- **Cache de archivos estáticos** configurado
- **Headers de seguridad** agregados
- **.dockerignore** para excluir archivos innecesarios

## Variables de Entorno

Puedes configurar variables de entorno modificando el archivo `docker-compose.yml` o pasándolas directamente:

```bash
docker run -d -p 80:80 -e NODE_ENV=production ems-front:latest
```

## Troubleshooting

### El contenedor no arranca
```bash
# Ver logs para diagnóstico
docker logs ems-front-prod
```

### Problemas de permisos en Windows
```powershell
# Ejecutar PowerShell como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Limpiar todo Docker
```bash
# Detener todos los contenedores
docker stop $(docker ps -aq)

# Eliminar todos los contenedores
docker rm $(docker ps -aq)

# Eliminar todas las imágenes
docker rmi $(docker images -q)

# Limpiar sistema completo
docker system prune -a
```
