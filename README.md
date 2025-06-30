# 🎫 Ecua Ticket App

Una aplicación web moderna para la gestión de tickets desarrollada con Next.js 15, TypeScript y HeroUI.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Herramientas de Desarrollo](#-herramientas-de-desarrollo)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## 🎯 Descripción

Ecua Ticket App es una aplicación de buses web moderna para la gestión de tickets que utiliza una arquitectura limpia y escalable. La aplicación está construida con Next.js 15, TypeScript y HeroUI, proporcionando una experiencia de usuario moderna y responsive.

## 🛠 Tecnologías

### Frontend
- **[Next.js 15.2.4](https://nextjs.org/)** - Framework de React con App Router
- **[React 19.1.0](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Tailwind CSS 4.1.1](https://tailwindcss.com/)** - Framework CSS utility-first
- **[HeroUI 2.7.5](https://heroui.com/)** - Biblioteca de componentes UI moderna
- **[Framer Motion 12.6.3](https://www.framer.com/motion/)** - Biblioteca de animaciones

### Herramientas de Desarrollo
- **[ESLint 9](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[PostCSS 8.5.3](https://postcss.org/)** - Procesador de CSS
- **[Turbopack](https://turbo.build/pack)** - Bundler rápido para desarrollo

### HTTP Client
- **[Axios 1.8.4](https://axios-http.com/)** - Cliente HTTP para peticiones a APIs

### Temas
- **[next-themes 0.4.6](https://github.com/pacocoursey/next-themes)** - Gestión de temas claro/oscuro

## 🏗 Arquitectura

El proyecto sigue una **arquitectura limpia** organizada en capas:

```
ecua-ticket-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── providers.tsx      # Proveedores de contexto
│   └── login/             # Rutas de autenticación
├── core/                  # Capa de dominio
│   ├── constants/         # Constantes de la aplicación
│   ├── interfaces/        # Interfaces TypeScript
│   └── infrastructure/    # Implementaciones técnicas
│       └── http/          # Cliente HTTP (Axios)
├── features/              # Características de la aplicación
│   └── auth/              # Módulo de autenticación
│       ├── data/          # Capa de datos
│       ├── hooks/         # Custom hooks
│       ├── presentation/  # Capa de presentación
│       ├── repositories/  # Repositorios
│       └── store/         # Estado global
└── public/                # Archivos estáticos
```

### Patrones de Diseño
- **Clean Architecture** - Separación de responsabilidades
- **Repository Pattern** - Abstracción de acceso a datos
- **Provider Pattern** - Gestión de estado global
- **Singleton Pattern** - Cliente HTTP único

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **[Node.js](https://nodejs.org/)** (versión 18 o superior)
- **[npm](https://www.npmjs.com/)** o **[yarn](https://yarnpkg.com/)** o **[pnpm](https://pnpm.io/)**
- **[Git](https://git-scm.com/)**

## 🚀 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd ecua-ticket-app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

5. **Abre tu navegador**
   Navega a [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## ⚙️ Configuración

### Configuración de TypeScript
El proyecto utiliza TypeScript con configuración estricta y paths mapping:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Configuración de Tailwind CSS
Integrado con HeroUI para componentes modernos:

```javascript
// tailwind.config.ts
const {heroui} = require("@heroui/react");

module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(toast|spinner).js"
  ],
  plugins: [heroui()]
}
```

### Configuración de ESLint
Configurado con reglas de Next.js y TypeScript:

```javascript
// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo con Turbopack
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta ESLint para verificar el código
```

## 📁 Estructura del Proyecto

### Directorios Principales

#### `/app`
Contiene las páginas y componentes del App Router de Next.js:
- `layout.tsx` - Layout principal con fuentes y metadatos
- `page.tsx` - Página principal de la aplicación
- `providers.tsx` - Proveedores de contexto (HeroUI, temas)
- `globals.css` - Estilos globales
- `login/` - Rutas de autenticación

#### `/core`
Capa de dominio y infraestructura:
- `constants/` - Constantes de la aplicación
- `interfaces/` - Interfaces TypeScript compartidas
- `infrastructure/` - Implementaciones técnicas
  - `http/` - Cliente HTTP con Axios

#### `/features`
Módulos de características organizados por dominio:
- `auth/` - Módulo de autenticación
  - `data/` - Entidades y DTOs
  - `hooks/` - Custom hooks de React
  - `presentation/` - Componentes de UI
  - `repositories/` - Repositorios de datos
  - `store/` - Estado global

#### `/public`
Archivos estáticos servidos por Next.js

## 🛠 Herramientas de Desarrollo

### Linting y Formateo
- **ESLint** - Análisis estático de código
- **Next.js ESLint Config** - Reglas específicas para Next.js
- **TypeScript ESLint** - Reglas para TypeScript

### CSS y Styling
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Procesamiento de CSS
- **HeroUI** - Biblioteca de componentes UI

### Desarrollo
- **Turbopack** - Bundler rápido para desarrollo
- **TypeScript** - Tipado estático
- **Next.js DevTools** - Herramientas de desarrollo integradas

## 🔧 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Configuration
EXPO_PUBLIC_BACKEND_API_URL=http://localhost:8000/api

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Ecua Ticket App
NEXT_PUBLIC_APP_VERSION=0.1.0
```

### Variables Requeridas
- `EXPO_PUBLIC_BACKEND_API_URL` - URL base de la API backend

## 🚀 Despliegue

### Despliegue en Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno** en el dashboard de Vercel
3. **Deploy automático** en cada push a la rama principal

### Despliegue Manual

```bash
# Construye la aplicación
npm run build

# Inicia el servidor de producción
npm run start
```

### Variables de Entorno para Producción
Asegúrate de configurar las variables de entorno en tu plataforma de despliegue:
- `EXPO_PUBLIC_BACKEND_API_URL` - URL de producción de la API

## 🤝 Contribución

1. **Fork el proyecto**
2. **Crea una rama para tu feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit tus cambios** (`git commit -m 'Add some AmazingFeature'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Estándares de Código
- Usa TypeScript para todo el código
- Sigue las reglas de ESLint
- Mantén la arquitectura limpia
- Escribe tests para nuevas funcionalidades

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ usando Next.js, TypeScript y HeroUI**
