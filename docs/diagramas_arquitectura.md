# 🏛️ Diagramas de Estructura y Arquitectura del Sistema
## Gaona Consultores TI — Plataforma Digital Corporativa

Documento técnico con los diagramas de arquitectura de software, flujo de información, componentes del sistema y modelos de interacción para la plataforma web de **Gaona Consultores TI**.

---

## 1. Diagrama de Arquitectura por Capas del Sistema (System Architecture)

Representa la interacción de extremo a extremo entre los usuarios empresariales, la capa de entrega/seguridad, el motor frontend interactivo y los servicios de integración.

```mermaid
graph TB
    subgraph Clients["1. Capa de Clientes & Dispositivos"]
        D1["🖥️ Escritorio / Laptops"]
        D2["📱 Móviles & Tablets"]
        D3["🔍 Motores de Búsqueda & Bots (Google, Bing)"]
    end

    subgraph EdgeLayer["2. Capa de Entrega, DNS & CDN"]
        CDN["🌐 Red de Distribución (CDN / Cloudflare)"]
        SSL["🔒 Certificados SSL/TLS (HTTPS)"]
        Cache["⚡ Compresión Gzip/Brotli & Caché Edge"]
    end

    subgraph FrontendCore["3. Capa Frontend & Núcleo UI/UX"]
        HTML["📄 HTML5 Semántico + Schema.org JSON-LD"]
        CSS["🎨 Vanilla CSS3 (Tokens, Dark-Tech, Glassmorphism)"]
        RESP["📐 Breakpoints Responsivos (Mobile-First / Desktop)"]
    end

    subgraph InteractiveEngines["4. Capa de Lógica & Motores Interactivos (ES6+)"]
        NavEngine["🧭 ScrollSpy & Control de Menú"]
        FilterEngine["🏷️ Filtro Dinámico de Servicios TI"]
        CalcEngine["🧮 Motor de Cotización en Tiempo Real"]
        ChatEngine["🤖 GaonaBot Engine (NLP & Base de Conocimientos)"]
        SchedEngine["📅 Asistente de Agendamiento de Citas (30 min)"]
        ModalEngine["🪟 Controlador de Modales & Términos"]
        ToastEngine["🔔 Notificaciones Toast & Feedback"]
    end

    subgraph IntegrationLayer["5. Capa de Integraciones & Servicios Externos"]
        WA["💬 WhatsApp Business Direct Gateway"]
        EmailService["✉️ Servicio de Notificación / Mail Dispatcher"]
        Analytics["📊 Google Analytics 4 & Tag Manager"]
        Calendar["📆 Calendly / TidyCal Integration"]
    end

    subgraph SecurityGov["6. Seguridad, Gobernanza & Protección"]
        Sanitize["🛡️ Sanitización de Entradas & Honeypot"]
        NDA["🔒 Acuerdo de Confidencialidad & GDPR/LFPDPPP"]
        SrcCode["📦 100% Propiedad del Código Fuente"]
    end

    Clients --> EdgeLayer
    EdgeLayer --> FrontendCore
    FrontendCore --> InteractiveEngines
    InteractiveEngines --> IntegrationLayer
    InteractiveEngines --> SecurityGov
```

---

## 2. Diagrama de Arquitectura de Información & Mapa de Sitio (Sitemap & User Journey)

Estructura de navegación modular orientada a guiar al visitante corporativo hacia la conversión (diagnóstico, cotización o contacto inmediato).

```mermaid
graph TD
    Home["🏠 Inicio (Landing Corporativa)"]

    Home --> Nav["Barra de Navegación Fija (64px)"]
    Home --> Hero["Hero: Propuesta de Valor + KPIs en Vivo + Centro de Operaciones"]
    Home --> Partners["Ecosistema Tecnológico (AWS, Azure, GCP, Cisco, Fortinet)"]
    Home --> Services["Catálogo Interactivo de Servicios TI"]
    Home --> Solutions["Casos de Éxito & Soluciones por Industria"]
    Home --> WhyUs["Nuestra Esencia: Por Qué Elegir a Gaona Consultores"]
    Home --> Estimator["Cotizador de Proyectos TI (Calculadora en Tiempo Real)"]
    Home --> Testimonials["Testimonios B2B & Prueba Social"]
    Home --> FAQ["Preguntas Frecuentes (Acordeón Interactivo)"]
    Home --> Contact["Diagnóstico TI & Agendamiento de Reunión"]
    Home --> Footer["Pie de Página & Enlaces Legales"]

    %% Detalle de Servicios
    Services --> S1["☁️ Cloud & DevOps"]
    Services --> S2["🛡️ Ciberseguridad & SOC 24/7"]
    Services --> S3["💻 Software a Medida & APIs"]
    Services --> S4["🔌 Redes & Infraestructura"]
    Services --> S5["🎯 Consultoría & Gobierno TI"]

    %% Detalle de Casos de Éxito
    Solutions --> C1["Sector Financiero / Fintech"]
    Solutions --> C2["Retail & E-Commerce"]
    Solutions --> C3["Logística & Distribución"]

    %% Acciones Flotantes
    Home -.-> FloatChat["🤖 GaonaBot (Asistente 24/7)"]
    Home -.-> FloatWA["💬 WhatsApp Flotante Directo"]
    Home -.-> FloatTop["↑ Volver al Inicio"]
```

