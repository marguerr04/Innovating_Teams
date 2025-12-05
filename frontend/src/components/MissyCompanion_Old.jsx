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
              
              // Esperar y buscar el iframe de diferentes maneras - tiempo aumentado
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
                  }, 4000);
                }
              }, 3000);
              
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
      
      // Ocultar elementos originales de Chatbase EXCEPTO el iframe que vamos a mover
      const allChatbaseElements = document.querySelectorAll(
        '[id*="chatbase"]:not(iframe), [class*="chatbase"]:not(iframe), [class*="chat"]:not(iframe)'
      );
      
      allChatbaseElements.forEach(element => {
        if (element.id !== 'unified-chatbot-container' && element !== iframe) {
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
        z-index: 2147483647 !important;
        background: white !important;
        border-radius: 15px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
        border: 2px solid #10B981 !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        pointer-events: auto !important;
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
        z-index: 1 !important;
        pointer-events: auto !important;
      `;

      // Clonar y configurar el iframe - NUEVO: Mover en lugar de clonar
      const originalIframe = iframe;
      
      // No clonar, sino mover el iframe original
      originalIframe.style.cssText = `
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        background: white !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 1 !important;
        pointer-events: auto !important;
      `;

      // Configurar atributos del iframe
      originalIframe.allow = "camera; microphone; geolocation";
      if (originalIframe.sandbox) {
        originalIframe.sandbox = "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation";
      }

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
      
      // Mover el iframe original en lugar de clonar
      const originalParent = originalIframe.parentNode;
      iframeContainer.appendChild(originalIframe);
      
      // Ocultar el contenedor original de Chatbase para evitar conflictos
      if (originalParent) {
        originalParent.style.setProperty('display', 'none', 'important');
        originalParent.style.setProperty('visibility', 'hidden', 'important');
        originalParent.style.setProperty('opacity', '0', 'important');
        console.log('👻 Contenedor original de Chatbase ocultado para evitar conflictos');
      }
      
      // Forzar visibilidad y eliminar restricciones con protección continua
      const forceVisibility = () => {
        originalIframe.style.setProperty('display', 'block', 'important');
        originalIframe.style.setProperty('visibility', 'visible', 'important');
        originalIframe.style.setProperty('opacity', '1', 'important');
        originalIframe.style.setProperty('width', '100%', 'important');
        originalIframe.style.setProperty('height', '100%', 'important');
        originalIframe.style.setProperty('min-height', '400px', 'important');
        originalIframe.style.setProperty('pointer-events', 'auto', 'important');
        
        // Eliminar cualquier clase que pueda estar ocultando el contenido
        originalIframe.className = '';
        
        console.log('🔧 Estilos del iframe forzados para visibilidad máxima');
      };
      
      // Aplicar inmediatamente
      setTimeout(forceVisibility, 100);
      
      // Aplicar múltiples veces para evitar re-ocultamiento
      setTimeout(forceVisibility, 500);
      setTimeout(forceVisibility, 1000);
      setTimeout(forceVisibility, 2000);
      
      // Observer para detectar cambios de estilo y revertirlos
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const currentStyle = originalIframe.style.display;
            if (currentStyle === 'none' || originalIframe.style.visibility === 'hidden' || originalIframe.style.opacity === '0') {
              console.log('⚠️ Detectado intento de ocultar iframe - revirtiendo...');
              forceVisibility();
            }
          }
        });
      });
      
      observer.observe(originalIframe, { attributes: true, attributeFilter: ['style', 'class'] });
      
      // Limpiar observer después de un tiempo
      setTimeout(() => {
        observer.disconnect();
      }, 10000);

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

      // Proteger el contenedor de interferencias CSS
      const protectContainer = () => {
        chatContainer.style.setProperty('display', 'flex', 'important');
        chatContainer.style.setProperty('position', 'fixed', 'important');
        chatContainer.style.setProperty('z-index', '2147483647', 'important');
        chatContainer.style.setProperty('visibility', 'visible', 'important');
        chatContainer.style.setProperty('opacity', '1', 'important');
        iframeContainer.style.setProperty('display', 'block', 'important');
        iframeContainer.style.setProperty('height', 'calc(100% - 50px)', 'important');
        console.log('🛡️ Contenedor protegido contra interferencias CSS');
      };
      
      // Aplicar protección múltiples veces
      setTimeout(protectContainer, 200);
      setTimeout(protectContainer, 1000);
      setTimeout(protectContainer, 2000);
      setTimeout(protectContainer, 5000);

      // Manejar carga del iframe - simplificado
      let iframeLoaded = false;
      
      // Verificar si ya tiene contenido
      setTimeout(() => {
        try {
          // Verificar si el iframe tiene contenido
          if (originalIframe.contentWindow || originalIframe.src) {
            console.log('✅ Iframe de Chatbase ya tiene contenido');
            iframeLoaded = true;
            loadingDiv.style.display = 'none';
          }
        } catch (e) {
          console.log('⚠️ No se puede acceder al contenido del iframe (normal por CORS)');
          // Esto es normal por políticas CORS, ocultar loading después de un tiempo
          setTimeout(() => {
            loadingDiv.style.display = 'none';
          }, 2000);
        }
      }, 1000);
      
      originalIframe.onload = () => {
        console.log('✅ Iframe de Chatbase cargado correctamente');
        iframeLoaded = true;
        loadingDiv.style.display = 'none';
      };
      
      originalIframe.onerror = () => {
        console.log('❌ Error cargando iframe de Chatbase');
        if (!iframeLoaded) {
          loadingDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
            <div style="font-size: 14px;">Error de conexión</div>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #10B981; color: white; border: none; border-radius: 8px; cursor: pointer;">Recargar</button>
          `;
        }
      };
      
      // Timeout para verificar carga - aumentado
      setTimeout(() => {
        if (!iframeLoaded) {
          console.log('⏰ Timeout cargando iframe - removiendo indicador de carga de todos modos');
          loadingDiv.style.display = 'none';
        }
      }, 3000);

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

  // Efecto para limpiar al cambiar la visibilidad del chat
  useEffect(() => {
    if (!chatVisible) {
      // Limpiar contenedor unificado
      const existingChat = document.getElementById('unified-chatbot-container');
      if (existingChat) {
        existingChat.remove();
      }
      
      // Intentar cerrar chatbot original
      try {
        if (window.chatbase) {
          window.chatbase('close');
        }
      } catch (e) {
        // Ignorar errores
      }
    }

    // Cleanup al desmontar el componente
    return () => {
      const existingChat = document.getElementById('unified-chatbot-container');
      if (existingChat) {
        existingChat.remove();
      }
      
      try {
        if (window.chatbase) {
          window.chatbase('close');
        }
      } catch (e) {
        // Ignorar errores
      }
    };
  }, [chatVisible, phase]);

  // Seleccionar el video apropiado según la fase
  const getVideoForPhase = () => {
    if (showTokens) return '/assets/videos/robot/robot_celebration.webm';
    
    switch(phase) {
      case 1:
      case 2:
        return '/assets/videos/robot/robot_explaining.webm';
      case 3:
      case 4:
        return '/assets/videos/robot/robot_thinking.webm';
      case 5:
      case 6:
        return '/assets/videos/robot/robot_celebration.webm';
      default:
        return '/assets/videos/robot/robot_idle.webm';
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