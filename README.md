📋 Características Principales

### 🧠 Funcionalidades Técnicas
* **Integración con IA:** Chat exclusivo conectado a **Google Gemini** (Modelos Flash/Pro) mediante API REST directa.
* **Gestión de Estado:** Uso de `React Context API` (ChatContext) para manejar el estado global de los mensajes, contactos y selección de chats de manera eficiente.
* **Persistencia de Datos:** (Opcional: Si usaste localStorage menciónalo, si no, borra esto) Los chats se mantienen durante la sesión.
* **Manejo de Errores:** Sistema robusto de *fallback* para gestionar errores de API (404, 429 Quota Exceeded) y mostrar feedback al usuario.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js + Vite
* **Estilos:** CSS3
* **API:** Google Generative AI (Gemini)
* **Despliegue:** Vercel

---

## 📂 Estructura del Proyecto

src/
├── Components/      # Componentes reutilizables (Sidebar, Chat, Mensajes)
├── Context/         # ChatContext (Lógica global y conexión a API)
├── Data/            # Datos simulados (Chats iniciales, Contactos)
├── Utils/           # Constantes y funciones de ayuda
├── App.jsx          # Componente principal
└── main.jsx         # Punto de entrada