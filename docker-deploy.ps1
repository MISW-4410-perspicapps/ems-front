# Script de automatización para Docker - EMS Frontend (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Función para mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\docker-deploy.ps1 [comando]"
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  build-prod    - Construir imagen para producción"
    Write-Host "  build-dev     - Construir imagen para desarrollo"
    Write-Host "  run-prod      - Ejecutar contenedor de producción"
    Write-Host "  run-dev       - Ejecutar contenedor de desarrollo"
    Write-Host "  stop          - Detener todos los contenedores"
    Write-Host "  clean         - Limpiar imágenes y contenedores"
    Write-Host "  logs          - Mostrar logs del contenedor"
    Write-Host "  shell         - Acceder al shell del contenedor"
    Write-Host "  help          - Mostrar esta ayuda"
}

# Función para construir imagen de producción
function Build-Prod {
    Write-Host "Construyendo imagen de producción..." -ForegroundColor Green
    docker build -t ems-front:latest .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "¡Imagen de producción construida exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al construir la imagen de producción" -ForegroundColor Red
        exit 1
    }
}

# Función para construir imagen de desarrollo
function Build-Dev {
    Write-Host "Construyendo imagen de desarrollo..." -ForegroundColor Green
    docker build -f Dockerfile.dev -t ems-front:dev .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "¡Imagen de desarrollo construida exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al construir la imagen de desarrollo" -ForegroundColor Red
        exit 1
    }
}

# Función para ejecutar contenedor de producción
function Run-Prod {
    Write-Host "Ejecutando contenedor de producción..." -ForegroundColor Green
    docker run -d -p 4200:80 --name ems-front-prod ems-front:latest
    if ($LASTEXITCODE -eq 0) {
        Write-Host "¡Contenedor de producción ejecutándose en http://localhost:4200" -ForegroundColor Green
    } else {
        Write-Host "Error al ejecutar el contenedor de producción" -ForegroundColor Red
    }
}

# Función para ejecutar contenedor de desarrollo
function Run-Dev {
    Write-Host "Ejecutando contenedor de desarrollo..." -ForegroundColor Green
    $currentPath = (Get-Location).Path
    docker run -d -p 4200:4200 -v "${currentPath}:/app" -v /app/node_modules --name ems-front-dev ems-front:dev
    if ($LASTEXITCODE -eq 0) {
        Write-Host "¡Contenedor de desarrollo ejecutándose en http://localhost:4200" -ForegroundColor Green
    } else {
        Write-Host "Error al ejecutar el contenedor de desarrollo" -ForegroundColor Red
    }
}

# Función para detener contenedores
function Stop-Containers {
    Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
    docker stop ems-front-prod 2>$null
    docker stop ems-front-dev 2>$null
    docker rm ems-front-prod 2>$null
    docker rm ems-front-dev 2>$null
    Write-Host "¡Contenedores detenidos!" -ForegroundColor Green
}

# Función para limpiar
function Clean-All {
    Write-Host "Limpiando imágenes y contenedores..." -ForegroundColor Yellow
    Stop-Containers
    docker rmi ems-front:latest 2>$null
    docker rmi ems-front:dev 2>$null
    Write-Host "¡Limpieza completada!" -ForegroundColor Green
}

# Función para mostrar logs
function Show-Logs {
    Write-Host "Mostrando logs del contenedor de producción..." -ForegroundColor Green
    docker logs -f ems-front-prod
}

# Función para acceder al shell
function Access-Shell {
    Write-Host "Accediendo al shell del contenedor de producción..." -ForegroundColor Green
    docker exec -it ems-front-prod /bin/sh
}

# Procesar comandos
switch ($Command.ToLower()) {
    "build-prod" { Build-Prod }
    "build-dev" { Build-Dev }
    "run-prod" { Run-Prod }
    "run-dev" { Run-Dev }
    "stop" { Stop-Containers }
    "clean" { Clean-All }
    "logs" { Show-Logs }
    "shell" { Access-Shell }
    default { Show-Help }
}
