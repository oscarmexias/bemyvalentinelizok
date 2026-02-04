# 💕 Página de San Valentín Interactiva

Una página web divertida e interactiva para el Día de San Valentín con estilo pixel art inspirado en Mario Bros.

## 🎮 Características

- **Pregunta principal**: "Do you wanna be my Valentine?" con tipografía pixel art
- **Botón YES**: Animación de corazones flotantes y efecto de celebración
- **Botón NO**: Se escapa cuando intentas hacer clic (¡nunca podrás tocarlo!)
- **Modo Fiesta**: Animación estilo disco ochentera con gatitos y perritos bailando
- **Diseño Responsive**: Funciona perfectamente en móvil, tablet y desktop
- **Estilo Pixel Art**: Tipografía y diseño retro inspirado en Mario Bros

## 🚀 Desarrollo Local

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 📦 Despliegue en Vercel

### Opción 1: Despliegue desde GitHub

1. Crea un repositorio en GitHub con tu cuenta `oscarmexias`
2. Sube el código:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/oscarmexias/st-valentin.git
git push -u origin main
```

3. Ve a [Vercel](https://vercel.com) e inicia sesión con tu cuenta de GitHub `oscarmexias`
4. Importa el repositorio
5. Vercel detectará automáticamente que es un proyecto Next.js
6. Haz clic en "Deploy"

### Opción 2: Despliegue desde CLI

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Inicia sesión (asegúrate de usar la cuenta `oscarmexias`):
```bash
vercel login
```

3. Despliega:
```bash
vercel
```

4. Para producción:
```bash
vercel --prod
```

## 🎨 Colores

- **Crema**: `#FFF8E7`
- **Rosa Fresa Mate**: `#FFB6C1`
- **Rojo**: `#DC143C`
- **Rojo Oscuro**: `#B22222`
- **Rosa**: `#FF69B4`

## 🛠️ Tecnologías

- Next.js 14+
- TypeScript
- React
- CSS puro con animaciones

## 📱 Responsive

La página está optimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Móvil (320px - 767px)

## 📝 Notas

- El botón NO utiliza física de repulsión basada en la posición del cursor/dedo
- La animación de corazones se genera dinámicamente
- El modo fiesta incluye gradientes animados y sprites bailando
