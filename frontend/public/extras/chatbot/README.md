# Innovating bot – Demo lista

Este paquete ya incluye el snippet del **Chat widget** que enviaste (con tu id).

## Cómo usar
- Abre `index.html` con doble clic (o sirve con un servidor local si prefieres).
- Verás la burbuja del chat abajo a la derecha.
- Botones disponibles:
  - **Abrir chat** / **Cerrar chat**: controlan el widget por código.
  - **Exportar texto de la página**: descarga `texto_pagina_para_entrenamiento.txt` con todo el contenido visible de `#content` para subirlo como fuente a Chatbase.

## Abrir automáticamente el chat (opcional)
Descomenta la línea al final del `<script>`:
`whenChatIsReady(()=>window.chatbase.openChatbot());`

## Notas
- No se incluyen claves secretas ni identidad por JWT (esto solo va del lado servidor si alguna vez lo usas).
