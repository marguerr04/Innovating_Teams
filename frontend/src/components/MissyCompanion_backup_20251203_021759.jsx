import React, { useState, useRef, useEffect } from 'react';

// Estilos CSS para asegurar que el video se comporte como GIF
const videoGifStyles = `
  video.missy-video::-webkit-media-controls {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-panel {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-play-button {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-timeline {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-current-time-display {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-time-remaining-display {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-mute-button {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-volume-slider {
    display: none !important;
  }
  
  video.missy-video::-webkit-media-controls-fullscreen-button {
    display: none !important;
  }

  video.missy-video {
    cursor: inherit !important;
    pointer-events: none !important;
  }
`;

export default function MissyCompanion({ phase, showTokens, positioning = 'fixed' }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  // Limpiar chat al cambiar de fase
  useEffect(() => {
    setChatVisible(false);
  }, [phase]);

  const handleChatbotClick = () => {
    console.log('🖱️ Click en el robot - Iniciando chatbot real...');
    
    // Si ya está visible, cerrarlo
    if (chatVisible) {
      setChatVisible(false);
      return;
    }
    
    // Cargar el chatbot real de Chatbase - método original
    loadChatbaseScriptOriginal();
  };

  // Función original simplificada para cargar Chatbase
  const loadChatbaseScriptOriginal = () => {
    try {
      // Configuración previa - como funcionaba antes
      window.embeddedChatbotConfig = {
        chatbotId: "NDIGyY6LjlULvnmM9GEOX",
        domain: "www.chatbase.co"
      };

      // Limpiar script anterior si existe
      const existingScript = document.getElementById('chatbase-embed');
      if (existingScript) {
        existingScript.remove();
      }

      // Crear script exactamente como antes
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'chatbase-embed';
      script.defer = true;

      script.onload = () => {
        console.log('✅ Chatbase script cargado - método original');
        setChatVisible(true);
        
        // Dar tiempo para que se inicialice como antes
        setTimeout(() => {
          if (window.chatbase) {
            try {
              window.chatbase('open');
              console.log('🚀 Chatbase abierto exitosamente');
              
              // Esperar y buscar el iframe de diferentes maneras
              setTimeout(() => {
                // Buscar iframes de Chatbase de múltiples formas
                let chatIframes = document.querySelectorAll('iframe[src*="chatbase.co"]');
                
                if (chatIframes.length === 0) {
                  chatIframes = document.querySelectorAll('iframe[src*="widget"]');
                }
                
                if (chatIframes.length === 0) {
                  // Buscar cualquier iframe que pueda ser de chatbase
                  const allIframes = document.querySelectorAll('iframe');
                  console.log(`🔍 Encontrados ${allIframes.length} iframes en total`);
                  for (let iframe of allIframes) {
                    console.log('🔍 Iframe src:', iframe.src);
                    if (iframe.src && (iframe.src.includes('chatbase') || iframe.src.includes('widget') || iframe.src.includes('chat'))) {
                      chatIframes = [iframe];
                      break;
                    }
                  }
                }
                
                if (chatIframes.length > 0) {
                  console.log('✅ Iframe encontrado:', chatIframes[0].src);
                  createOriginalChatContainer(chatIframes[0]);
                } else {
                  console.log('⚠️ No se encontró iframe inmediatamente, reintentando...');
                  // Reintentar con búsqueda más amplia y forzar apertura
                  setTimeout(() => {
                    // Intentar forzar apertura de nuevo
                    try {
                      window.chatbase('open');
                    } catch (e) {}
                    
                    const allIframes = document.querySelectorAll('iframe');
                    console.log(`🔄 Reintento: ${allIframes.length} iframes disponibles`);
                    
                    if (allIframes.length > 0) {
                      // Tomar el último iframe añadido (probablemente Chatbase)
                      const lastIframe = allIframes[allIframes.length - 1];
                      console.log('🎯 Usando último iframe:', lastIframe.src);
                      createOriginalChatContainer(lastIframe);
                    } else {
                      console.log('❌ No se encontraron iframes - usando fallback');
                      showSimpleFallback();
                    }
                  }, 3000);
                }
              }, 2000);
              
            } catch (error) {
              console.error('Error abriendo chatbase:', error);
              showSimpleFallback();
            }
          } else {
            console.log('❌ window.chatbase no disponible');
            showSimpleFallback();
          }
        }, 500);
      };

      script.onerror = (error) => {
        console.error('Error cargando script de Chatbase:', error);
        showSimpleFallback();
      };

      // Añadir al head como antes
      document.head.appendChild(script);
      console.log('📄 Script de Chatbase añadido al DOM');

    } catch (error) {
      console.error('Error general:', error);
      showSimpleFallback();
    }
  };

  // Función para crear el contenedor original pero mejorado
  const createOriginalChatContainer = (iframe) => {
    try {
      console.log('🔧 Creando contenedor personalizado para iframe:', iframe.src);
      
      // Ocultar elementos originales de Chatbase
      const allChatbaseElements = document.querySelectorAll(
        'iframe[src*="chatbase"], iframe[src*="widget"], [id*="chatbase"], [class*="chatbase"], [class*="chat"]'
      );
      
      allChatbaseElements.forEach(element => {
        if (element.id !== 'unified-chatbot-container') {
          element.style.setProperty('display', 'none', 'important');
          element.style.setProperty('visibility', 'hidden', 'important');
          element.style.setProperty('opacity', '0', 'important');
        }
      });

      // Crear contenedor personalizado
      let chatContainer = document.getElementById('unified-chatbot-container');
      if (chatContainer) {
        chatContainer.remove();
      }
      
      chatContainer = document.createElement('div');
      chatContainer.id = 'unified-chatbot-container';
      chatContainer.style.cssText = `
        position: fixed !important;
        left: 20px !important;
        bottom: 140px !important;
        width: 360px !important;
        height: 500px !important;
        z-index: 999999 !important;
        background: white !important;
        border-radius: 15px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
        border: 2px solid #10B981 !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      `;

      // Header del chat
      const header = document.createElement('div');
      header.style.cssText = `
        height: 50px !important;
        background: linear-gradient(135deg, #10B981, #059669) !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 0 15px !important;
        color: white !important;
        font-weight: bold !important;
        font-size: 14px !important;
      `;
      
      header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="font-size: 20px;">🤖</div>
          <div>
            <div style="font-size: 16px;">Innovating Bot (IA Real)</div>
            <div style="font-size: 11px; opacity: 0.9;">✅ Conectado a Chatbase</div>
          </div>
        </div>
        <button id="close-real-chat" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 5px;">✕</button>
      `;

      // Contenedor para el iframe
      const iframeContainer = document.createElement('div');
      iframeContainer.style.cssText = `
        flex: 1 !important;
        width: 100% !important;
        height: calc(100% - 50px) !important;
        overflow: hidden !important;
        background: white !important;
        position: relative !important;
      `;

      // Clonar y configurar el iframe
      const newIframe = iframe.cloneNode(true);
      newIframe.style.cssText = `
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        background: white !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;

      // Configurar atributos del iframe
      newIframe.allow = "camera; microphone; geolocation";
      newIframe.sandbox = "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation";

      // Agregar indicador de carga
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = `
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        text-align: center !important;
        color: #059669 !important;
      `;
      loadingDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
        <div style="font-size: 14px;">Cargando chatbot...</div>
      `;

      iframeContainer.appendChild(loadingDiv);
      iframeContainer.appendChild(newIframe);

      // Event listener para cerrar
      header.querySelector('#close-real-chat').onclick = () => {
        chatContainer.remove();
        setChatVisible(false);
        try {
          if (window.chatbase) {
            window.chatbase('close');
          }
        } catch (e) {
          // Ignorar errores
        }
      };

      // Ensamblar contenedor
      chatContainer.appendChild(header);
      chatContainer.appendChild(iframeContainer);
      document.body.appendChild(chatContainer);

      // Manejar carga del iframe
      let iframeLoaded = false;
      
      newIframe.onload = () => {
        console.log('✅ Iframe de Chatbase cargado correctamente');
        iframeLoaded = true;
        loadingDiv.style.display = 'none';
      };
      
      newIframe.onerror = () => {
        console.log('❌ Error cargando iframe de Chatbase');
        if (!iframeLoaded) {
          loadingDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
            <div style="font-size: 14px;">Error de conexión</div>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #10B981; color: white; border: none; border-radius: 8px; cursor: pointer;">Recargar</button>
          `;
        }
      };
      
      // Timeout para verificar carga
      setTimeout(() => {
        if (!iframeLoaded) {
          console.log('⏰ Timeout cargando iframe - removiendo indicador de carga');
          loadingDiv.style.display = 'none';
        }
      }, 5000);

      console.log('✅ Contenedor personalizado creado exitosamente');
      
    } catch (error) {
      console.error('❌ Error creando contenedor personalizado:', error);
      showSimpleFallback();
    }
  };

  // Fallback simple en caso de problemas
  const showSimpleFallback = () => {
    setChatVisible(true);
    
    let chatContainer = document.getElementById('unified-chatbot-container');
    if (chatContainer) {
      chatContainer.remove();
    }
    
    chatContainer = document.createElement('div');
    chatContainer.id = 'unified-chatbot-container';
    chatContainer.style.cssText = `
      position: fixed !important;
      left: 20px !important;
      bottom: 140px !important;
      width: 360px !important;
      height: 500px !important;
      z-index: 999999 !important;
      background: white !important;
      border-radius: 15px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      border: 2px solid #EF4444 !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      font-family: Arial, sans-serif !important;
    `;

    chatContainer.innerHTML = `
      <div style="height: 40px; background: #EF4444; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; color: white; font-weight: bold;">
        <span>🤖 Innovating Bot (Sin conexión)</span>
        <button onclick="this.closest('#unified-chatbot-container').remove()" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">✖️</button>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
        <h3 style="color: #EF4444; margin: 0 0 10px 0;">No se pudo conectar</h3>
        <p style="color: #6B7280; margin: 0 0 15px 0; font-size: 14px; line-height: 1.4;">
          Hay un problema con la conexión al chatbot de IA. Verifica tu conexión a internet e intenta nuevamente.
        </p>
        <button onclick="location.reload()" style="background: #2DD4BF; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">
          🔄 Reintentar
        </button>
      </div>
    `;

    document.body.appendChild(chatContainer);
  };

  // Función para mostrar chatbot funcional inmediato
  const showWorkingChatbot = () => {
    let chatContainer = document.getElementById('unified-chatbot-container');
    if (chatContainer) {
      chatContainer.remove();
    }
    
    chatContainer = document.createElement('div');
    chatContainer.id = 'unified-chatbot-container';
    chatContainer.style.cssText = `
      position: fixed !important;
      left: 20px !important;
      bottom: 140px !important;
      width: 360px !important;
      height: 500px !important;
      z-index: 999999 !important;
      background: white !important;
      border-radius: 15px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      border: 2px solid #2DD4BF !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;

    const header = document.createElement('div');
    header.id = 'chat-header';
    header.style.cssText = `
      height: 50px !important;
      background: linear-gradient(135deg, #2DD4BF, #14B8A6) !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 15px !important;
      color: white !important;
      font-weight: bold !important;
      font-size: 14px !important;
    `;
    
    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="font-size: 20px;">🤖</div>
        <div>
          <div style="font-size: 16px;">Innovating Bot</div>
          <div style="font-size: 11px; opacity: 0.9;">Conectando con IA...</div>
        </div>
      </div>
      <button id="close-working-chat" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 5px;">✕</button>
    `;

    // Área de mensajes
    const messagesArea = document.createElement('div');
    messagesArea.id = 'messages-area';
    messagesArea.style.cssText = `
      flex: 1 !important;
      padding: 15px !important;
      overflow-y: auto !important;
      background: #F8FAFC !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
    `;

    // Input área
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
      padding: 15px !important;
      border-top: 1px solid #E2E8F0 !important;
      background: white !important;
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      display: flex !important;
      gap: 10px !important;
      align-items: center !important;
    `;

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Escribe tu pregunta aquí...';
    textInput.style.cssText = `
      flex: 1 !important;
      padding: 12px 15px !important;
      border: 1px solid #CBD5E1 !important;
      border-radius: 25px !important;
      outline: none !important;
      font-size: 14px !important;
    `;

    const sendButton = document.createElement('button');
    sendButton.innerHTML = '➤';
    sendButton.style.cssText = `
      background: #2DD4BF !important;
      color: white !important;
      border: none !important;
      border-radius: 50% !important;
      width: 45px !important;
      height: 45px !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 18px !important;
      transition: background 0.2s !important;
    `;

    sendButton.onmouseover = () => sendButton.style.background = '#14B8A6';
    sendButton.onmouseout = () => sendButton.style.background = '#2DD4BF';

    // Función para añadir mensaje
    const addMessage = (text, isUser = false) => {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = `
        display: flex !important;
        ${isUser ? 'justify-content: flex-end' : 'justify-content: flex-start'} !important;
        margin-bottom: 8px !important;
      `;

      const messageBubble = document.createElement('div');
      messageBubble.style.cssText = `
        max-width: 85% !important;
        padding: 12px 16px !important;
        border-radius: ${isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px'} !important;
        background: ${isUser ? '#2DD4BF' : 'white'} !important;
        color: ${isUser ? 'white' : '#374151'} !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        border: ${isUser ? 'none' : '1px solid #E2E8F0'} !important;
        animation: slideIn 0.3s ease-out !important;
      `;

      messageBubble.textContent = text;
      messageDiv.appendChild(messageBubble);
      messagesArea.appendChild(messageDiv);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    // Respuestas inteligentes por fase
    const getSmartResponse = (message, currentPhase) => {
      const lowerMessage = message.toLowerCase();
      
      // Respuestas específicas por palabras clave
      if (lowerMessage.includes('equipo') || lowerMessage.includes('grupo')) {
        return "¡Formar un buen equipo es clave! 👥 Busca personas con habilidades diferentes a las tuyas. La diversidad en el equipo es una fortaleza.";
      }
      
      if (lowerMessage.includes('idea') || lowerMessage.includes('problema')) {
        return "💡 Las mejores ideas surgen de problemas reales. Observa tu entorno: ¿qué molesta a la gente? ¿Qué se puede mejorar?";
      }
      
      if (lowerMessage.includes('presentar') || lowerMessage.includes('presentación')) {
        return "🎤 Para una buena presentación: cuenta una historia, sé claro sobre el problema que resuelves, y muestra por qué tu solución es la mejor.";
      }

      if (lowerMessage.includes('validar') || lowerMessage.includes('validación')) {
        return "✅ Validar significa probar si tu idea realmente funciona. Habla con posibles usuarios, haz encuestas, prueba prototipos simples.";
      }

      // Respuestas por fase
      const phaseResponses = {
        1: [
          "En esta fase inicial, enfócate en conocer a tus compañeros. 🤝",
          "Busca personas que complementen tus habilidades. La diversidad es poder. 💪",
          "¿Ya tienes una idea de qué tipo de proyecto te gustaría desarrollar? 🚀"
        ],
        2: [
          "¡Genial tener equipo! Ahora definan roles: ¿quién lidera? ¿quién investiga? ¿quién presenta? 📋",
          "Es momento de conocerse mejor. Compartan sus fortalezas y experiencias. 🌟",
          "Establezcan reglas de trabajo: ¿cuándo se reunirán? ¿cómo tomarán decisiones? 📅"
        ],
        3: [
          "¡Hora de la lluvia de ideas! 🧠⚡ No juzguen, solo generen muchas ideas primero.",
          "Piensen en problemas cotidianos: transporte, educación, medio ambiente, tecnología... 🌍",
          "¿Qué les molesta en su día a día? Ahí puede estar su próxima gran idea. 💭"
        ],
        4: [
          "Definan claramente: ¿Qué problema resuelven? ¿Para quién? ¿Cómo? ¿Por qué ustedes? 🎯",
          "Su propuesta debe ser específica. No 'ayudar al medio ambiente', sino 'reducir el plástico en cafeterías universitarias'. 📝",
          "¿Conocen a alguien que tenga este problema? ¡Hablen con ellos! 💬"
        ],
        5: [
          "¡Momento de brillar! 🌟 Su presentación debe emocionar y convencer.",
          "Estructura: Problema → Solución → Equipo → Plan → Impacto. Simple y poderoso. 📊",
          "Practiquen juntos. La confianza se nota y contagia. ✨"
        ],
        6: [
          "¡Felicitaciones por llegar hasta aquí! 🎉 Han aprendido a ser emprendedores.",
          "No termina aquí. Pueden seguir desarrollando su idea. ¡El mundo necesita innovadores como ustedes! 🚀",
          "¿Qué fue lo que más aprendieron en este proceso? 📚"
        ]
      };

      const responses = phaseResponses[currentPhase] || phaseResponses[1];
      return responses[Math.floor(Math.random() * responses.length)];
    };

    // Manejar envío de mensaje
    const handleSend = () => {
      const message = textInput.value.trim();
      if (!message) return;

      addMessage(message, true);
      textInput.value = '';

      // Simular typing
      setTimeout(() => {
        const response = getSmartResponse(message, phase);
        addMessage(response, false);
      }, 800);
    };

    // Event listeners
    sendButton.addEventListener('click', handleSend);
    textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'close-working-chat') {
        chatContainer.remove();
        setChatVisible(false);
      }
    });

    // Ensamblar componente
    inputContainer.appendChild(textInput);
    inputContainer.appendChild(sendButton);
    inputArea.appendChild(inputContainer);
    
    chatContainer.appendChild(header);
    chatContainer.appendChild(messagesArea);
    chatContainer.appendChild(inputArea);
    document.body.appendChild(chatContainer);

    // Mensaje inicial
    setTimeout(() => {
      addMessage(getSmartResponse('', phase), false);
    }, 500);

    // Agregar CSS para animaciones
    if (!document.getElementById('chat-animations')) {
      const style = document.createElement('style');
      style.id = 'chat-animations';
      style.textContent = `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    console.log('💬 Chatbot funcional iniciado');
  };

  // Función para actualizar header del chat
  const updateChatHeader = (title, bgColor) => {
    const header = document.getElementById('chat-header');
    if (header) {
      header.style.background = `linear-gradient(135deg, ${bgColor}, #059669)`;
      const titleDiv = header.querySelector('div div:first-child');
      if (titleDiv) {
        titleDiv.textContent = title;
      }
      const statusDiv = header.querySelector('div div:last-child');
      if (statusDiv) {
        statusDiv.textContent = title.includes('Real') ? '✅ Conectado' : '🔄 Funcionando';
      }
    }
  };

  // Función para mostrar estado de carga
  const showLoadingState = () => {
    let chatContainer = document.getElementById('unified-chatbot-container');
    if (chatContainer) {
      chatContainer.remove();
    }
    
    chatContainer = document.createElement('div');
    chatContainer.id = 'unified-chatbot-container';
    chatContainer.style.cssText = `
      position: fixed !important;
      left: 20px !important;
      bottom: 140px !important;
      width: 360px !important;
      height: 500px !important;
      z-index: 999999 !important;
      background: white !important;
      border-radius: 15px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      border: 2px solid #2DD4BF !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      height: 40px !important;
      background: linear-gradient(135deg, #2DD4BF, #14B8A6) !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 15px !important;
      color: white !important;
      font-weight: bold !important;
      font-size: 14px !important;
    `;
    
    header.innerHTML = `
      <span>🤖 Conectando a IA Real...</span>
      <button id="close-loading-chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 5px;">✖️</button>
    `;

    const loadingContent = document.createElement('div');
    loadingContent.style.cssText = `
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      padding: 40px 20px !important;
      text-align: center !important;
      color: #374151 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;

    loadingContent.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px; animation: bounce 2s infinite;">🤖</div>
      <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #2DD4BF; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
      <h3 style="margin: 0 0 10px 0; color: #2DD4BF; font-size: 18px;">Conectando con IA...</h3>
      <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #6B7280;">
        Estableciendo conexión con el asistente inteligente
      </p>
    `;

    chatContainer.appendChild(header);
    chatContainer.appendChild(loadingContent);
    document.body.appendChild(chatContainer);

    // Event listener para cerrar
    document.getElementById('close-loading-chat').onclick = () => {
      chatContainer.remove();
      setChatVisible(false);
    };

    // Añadir animaciones CSS
    if (!document.getElementById('loading-animations')) {
      const style = document.createElement('style');
      style.id = 'loading-animations';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `;
      document.head.appendChild(style);
    }

    console.log('⏳ Mostrando loading del chatbot');
  };

  // Función para buscar y verificar iframe de Chatbase
  const checkForChatbaseIframe = () => {
    console.log('🔍 Buscando iframe de Chatbase...');
    
    // Buscar iframes de diferentes maneras
    let chatIframes = document.querySelectorAll('iframe[src*="chatbase.co"]');
    
    if (chatIframes.length === 0) {
      // Buscar por otros atributos
      chatIframes = document.querySelectorAll('iframe[src*="widget"]');
    }
    
    if (chatIframes.length === 0) {
      // Buscar cualquier iframe que pueda ser de chatbase
      const allIframes = document.querySelectorAll('iframe');
      console.log(`🔍 Encontrados ${allIframes.length} iframes en total`);
      
      for (let iframe of allIframes) {
        console.log('🔍 Iframe encontrado:', iframe.src);
        if (iframe.src && (iframe.src.includes('chatbase') || iframe.src.includes('widget'))) {
          chatIframes = [iframe];
          break;
        }
      }
    }
    
    if (chatIframes.length > 0) {
      console.log(`✅ ${chatIframes.length} iframe(s) de chatbase encontrado(s)`);
      createUnifiedChatbot(chatIframes[0]);
    } else {
      console.log('⚠️ No se encontró iframe de Chatbase - usando fallback');
      showFallbackContent();
    }
  };

  // Función para crear contenedor unificado con el chatbot real
  const createUnifiedChatbot = (sourceIframe = null) => {
    try {
      console.log('🎯 Creando contenedor unificado...');
      
      // Buscar el iframe si no se proporciona
      let chatIframes = sourceIframe ? [sourceIframe] : document.querySelectorAll('iframe[src*="chatbase.co"], iframe[src*="widget"]');
      
      if (chatIframes.length === 0) {
        console.log('⚠️ No se encontró iframe de Chatbase en createUnifiedChatbot');
        showFallbackContent();
        return;
      }

      console.log(`✅ Usando iframe: ${chatIframes[0].src}`);

      // Ocultar elementos originales del chatbot
      const allChatbaseElements = document.querySelectorAll(
        'iframe[src*="chatbase.co"], iframe[src*="widget"], [id*="chatbase"]:not(#unified-chatbot-container), [class*="chatbase"]'
      );
      
      allChatbaseElements.forEach(element => {
        try {
          element.style.setProperty('display', 'none', 'important');
          element.style.setProperty('visibility', 'hidden', 'important');
          element.style.setProperty('opacity', '0', 'important');
        } catch (e) {
          // Ignorar errores
        }
      });

      // Actualizar contenedor existente en lugar de recrear
      let chatContainer = document.getElementById('unified-chatbot-container');
      if (!chatContainer) {
        console.log('⚠️ No se encontró contenedor existente');
        showFallbackContent();
        return;
      }

      // Actualizar header para mostrar que es real
      const existingHeader = chatContainer.querySelector('div:first-child');
      if (existingHeader) {
        existingHeader.innerHTML = `
          <span>🤖 Innovating Bot (IA Real) ✅</span>
          <button id="close-real-chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 5px;">✖️</button>
        `;
        existingHeader.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      }

      // Limpiar contenido actual y añadir iframe
      const iframeContainer = chatContainer.querySelector('div:last-child') || chatContainer;
      iframeContainer.innerHTML = '';
      iframeContainer.style.cssText = `
        flex: 1 !important;
        width: 100% !important;
        height: calc(100% - 40px) !important;
        overflow: hidden !important;
        background: white !important;
      `;

      // Clonar el iframe real de Chatbase
      const originalIframe = chatIframes[0];
      const newIframe = document.createElement('iframe');
      
      // Intentar copiar el src y otros atributos importantes
      newIframe.src = originalIframe.src;
      if (originalIframe.title) newIframe.title = originalIframe.title;
      if (originalIframe.name) newIframe.name = originalIframe.name;
      
      newIframe.style.cssText = `
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        background: white !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;

      // Configurar atributos de seguridad
      newIframe.allow = "camera; microphone; geolocation";
      newIframe.sandbox = "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation";

      let iframeLoaded = false;
      
      newIframe.onload = () => {
        console.log('✅ Iframe del chatbot cargado correctamente');
        iframeLoaded = true;
      };
      
      newIframe.onerror = () => {
        console.log('❌ Error cargando iframe del chatbot');
        if (!iframeLoaded) {
          iframeContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #EF4444;">
              <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
              <div>Error cargando el chat</div>
              <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 16px; background: #2DD4BF; color: white; border: none; border-radius: 8px; cursor: pointer;">Recargar</button>
            </div>
          `;
        }
      };
      
      // Timeout para verificar carga
      setTimeout(() => {
        if (!iframeLoaded) {
          console.log('⏰ Timeout cargando iframe - intentando de todos modos');
        }
      }, 5000);

      iframeContainer.appendChild(newIframe);

      // Event listener para cerrar
      const closeBtn = document.getElementById('close-real-chat');
      if (closeBtn) {
        closeBtn.onclick = () => {
          chatContainer.remove();
          setChatVisible(false);
          // Cerrar también el chatbot original si existe
          try {
            if (window.chatbase) {
              window.chatbase('close');
            }
          } catch (e) {
            // Ignorar errores
          }
        };
      }

      console.log('✅ Chatbot real integrado correctamente');
      
    } catch (error) {
      console.log('❌ Error integrando chatbot real:', error.message);
      showFallbackContent();
    }
  };

  // Función de fallback mejorada
  const showFallbackContent = () => {
    let chatContainer = document.getElementById('unified-chatbot-container');
    if (chatContainer) {
      chatContainer.remove();
    }
    
    chatContainer = document.createElement('div');
    chatContainer.id = 'unified-chatbot-container';
    chatContainer.style.cssText = `
      position: fixed !important;
      left: 20px !important;
      bottom: 140px !important;
      width: 360px !important;
      height: 500px !important;
      z-index: 999999 !important;
      background: white !important;
      border-radius: 15px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      border: 2px solid #2DD4BF !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      height: 40px !important;
      background: linear-gradient(135deg, #FF6B6B, #EE5A52) !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 15px !important;
      color: white !important;
      font-weight: bold !important;
      font-size: 14px !important;
    `;
    
    header.innerHTML = `
      <span>🤖 Innovating Bot (Modo Offline)</span>
      <button id="close-fallback-chat" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 5px;">✖️</button>
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      flex: 1 !important;
      padding: 20px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      text-align: center !important;
      color: #374151 !important;
    `;

    content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">🔄</div>
      <h3 style="margin: 0 0 10px 0; color: #EF4444; font-size: 18px;">Conexión en proceso...</h3>
      <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5; color: #6B7280;">
        Estoy intentando conectar con el asistente de IA. 
        <br>Mientras tanto, aquí tienes algunos consejos:
      </p>
      <div style="background: #F0FDF4; padding: 15px; border-radius: 10px; border: 1px solid #BBF7D0; margin-top: 10px;">
        <div style="font-size: 14px; color: #059669; line-height: 1.4;">
          💡 <strong>Fase ${phase}:</strong> ${getPhaseAdvice()}
        </div>
      </div>
      <button id="retry-connection" style="
        background: #2DD4BF !important;
        color: white !important;
        border: none !important;
        padding: 10px 20px !important;
        border-radius: 20px !important;
        margin-top: 15px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        transition: background 0.2s !important;
      ">🔄 Reintentar conexión</button>
    `;

    chatContainer.appendChild(header);
    chatContainer.appendChild(content);
    document.body.appendChild(chatContainer);

    // Event listeners
    document.getElementById('close-fallback-chat').onclick = () => {
      chatContainer.remove();
      setChatVisible(false);
    };

    document.getElementById('retry-connection').onclick = () => {
      chatContainer.remove();
      loadChatbaseScriptOriginal();
    };

    console.log('📱 Modo fallback activado');
  };

  const getPhaseAdvice = () => {
    const advice = {
      1: "Busca compañeros con habilidades complementarias para formar tu equipo.",
      2: "Conoce mejor a tus compañeros de equipo y definan roles claros.",
      3: "Piensa en problemas reales que observes en tu entorno diario.",
      4: "Define claramente qué problema resuelves y para quién.",
      5: "Prepara una presentación convincente de tu proyecto.",
      6: "¡Felicitaciones! Has completado todos los desafíos."
    };
    return advice[phase] || advice[1];
  };

  // Seleccionar el video apropiado según la fase
  const getVideoForPhase = () => {
    if (showTokens) return '/assets/videos/robot_celebration.webm';
    
    switch(phase) {
      case 1:
      case 2:
        return '/assets/videos/robot_explaining.webm';
      case 3:
      case 4:
        return '/assets/videos/robot_thinking.webm';
      case 5:
      case 6:
        return '/assets/videos/robot_celebration.webm';
      default:
        return '/assets/videos/robot_idle.webm';
    }
  };

  // Mensaje según la fase
  const getMessage = () => {
    if (showTokens) return "¡Felicitaciones! Has ganado tokens 🎉";
    
    switch(phase) {
      case 1:
        return "¡Hola, soy tu Robot Guía!";
      case 2:
        return "¡Vamos a trabajar en equipo!";
      case 3:
        return "¡Hora de ser creativos!";
      case 4:
        return "¡Desarrollen su idea!";
      case 5:
        return "¡Tiempo de evaluar!";
      case 6:
        return "¡Excelente trabajo!";
      default:
        return "¡Hola, soy tu Robot Guía!";
    }
  };

  const videoSrc = getVideoForPhase();
  const isLoading = !videoLoaded;

  // Inyectar estilos CSS en el head
  useEffect(() => {
    if (!document.getElementById('missy-video-styles')) {
      const style = document.createElement('style');
      style.id = 'missy-video-styles';
      style.textContent = videoGifStyles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <>
      <div className={`
        ${positioning === 'fixed' ? 'fixed bottom-4 left-4' : 'relative'}
        ${positioning === 'fixed' ? 'z-50' : 'z-10'}
        cursor-pointer
        select-none
        transition-transform duration-300
        ${isHovered ? 'scale-110' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleChatbotClick}
      >
        {/* Robot Video */}
        <div className="relative">
          <video
            ref={videoRef}
            className="missy-video w-16 h-16 object-cover rounded-full border-4 border-turquoise-500 shadow-lg"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={(e) => {
              console.log('Error cargando video:', e);
              setVideoLoaded(false);
            }}
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-turquoise-500 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          
          {/* Indicador de hover */}
          {isHovered && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
          )}
        </div>
        
        {/* Mensaje del robot */}
        <div className="absolute bottom-16 left-0 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-turquoise-200 min-w-max max-w-xs">
          <div className="text-sm font-medium text-gray-800">
            {getMessage()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            💬 Haz clic para chatear
          </div>
          {/* Flecha del mensaje */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>
        </div>
      </div>
    </>
  );
}