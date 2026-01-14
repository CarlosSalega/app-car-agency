# Car Agency - Plataforma de Gestión de Autos

Aplicación web moderna para agencia de autos con catálogo público y panel administrativo.

## 🚀 Características

-   **Landing Page Pública**: Catálogo de vehículos con filtros avanzados
-   **Bento Grid Design**: Diseño moderno y responsive
-   **Panel Admin**: Dashboard con estadísticas y gestión completa
-   **Sistema de Roles**: Admin y Colaborador con permisos diferenciados
-   **Reservas**:
-   **NeonDB**: Base de datos en la nube para producción
-   **Vercel Blob**: Almacenamiento de imágenes
-   **Integración MercadoPago**: Simulada para desarrollo local

## 📦 Instalación

1. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`

2. Configurar la base de datos:
   \`\`\`bash
   npm run db:push
   \`\`\`

3. Poblar con datos de ejemplo:
   \`\`\`bash
   npm run db:seed
   \`\`\`

4. Iniciar el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔐 Credenciales de Prueba

**Admin:**

-   Email: admin@agencia.com
-   Password: admin123

**Colaborador:**

-   Email: juan@agencia.com
-   Password: juan123

## 🛠️ Stack Tecnológico

-   Next.js 15 (App Router)
-   TypeScript
-   Tailwind CSS v4
-   ShadCN UI
-   Prisma ORM
-   NeonDB
-   Vercel Blob
-   MercadoPago (simulado)

## 📁 Estructura del Proyecto

\`\`\`
/app
/admin # Panel administrativo
/autos/[slug] # Detalle de vehículos
/api # API routes
/components # Componentes React
/lib # Utilidades y configuración
/prisma # Schema y migraciones
\`\`\`

## 🎨 Características del Diseño

-   Paleta oscura premium
-   Bento grid para catálogo
-   Animaciones suaves
-   Responsive design
-   Accesibilidad optimizada