---

## 3. Flujo de Datos del Cotizador Interactivo de Proyectos TI

Secuencia de cálculo matemático dinámico y transferencia de parámetros hacia el formulario de contacto formal.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as 👤 Cliente Corporativo
    participant UI as 🖥️ Interfaz Cotizador
    participant Calc as ⚙️ Motor Matemático (calcEngine)
    participant Form as 📝 Formulario de Contacto
    participant Ticket as 🎫 Generador de Tickets

    Usuario->>UI: Selecciona Servicio Principal (Software / Cloud / Seguridad / Infra)
    Usuario->>UI: Selecciona Escala de Organización (Startup / PyME / Corporativo)
    Usuario->>UI: Marca Módulos Adicionales (SLA 24/7, Pentesting, CI/CD)
    
    UI->>Calc: Envía parámetros de selección
    Calc->>Calc: Aplica multiplicadores de escala & precios base
    Calc->>Calc: Calcula rango de inversión en MXN y semanas estimadas
    Calc->>UI: Renderiza precio estimado ($42k-$51k MXN) y equipo sugerido
    
    Usuario->>UI: Clic en "Continuar con esta Cotización"
    UI->>Form: Autocompleta servicio y mensaje con parámetros calculados
    UI->>Form: Desplaza la vista suavemente a la sección #contacto
    
    Usuario->>Form: Ingresa nombre, empresa, correo, teléfono y horario de cita
    Usuario->>Form: Clic en "Enviar Solicitud"
    Form->>Form: Valida campos en tiempo real (:user-valid)
    Form->>Ticket: Genera Ticket único (Ej: GAONA-984210)
    Ticket->>UI: Despliega Modal de Confirmación y notificación Toast
```

---

## 4. Arquitectura del Motor Conversacional (GaonaBot ⚡)

Proceso de procesamiento de lenguaje natural y resolución de consultas del asistente virtual.

```mermaid
flowchart TD
    Start(["💬 Usuario abre GaonaBot / Envía Mensaje"]) --> CheckType{"¿Es Chip Rápido o Texto Libre?"}
    
    CheckType -- "Chip Rápido" --> DirectQuery["Procesa consulta predefinida"]
    CheckType -- "Texto Libre" --> Normalize["Normaliza texto (Lowercase, Trim, Regex)"]
    
    DirectQuery --> Engine["Motor de Base de Conocimientos TI"]
    Normalize --> Engine

    Engine --> MatchCategories{"Evaluación de Intención"}
    
    MatchCategories -- "Servicios / Nube / DevOps" --> RespCloud["Respuesta técnica Cloud AWS/Azure/GCP + Enlace #servicios"]
    MatchCategories -- "Ciberseguridad / SOC / Pentest" --> RespSec["Detalle SOC 24/7, ISO 27001 + Enlace #contacto"]
    MatchCategories -- "Software / Web / Apps" --> RespDev["Detalle Microservicios, APIs + Enlace #cotizador"]
    MatchCategories -- "Precios / Cotización" --> RespCost["Rango base ($24k-$45k MXN) + Enlace #cotizador"]
    MatchCategories -- "Diagnóstico / Cita Gratis" --> RespDiag["Explicación sesión 30 min + Enlace #contacto"]
    MatchCategories -- "SLAs / Soporte Crítico" --> RespSLA["SLA < 15 min, 24/7/365 + Enlace de soporte"]
    MatchCategories -- "Contacto / Ubicación / Teléfono" --> RespContact["Teléfono, Correo, Insurgentes Sur + Botón WhatsApp"]
    MatchCategories -- "Confidencialidad / NDA" --> RespNDA["100% código del cliente + Firma de NDA"]
    MatchCategories -- "No identificado" --> RespFallback["Respuesta asistida con atajos rápidos y WhatsApp"]

    RespCloud --> ShowTyping["Muestra indicador de escritura (...)"]
    RespSec --> ShowTyping
    RespDev --> ShowTyping
    RespCost --> ShowTyping
    RespDiag --> ShowTyping
    RespSLA --> ShowTyping
    RespContact --> ShowTyping
    RespNDA --> ShowTyping
    RespFallback --> ShowTyping

    ShowTyping --> RenderMessage["Renderiza burbuja de respuesta + Botones de Acción Directa"]
    RenderMessage --> End(["Esperando siguiente interacción"])
```

---

## 5. Matriz de Componentes y Responsabilidades

| Componente | Archivo Fuente | Responsabilidad Principal |
| :--- | :--- | :--- |
| **Núcleo de Estilos & Tokens** | [`css/styles.css`](../css/styles.css) | Variables de color, fuentes Google Fonts, estilos glassmorphism, responsive queries (1080px/768px). |
| **Estructura Semántica** | [`index.html`](../index.html) | Layout principal, metadatos SEO, marcado Schema.org, catálogo, formularios y modales. |
| **Controlador Interactivo** | [`js/main.js`](../js/main.js) | Lógica del cotizador, chatbot GaonaBot, filtro de servicios, agendador de citas y modales. |
| **Activos Gráficos & Branding** | [`assets/images/`](../assets/images/) | Isotipo 3D oficial, logotipo dark-mode, imágenes de casos de estudio en alta resolución. |
| **Documentación & Propuesta PDF** | [`docs/`](../docs/) | Documento imprimible y PDF formal de la propuesta técnica. |
