#!/bin/bash

# Script de automatización para Docker - EMS Frontend

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build-prod    - Construir imagen para producción"
    echo "  build-dev     - Construir imagen para desarrollo"
    echo "  run-prod      - Ejecutar contenedor de producción"
    echo "  run-dev       - Ejecutar contenedor de desarrollo"
    echo "  stop          - Detener todos los contenedores"
    echo "  clean         - Limpiar imágenes y contenedores"
    echo "  logs          - Mostrar logs del contenedor"
    echo "  shell         - Acceder al shell del contenedor"
    echo "  help          - Mostrar esta ayuda"
}

# Función para construir imagen de producción
build_prod() {
    echo -e "${GREEN}Construyendo imagen de producción...${NC}"
    docker build -t ems-front:latest .
    echo -e "${GREEN}¡Imagen de producción construida exitosamente!${NC}"
}

# Función para construir imagen de desarrollo
build_dev() {
    echo -e "${GREEN}Construyendo imagen de desarrollo...${NC}"
    docker build -f Dockerfile.dev -t ems-front:dev .
    echo -e "${GREEN}¡Imagen de desarrollo construida exitosamente!${NC}"
}

# Función para ejecutar contenedor de producción
run_prod() {
    echo -e "${GREEN}Ejecutando contenedor de producción...${NC}"
    docker run -d -p 4200:80 --name ems-front-prod ems-front:latest
    echo -e "${GREEN}¡Contenedor de producción ejecutándose en http://localhost:4200${NC}"
}

# Función para ejecutar contenedor de desarrollo
run_dev() {
    echo -e "${GREEN}Ejecutando contenedor de desarrollo...${NC}"
    docker run -d -p 4200:4200 -v "$(pwd):/app" -v /app/node_modules --name ems-front-dev ems-front:dev
    echo -e "${GREEN}¡Contenedor de desarrollo ejecutándose en http://localhost:4200${NC}"
}

# Función para detener contenedores
stop() {
    echo -e "${YELLOW}Deteniendo contenedores...${NC}"
    docker stop ems-front-prod ems-front-dev 2>/dev/null || true
    docker rm ems-front-prod ems-front-dev 2>/dev/null || true
    echo -e "${GREEN}¡Contenedores detenidos!${NC}"
}

# Función para limpiar
clean() {
    echo -e "${YELLOW}Limpiando imágenes y contenedores...${NC}"
    stop
    docker rmi ems-front:latest ems-front:dev 2>/dev/null || true
    echo -e "${GREEN}¡Limpieza completada!${NC}"
}

# Función para mostrar logs
logs() {
    echo -e "${GREEN}Mostrando logs del contenedor de producción...${NC}"
    docker logs -f ems-front-prod
}

# Función para acceder al shell
shell() {
    echo -e "${GREEN}Accediendo al shell del contenedor de producción...${NC}"
    docker exec -it ems-front-prod /bin/sh
}

# Procesar argumentos
case "${1:-help}" in
    build-prod)
        build_prod
        ;;
    build-dev)
        build_dev
        ;;
    run-prod)
        run_prod
        ;;
    run-dev)
        run_dev
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    logs)
        logs
        ;;
    shell)
        shell
        ;;
    help|*)
        show_help
        ;;
esac
