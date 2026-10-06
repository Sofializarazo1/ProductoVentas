# API GraphQL de productos

API con Express, Apollo Server y Mongoose para MongoDB Atlas. GraphQL está disponible en `/graphql`, con introspección habilitada y Apollo Sandbox. `/healthz` sirve como comprobación de estado para Render.

## Desarrollo local

1. Instala Node.js 20 o superior.
2. Ejecuta `npm install`.
3. Copia `.env.example` a `.env` y sustituye los valores con credenciales nuevas de Atlas. No subas `.env` al repositorio.
4. Ejecuta `npm run dev` y abre `http://localhost:4000/graphql`.

Puedes proporcionar `MONGODB_URI` completa en vez de las variables separadas. En ambos casos, `MONGODB_DATABASE` selecciona la base de datos y toma `productos` como valor predeterminado.

## Despliegue en Render

Crea un servicio **Web Service** conectado al repositorio, con `npm install` como Build Command y `npm start` como Start Command. En **Environment**, configura `MONGODB_URI` como variable secreta, o configura `MONGODB_USERNAME`, `MONGODB_PASSWORD` y `MONGODB_CLUSTER_HOST`. Configura también `MONGODB_DATABASE` si quieres otro nombre de base de datos.

En MongoDB Atlas, permite las conexiones desde las direcciones IP de salida indicadas por Render. No guardes las credenciales en el código ni en el repositorio. Rota cualquier contraseña que se haya compartido fuera del panel de secretos.

## Operaciones GraphQL

```graphql
query Productos {
  products(filter: { category: "electronica", minPrice: 10, inStock: true }) {
    id
    name
    price
    stock
    category
    description
  }
}
```

```graphql
query Producto($id: ID!) {
  product(id: $id) {
    id
    name
    price
    stock
    category
    description
  }
}
```

```graphql
mutation ActualizarProducto($id: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    price
    stock
    category
    description
  }
}
```

Filtros: `name` (texto parcial), `category` (coincidencia exacta), `minPrice`, `maxPrice` e `inStock`.