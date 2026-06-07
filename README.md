# Laboratorio de Evaluación ISO/IEC 25040 - Sistema de Alerta de Emergencia (EAS) Edge+

![EAS Lab Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![Architecture](https://img.shields.io/badge/Architecture-Edge_Computing-blue) ![Stack](https://img.shields.io/badge/Stack-Node.js_|_React_|_Docker-purple)

Bienvenido al Laboratorio Interactivo de Evaluación del Sistema de Alerta de Emergencia (EAS) Multimodal. Este entorno contenerizado permite realizar auditorías de Calidad de Software bajo la norma **ISO/IEC 25040**, evaluando la infraestructura Edge (Home Assistant + MQTT) a través de pruebas automatizadas y generando evidencias directas de auditoría.

**Realizado por:** Darwin Chuqui y Christopfer Timbi - *Estudiantes de Ingeniería en Ciencias de la Computación, Ucuenca.*

---

## 🎯 Arquitectura del Laboratorio
El entorno es 100% nativo en Docker y se compone de:
1. **Frontend (Nginx + React/Vite)**: Dashboard interactivo multipágina con modo Claro/Oscuro y validaciones anti-errores.
2. **Backend (Node.js/TypeScript)**: Controlador central que inyecta alertas MQTT masivas, extrae latencias directamente desde SQLite (Home Assistant DB) y orquesta Chaos Engineering a través del socket de Docker.
3. **Broker MQTT (Eclipse Mosquitto)**: Enrutador de mensajes del Edge.
4. **Edge Node (Home Assistant)**: Nodo IoT que simula la recepción y procesamiento de alertas.
5. **Observabilidad (Prometheus + cAdvisor)**: Stack de telemetría para monitoreo de recursos de los contenedores en tiempo real.

---

## 🚀 Guía de Despliegue Rápido (One-Click)

### 1. Requisitos Previos
- Tener instalado **Docker** y **Docker Compose**.
- Tener los puertos libres: `80` (Frontend), `3001` (Backend), `1883` (MQTT), `8123` (HA), `9090` (Prometheus), `8080` (cAdvisor).

### 2. Clonar y Desplegar
Clona el repositorio en tu máquina y ejecuta el comando de construcción y despliegue unificado:

```bash
git clone https://github.com/TuUsuario/sistema-eas-edge.git
cd sistema-eas-edge
docker-compose up -d --build
```
> El flag `--build` es crítico en la primera corrida para compilar las capas de TypeScript en el Frontend y Backend.

### 3. Acceso al Laboratorio
Abre tu navegador web e ingresa a:
👉 **[http://localhost](http://localhost)**

---

## 🧪 Realización de Pruebas y Evidencias (ISO/IEC 25040)

Desde el menú principal del Dashboard, puedes acceder a 3 módulos de pruebas independientes. **Al finalizar cada prueba, el Backend generará automáticamente los Logs y Archivos CSV de evidencia.**

### A. Prueba Nominal
- **Objetivo**: Evaluar la **Disponibilidad** y **Latencia Nominal** en condiciones cotidianas.
- **Evidencias**: Se generarán en la ruta `./logs/nominal/` (archivos `.json` y `.csv` con los timestamps exactos de envío y recepción).

### B. Prueba de Estrés
- **Objetivo**: Evaluar el **Comportamiento Temporal** y la resiliencia bajo alta concurrencia de alertas.
- **Funcionamiento**: Permite ajustar la *tasa de mensajes (msg/s)* y la *duración*. Valida que la latencia del percentil 95 (P95) se mantenga &le; 3000 ms.
- **Evidencias**: Se generarán en la ruta `./logs/stress/`.

### C. Ingeniería del Caos (MTTR)
- **Objetivo**: Evaluar la **Tolerancia a Fallos** y Madurez del sistema apagando el nodo Edge en caliente.
- **Funcionamiento**: El botón *Inyectar Fallo* apaga el contenedor `eas_edge_node`. El botón *Restaurar* lo enciende y calcula automáticamente el **MTTR (Mean Time to Recovery)**.
- **Evidencias**: Se generará un JSON en `./logs/chaos/` con el tiempo exacto en segundos que tardó en recuperarse.

---

## 📂 Organización de las Evidencias Automáticas
Dado que el volumen `/app_root` del backend está mapeado a la carpeta actual `./` de tu máquina host, todo lo que Node.js genere se reflejará instantáneamente en tu explorador de archivos.

Busca la carpeta `logs/` en este directorio tras realizar pruebas. Allí encontrarás las matrices de datos listas para ser adjuntadas a tus reportes ISO.

---
*Laboratorio creado para fines académicos y de investigación en Edge Computing.*
