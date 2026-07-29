# Plan de trabajo Fase 2

## Objetivo general
Fortalecer la experiencia de usuario y la calidad de datos del pre-registro del curso.

## Linea 1: UI/UX + robustez de login

### Sprint 1 (1 semana)
- Rediseñar `frontend/src/pages/LoginPage.jsx` con estados claros: cargando, error, exito.
- Mejorar mensajes de error por categoria:
  - `origin_mismatch`
  - dominio no permitido
  - token invalido
  - backend no disponible
- Agregar pantalla de "reintentar" con guia de usuario.
- Agregar telemetria minima de fallos de login (solo codigo/error, sin PII sensible).

### Sprint 2 (1 semana)
- Reforzar flujo protegido de rutas privadas.
- Agregar indicador de progreso del pre-registro (paso 1/2, paso 2/2).
- Refinar UI tipo academia:
  - cards de modulo con jerarquia visual
  - espaciado consistente
  - estados disabled/loading accesibles
- Mejorar accesibilidad:
  - labels y focus visible
  - contraste de mensajes de error

### Criterios de aceptacion Linea 1
- Login Google funcional con cuenta institucional UDG.
- Mensajes de error accionables sin mostrar trazas internas.
- Lighthouse accesibilidad >= 90 en pantalla de login.

## Linea 2: Recopilacion de mas datos

### Sprint 1 (1 semana)
- Extender modelo de `users` con:
  - carrera
  - codigo_estudiante (opcional)
  - semestre (opcional)
- Extender pre-registro con:
  - disponibilidad semanal
  - nivel previo autopercibido
- Agregar validaciones backend y frontend por campo.

### Sprint 2 (1 semana)
- Nuevo modulo de encuesta ampliada (preguntas abiertas + cerradas).
- Exportacion basica de resultados para organizadores (CSV).
- Panel admin basico (lectura) con filtros por carrera/estatus.

### Criterios de aceptacion Linea 2
- Nuevos campos guardados en Supabase sin romper flujo actual.
- Exportacion CSV funcional para administradores.
- Cobertura de pruebas backend para nuevos endpoints.

## Riesgos y mitigacion
- Riesgo: cambios de OAuth en Google Cloud.
  - Mitigacion: checklist de credenciales y origins por ambiente.
- Riesgo: RLS bloqueando inserciones.
  - Mitigacion: pruebas de `/health/deps` y scripts SQL versionados.

## Definicion de terminado
- Flujo completo validado: login -> pre-registro -> cuestionario -> persistencia.
- UI estable en desktop y movil.
- Documentacion actualizada para operacion y deploy.

