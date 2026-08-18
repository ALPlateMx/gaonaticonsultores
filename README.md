# 🚀 Gaona Consultores TI - Sitio Web Corporativo & Portal CRM

Sitio web corporativo de alta gama, responsivo, accesible y optimizado para SEO con **Portal Administrativo & CRM Kanban** integrado para el seguimiento integral de propuestas comerciales de clientes para **Gaona Consultores TI / IT**.

---

## 🌟 Características Principales

- **Diseño Moderno & "Dark-Tech":** Paleta corporativa premium (*Deep Navy* y *Electric Cyan*), efectos *glassmorphism*, micro-animaciones e interactividad fluida.
- **Isotipo y Logotipo Oficial Integrado:** Emblema 3D con nodos de circuito, efectos de iluminación (*glow*) y favicon corporativo.
- **Catálogo Interactivo de Servicios TI:** Pestañas de filtrado dinámico (*Cloud & DevOps, Ciberseguridad SOC 24/7, Software a Medida, Infraestructura & Redes, Consultoría Estratégica*) con modales de detalle técnico.
- **Cotizador de Proyectos en Tiempo Real:** Calculadora interactiva que estima rangos de inversión en MXN, tiempos de entrega y asignación de células de desarrollo, permitiendo transferir los parámetros calculados al formulario de contacto.
- **Asistente Virtual & Chatbot (GaonaBot ⚡):** Chatbot interactivo con base de conocimientos técnicos, opciones rápidas de un toque (*chips*), simulación de escritura en tiempo real y enlaces a WhatsApp y diagnóstico.
- **Agendamiento de Diagnóstico TI Gratuito:** Selector de fechas y franjas horarias de 30 minutos integrado con validación de formularios (`:user-valid`) y generación de ticket de soporte.
- **Panel Administrativo & CRM Kanban B2B (`admin.html`):**
  - **Login Independiente:** Acceso protegido por sesión para consultores y directores de TI.
  - **Tablero Kanban con Drag & Drop:** 6 etapas comerciales (*Prospectos, Diagnóstico Agendado, Propuesta Enviada, En Negociación, Ganadas ✅, Perdidas ❌*).
  - **Sincronización en Tiempo Real:** Los leads captados en el sitio web público se registran automáticamente en el CRM.
  - **Métricas & KPIs en Vivo:** Pipeline total activo ($ MXN), número de propuestas, proyectos ganados y tasa de conversión.
  - **Exportación de Datos:** Descarga de reportes en formato CSV y filtrado dinámico por prioridad y servicio.
- **SEO & Core Web Vitals:** Marcado semántico HTML5, metadatos Open Graph, Twitter Cards, Schema.org (`ProfessionalService`) y rendimiento optimizado.

---

## 📁 Estructura del Proyecto

```text
gaonaticonsultores/
├── admin.html                       # Portal Administrativo & CRM Kanban con login independiente
├── index.html                       # Página principal del sitio web corporativo
├── assets/
│   └── images/
│       ├── hero.jpg                 # Gráfico principal del Centro de Operaciones
│       ├── cybersecurity.jpg        # Caso de estudio de Ciberseguridad & SOC
│       ├── software-cloud.jpg       # Caso de estudio de Desarrollo & Cloud
│       ├── logo-icon.png            # Isotipo 3D oficial para navbar y favicon
│       ├── logo-dark-theme.png      # Logotipo oficial para modo oscuro
│       ├── logo-transparent.png     # Logotipo oficial con fondo transparente
│       └── logo-original.png        # Archivo original cargado
├── css/
│   ├── styles.css                   # Sistema de diseño, tokens CSS y componentes públicos
│   └── admin.css                    # Estilos del tablero Kanban, tarjetas CRM y login admin
├── docs/
│   ├── Propuesta_Tecnica_Gaona_Consultores_TI.pdf  # Propuesta técnica formal en PDF
│   ├── propuesta_tecnica.html       # Plantilla imprimible de la propuesta técnica
│   └── diagramas_arquitectura.md    # Diagramas de arquitectura del sistema en Mermaid
├── js/
│   ├── main.js                      # Motor interactivo público, cotizador, chatbot GaonaBot y sync CRM
│   └── admin.js                     # Motor del CRM Kanban, autenticación, KPIs y drag & drop
└── README.md                        # Documentación corporativa del proyecto
```

---

## 💻 Ejecución Local & Accesos

Para visualizar el sitio y el panel localmente:

```bash
# Con Python:
python -m http.server 8080
```

- **Sitio Web Público:** [http://localhost:8080/](http://localhost:8080/)
- **Portal Administrativo & CRM:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)

### 🔑 Credenciales de Acceso al CRM:
- **Usuario:** `admin@gaonaconsultores.com`
- **Contraseña:** `GaonaAdmin2026!`

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** semántico y accesible (WCAG 2.1 AA)
- **Vanilla CSS3** (Variables CSS, Grid, Flexbox, Glassmorphism, Micro-animaciones)
- **Vanilla JavaScript ES6+** modular y sin dependencias externas
- **HTML5 Drag and Drop API** nativa para el tablero Kanban
- **Google Fonts** (*Outfit*, *Inter*, *JetBrains Mono*)

---

© 2026 Gaona Consultores TI. Todos los derechos reservados.
