# MISW4502-Proyecto-Final2-Frontend-Web

**CCP** – Aplicación Web Frontend para la gestión de clientes, visitas y pedidos.

---

## 📋 Descripción

La interfaz web permite a los usuarios:

- Visualizar y gestionar visitas a clientes.
- Explorar categorías y productos disponibles.
- Añadir productos al carrito y procesar pedidos.
- Consultar histórico de pedidos y resúmenes.
- Sincronizar datos en tiempo real mediante polling o WebSockets.
- Desplegar el sitio estático en GCP usando Terraform.

---

## 📂 Estructura del Proyecto

```
/
├── .github/                # CI/CD (GitHub Actions)
│   └── workflows/          # Configuración de pipeline
├── app/                    # Proyecto React + Vite
│   ├── public/             # Archivos estáticos (index.html, favicon)
│   ├── src/                # Código fuente (Componentes, Hooks, Utils)
│   ├── .env.example        # Variables de entorno de ejemplo
│   ├── package.json        # Dependencias y scripts
│   ├── vite.config.js      # Configuración de Vite
│   └── README.md           # README específico del frontend
├── main.tf                 # Terraform para desplegar la web en GCP
├── .gitignore
└── README.md               # Documentación raíz (este archivo)
```

---

## ⚙️ Tecnologías y Librerías

- **React**
- **Vite** para bundling y servidor de desarrollo
- **JavaScript** (o **TypeScript**)
- **React Router** para navegación
- **Axios** para llamadas HTTP
- **Tailwind CSS** o CSS Modules para estilos
- **Terraform** para infraestructura como código en GCP
- **GitHub Actions** para CI/CD

---

## 🚀 Requisitos Previos

- Node.js v16+
- npm o Yarn
- Terraform CLI
- Cuenta de GCP con permisos de despliegue

---

## 🔧 Instalación y Desarrollo

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/CCP-G18/MISW4502-Proyecto-Final2-Frontend-Web.git
   cd MISW4502-Proyecto-Final2-Frontend-Web/app
   ```
2. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env y configura VITE_API_URL con la URL de tu backend
   ```
3. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```
4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```
5. Abre <http://localhost:5173> en tu navegador.

---

## 🏗️ Construcción y Despliegue

1. Construir la aplicación:
   ```bash
   npm run build
   # o
   yarn build
   ```
2. Previsualizar producción localmente:
   ```bash
   npm run preview
   # o
   yarn preview
   ```
3. Deploy con Terraform (desde la raíz del repo):
   ```bash
   terraform init
   terraform apply
   ```

---

## 🔍 Pruebas

- Ejecutar tests (si aplica):
   ```bash
   npm test
   # o
   yarn test
   ```

---

## 🤝 Contribuciones

1. Haz fork del repositorio.
2. Crea una rama `feature/tu-cambio`.
3. Realiza cambios y commit.
4. Abre un Pull Request con tu propuesta.

---

## 📝 Licencia

MIT © CCP-G18
