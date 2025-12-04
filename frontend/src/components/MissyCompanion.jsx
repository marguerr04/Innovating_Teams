import React, { useState, useEffect, useRef } from 'react';

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

const MissyCompanion = ({ phase, showTokens, positioning = 'fixed' }) => {
  const videoRef = useRef(null);
  const scriptInjectedRef = useRef(false);
  const chatContainerRef = useRef(null);
  const chatbaseIframeRef = useRef(null);
  const movedIframeRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatVisible, setChatVisible] = useState(false);
  const chatEnabled = !showTokens;

  const HIGHLIGHT_CONTAINER_SELECTOR = '[data-innovating-chatbot]';

  const hideChatInterface = (teardown = false) => {
    const container = document.querySelector(HIGHLIGHT_CONTAINER_SELECTOR);
    if (container) {
      container.style.display = 'none';
    }
    try {
      closeChatbaseInstance();
    } catch (err) {
      console.warn('⚠️ No se pudo cerrar Chatbase limpiamente', err);
    }
    if (teardown) {
      if (container) {
        container.remove();
      }
      restoreOriginalIframePlacement();
      chatContainerRef.current = null;
    }
    setChatVisible(false);
  };

  // Limpiar chat al cambiar de fase
  useEffect(() => {
    if (!chatEnabled) return;
    hideChatInterface(true);
  }, [phase, chatEnabled]);

  // Inyectar estilos CSS en el head
  useEffect(() => {
    if (!document.getElementById('missy-video-styles')) {
      const style = document.createElement('style');
      style.id = 'missy-video-styles';
      style.textContent = videoGifStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Cargar script oficial de Chatbase UNA SOLA VEZ al montar
  useEffect(() => {
    if (!chatEnabled) return () => {};

    if (!scriptInjectedRef.current) {
      console.log('🚀 Cargando script OFICIAL de Chatbase...');
      loadOfficialChatbaseScript();
    }

    return () => {
      hideChatInterface(true);
    };
  }, [chatEnabled]);

  useEffect(() => {
    if (chatEnabled) return;
    hideChatInterface(true);
  }, [chatEnabled]);

  const loadOfficialChatbaseScript = () => {
    if (scriptInjectedRef.current) return;
    scriptInjectedRef.current = true;

    if (typeof window !== 'undefined') {
      if (window.__innovatingChatbaseLoaded) {
        console.log('ℹ️ Script de Chatbase ya estaba disponible');
        return;
      }
      if (document.getElementById('NDIGyY6LjlULvnmM9GEOX')) {
        console.log('ℹ️ Detectado script existente de Chatbase');
        window.__innovatingChatbaseLoaded = true;
        return;
      }
    }

    window.embeddedChatbotConfig = {
      chatbotId: 'NDIGyY6LjlULvnmM9GEOX',
      domain: 'www.chatbase.co',
    };

    (function(){
      if(!window.chatbase||window.chatbase('getState')!=='initialized'){
        window.chatbase=(...args)=>{
          if(!window.chatbase.q){window.chatbase.q=[];}
          window.chatbase.q.push(args);
        };
        window.chatbase=new Proxy(window.chatbase,{
          get(target,prop){
            if(prop==='q'){return target.q;}
            return(...params)=>target(prop,...params);
          }
        });
      }
      const onLoad=function(){
        const script=document.createElement('script');
        script.src='https://www.chatbase.co/embed.min.js';
        script.id='NDIGyY6LjlULvnmM9GEOX';
        script.domain='www.chatbase.co';
        script.defer = true;
        script.onload = () => console.log('✅ Script de Chatbase cargado');
        script.onerror = () => console.error('❌ Error cargando Chatbase oficial');
        document.body.appendChild(script);
        window.__innovatingChatbaseLoaded = true;
      };
      if(document.readyState==='complete'){
        onLoad();
      } else {
        window.addEventListener('load',onLoad);
      }
    })();
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

  const callChatbaseAction = (action) => {
    if (typeof window === 'undefined') return false;

    try {
      if (typeof window.chatbase !== 'function') {
        console.warn('⚠️ Chatbase aún no expone su API');
        return false;
      }

      window.chatbase(action);
      return true;
    } catch (error) {
      console.warn(`⚠️ Acción de Chatbase falló: ${action}`, error);
      return false;
    }
  };

  const openChatbaseInstance = () => {
    const success = callChatbaseAction('open');
    if (!success) {
      console.log('⏳ Reintentando abrir Chatbase en 400ms...');
      setTimeout(() => callChatbaseAction('open'), 400);
    }
  };

  const closeChatbaseInstance = () => {
    callChatbaseAction('close');
  };

  const handleChatbotClick = () => {
    console.log('\n🖱️ ========== CLICK EN ROBOT ==========');

    if (!chatEnabled) return;

    if (isChatVisible) {
      hideChatInterface();
      console.log('✅ Chatbot cerrado desde el contenedor personalizado');
      return;
    }

    showChatInterface();
  };

  const showChatInterface = () => {
    if (!chatEnabled) return;

    const existing = document.querySelector(HIGHLIGHT_CONTAINER_SELECTOR);
    if (existing) {
      existing.style.display = 'flex';
      setChatVisible(true);
      openChatbaseInstance();
      return;
    }

    console.log('⏳ Intentando inicializar Chatbase real...');
    openChatbaseInstance();
    waitForIframeAndMount();
  };

  const MAX_IFRAME_ATTEMPTS = 24;

  const isLikelyChatbaseIframe = (iframe) => {
    if (!iframe) return false;
    const inspectedValues = [
      iframe.id,
      iframe.className,
      iframe.title,
      iframe.name,
      iframe.dataset?.src,
      iframe.dataset?.iframeUrl,
      iframe.dataset?.iframeSrc,
      iframe.getAttribute?.('src'),
      iframe.src,
      iframe.getAttribute?.('srcdoc'),
      iframe.srcdoc,
    ];

    const parentSignature = iframe.parentElement
      ? `${iframe.parentElement.id ?? ''} ${iframe.parentElement.className ?? ''}`
      : '';

    return [...inspectedValues, parentSignature]
      .filter(Boolean)
      .some((value) => {
        const normalized = value.toString().toLowerCase();
        return (
          normalized.includes('chatbase') ||
          normalized.includes('chatbot') ||
          normalized.includes('widget')
        );
      });
  };

  const waitForIframeAndMount = (attempt = 0) => {
    const iframe = findChatbaseIframe();
    if (iframe) {
      chatbaseIframeRef.current = iframe;
      createCustomContainer(iframe);
      return;
    } else {
      console.log('🔍 Buscando iframe real de Chatbase...');
    }

    if (attempt > MAX_IFRAME_ATTEMPTS) {
      console.warn('⚠️ No se logró ubicar el iframe listo de Chatbase');
      showFallback();
      return;
    }

    setTimeout(() => waitForIframeAndMount(attempt + 1), 600);
  };

  const findChatbaseIframe = () => {
    const iframes = document.querySelectorAll('iframe');
    let candidate = null;

    iframes.forEach((iframe) => {
      if (isLikelyChatbaseIframe(iframe)) {
        candidate = iframe;
      }
    });

    if (!candidate && iframes.length) {
      candidate = Array.from(iframes).reduce((largest, current) => {
        const largestArea = largest ? largest.offsetWidth * largest.offsetHeight : 0;
        const currentArea = current.offsetWidth * current.offsetHeight;
        return currentArea > largestArea ? current : largest;
      });
    }

    return candidate;
  };

  const moveIframeIntoContainer = (iframe, iframeContainer) => {
    if (!iframe || !iframeContainer) return false;
    const originalParent = iframe.parentNode;
    if (!originalParent) return false;

    const placeholder = document.createElement('div');
    placeholder.dataset.chatbasePlaceholder = '1';
    placeholder.style.display = 'none';
    originalParent.insertBefore(placeholder, iframe);

    const previousStyle = iframe.getAttribute('style');


    const interactiveProps = ['display', 'visibility', 'opacity', 'pointer-events'];
    interactiveProps.forEach((prop) => {
      iframe.style.removeProperty(prop);
    });

    iframe.style.setProperty('width', '100%', 'important');
    iframe.style.setProperty('height', '100%', 'important');
    iframe.style.setProperty('border', 'none', 'important');
    iframe.style.setProperty('background', 'transparent', 'important');
    iframe.style.setProperty('display', 'block', 'important');
    iframe.style.setProperty('opacity', '1', 'important');
    iframe.style.setProperty('pointer-events', 'auto', 'important');

    delete iframe.dataset.chatbaseHidden;

    iframeContainer.appendChild(iframe);

    movedIframeRef.current = {
      iframe,
      placeholder,
      parent: originalParent,
      previousStyle,
    };

    return true;
  };

  const restoreOriginalIframePlacement = () => {
    const info = movedIframeRef.current;
    if (!info) return;
    const { iframe, placeholder, parent, previousStyle } = info;

    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(iframe, placeholder);
      placeholder.remove();
    } else if (parent) {
      parent.appendChild(iframe);
    }

    if (previousStyle) {
      iframe.setAttribute('style', previousStyle);
    } else {
      iframe.removeAttribute('style');
    }

    movedIframeRef.current = null;
    chatbaseIframeRef.current = null;
  };

  const createCustomContainer = (iframe) => {
    console.log('🏗️ Montando contenedor personalizado para Chatbase...');

    if (!iframe) {
      console.warn('⚠️ No se recibió iframe real de Chatbase, usando fallback');
      showFallback();
      return;
    }

    const container = document.createElement('div');
    container.setAttribute('data-innovating-chatbot', 'true');
    container.style.cssText = `
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
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      font-family: system-ui, sans-serif !important;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(135deg, #10B981, #059669) !important;
      height: 50px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 15px !important;
      color: white !important;
      font-weight: bold !important;
    `;

    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="font-size: 20px;">🤖</div>
        <div>
          <div style="font-size: 16px;">Innovating Bot (IA Real)</div>
          <div style="font-size: 11px; opacity: 0.9;">✅ Conectado a Chatbase</div>
        </div>
      </div>
      <button style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 5px;">×</button>
    `;

    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
      flex: 1 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      background: white !important;
      position: relative !important;
    `;

    container.appendChild(header);
    container.appendChild(iframeContainer);
    document.body.appendChild(container);

    const moved = moveIframeIntoContainer(iframe, iframeContainer);
    if (!moved) {
      console.warn('⚠️ No se pudo mover el iframe original, usando fallback');
      container.remove();
      showFallback();
      return;
    }

    const closeButton = header.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        hideChatInterface();
      });
    }

    chatContainerRef.current = container;
    setChatVisible(true);
    console.log('✅ Chatbot montado correctamente');
  };

  const showFallback = () => {
    console.log('🔄 Mostrando fallback estático...');

    const fallback = document.createElement('div');
    fallback.setAttribute('data-innovating-chatbot', 'true');
    fallback.style.cssText = `
      position: fixed !important;
      left: 20px !important;
      bottom: 140px !important;
      width: 360px !important;
      height: 500px !important;
      z-index: 2147483647 !important;
      background: white !important;
      border-radius: 15px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      border: 2px solid #ef4444 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      font-family: system-ui, sans-serif !important;
    `;

    fallback.innerHTML = `
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); height: 50px; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; color: white; font-weight: bold;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="font-size: 20px;">🤖</div>
          <div>
            <div style="font-size: 16px;">Innovating Bot (Sin conexión)</div>
          </div>
        </div>
        <button style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
      </div>
      <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #ef4444;">No se pudo conectar</div>
        <div style="font-size: 14px; color: #666; margin-bottom: 20px;">Hay un problema con la conexión al chatbot de IA.</div>
        <button style="background: #10B981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">🔄 Reintentar</button>
      </div>
    `;

    const closeBtn = fallback.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => hideChatInterface(true));
    }

    const retryBtn = fallback.querySelector('button:last-of-type');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        fallback.remove();
        setChatVisible(false);
        showChatInterface();
      });
    }

    document.body.appendChild(fallback);
    chatContainerRef.current = fallback;
    setChatVisible(true);
  };

  return (
    <>
      <div
        className={`
          ${positioning === 'fixed' ? 'fixed' : 'absolute'}
          bottom-5
          left-5
          z-50
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
}; // Cierre del componente MissyCompanion

export default MissyCompanion;