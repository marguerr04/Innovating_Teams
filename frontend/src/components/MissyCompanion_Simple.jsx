import React, { useState, useRef, useEffect } from 'react';

const MissyCompanion = () => {
  const [isChatVisible, setChatVisible] = useState(false);
  const isLoadedRef = useRef(false);
  const chatContainerRef = useRef(null);

  // Función simplificada y optimizada para mostrar el chatbot
  const showChatbot = () => {
    console.log('🤖 Mostrando chatbot...');

    // Verificar si ya existe un contenedor
    let container = document.querySelector('[data-innovating-chatbot]');
    
    if (container) {
      // Reutilizar contenedor existente
      container.style.display = 'flex';
      setChatVisible(true);
      console.log('♻️ Reutilizando contenedor existente');
      return;
    }

    // Cargar script de Chatbase si no está cargado
    if (!window.chatbase && !isLoadedRef.current) {
      loadChatbaseScript();
      return;
    }

    // Si ya está disponible, crear interfaz inmediatamente
    if (window.chatbase) {
      createChatInterface();
    }
  };

  const loadChatbaseScript = () => {
    console.log('📜 Cargando Chatbase script...');
    isLoadedRef.current = true;

    // Configuración
    window.embeddedChatbotConfig = {
      chatbotId: "NDIGyY6LjlULvnmM9GEOX",
      domain: "www.chatbase.co"
    };

    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.defer = true;

    script.onload = () => {
      console.log('✅ Chatbase cargado');
      setTimeout(() => {
        if (window.chatbase) {
          createChatInterface();
        }
      }, 500);
    };

    script.onerror = () => {
      console.error('❌ Error cargando Chatbase');
      showFallback();
    };

    document.head.appendChild(script);
  };

  const createChatInterface = () => {
    console.log('🏗️ Creando interfaz de chat...');

    try {
      // Abrir chatbase para generar iframe
      window.chatbase('open');

      // Buscar iframe después de un breve delay
      setTimeout(() => {
        const iframes = document.querySelectorAll('iframe');
        let chatbaseIframe = null;

        // Buscar iframe de Chatbase
        for (let iframe of iframes) {
          if (iframe.src && (iframe.src.includes('chatbase') || iframe.src.includes('widget'))) {
            chatbaseIframe = iframe;
            break;
          }
        }

        // Si no se encuentra por src, usar el más grande
        if (!chatbaseIframe && iframes.length > 0) {
          chatbaseIframe = Array.from(iframes).reduce((largest, current) => {
            const currentSize = current.offsetWidth * current.offsetHeight;
            const largestSize = largest ? largest.offsetWidth * largest.offsetHeight : 0;
            return currentSize > largestSize ? current : largest;
          });
        }

        if (chatbaseIframe) {
          console.log('🎯 Iframe encontrado, creando contenedor...');
          createCustomContainer(chatbaseIframe);
        } else {
          console.log('⚠️ No se encontró iframe, mostrando fallback');
          showFallback();
        }
      }, 1000);

    } catch (error) {
      console.error('Error creando interfaz:', error);
      showFallback();
    }
  };

  const createCustomContainer = (iframe) => {
    // Crear contenedor persistente
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

    // Header
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

    // Contenedor del iframe
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
      flex: 1 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      background: white !important;
    `;

    // Configurar iframe
    iframe.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      background: white !important;
    `;

    // Event listeners
    header.querySelector('button').onclick = () => {
      container.style.display = 'none';
      setChatVisible(false);
      try { window.chatbase('close'); } catch(e) {}
    };

    // Ensamblar
    const originalParent = iframe.parentNode;
    iframeContainer.appendChild(iframe);
    container.appendChild(header);
    container.appendChild(iframeContainer);
    document.body.appendChild(container);

    // Ocultar contenedor original
    if (originalParent && originalParent !== iframeContainer) {
      originalParent.style.display = 'none';
    }

    setChatVisible(true);
    chatContainerRef.current = container;
    console.log('✅ Chat creado exitosamente');
  };

  const showFallback = () => {
    console.log('🔄 Mostrando fallback...');
    
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
      border: 2px solid #ef4444 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      font-family: system-ui, sans-serif !important;
    `;

    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); height: 50px; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; color: white; font-weight: bold;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="font-size: 20px;">🤖</div>
          <div>
            <div style="font-size: 16px;">Innovating Bot (Sin conexión)</div>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.style.display='none'" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
      </div>
      <div style="flex: 1; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #ef4444;">No se pudo conectar</div>
        <div style="font-size: 14px; color: #666; margin-bottom: 20px;">Hay un problema con la conexión al chatbot de IA.</div>
        <button onclick="location.reload()" style="background: #10B981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px;">🔄 Reintentar</button>
      </div>
    `;

    document.body.appendChild(container);
    setChatVisible(true);
  };

  const toggleChat = () => {
    if (isChatVisible) {
      const container = document.querySelector('[data-innovating-chatbot]');
      if (container) {
        container.style.display = 'none';
        setChatVisible(false);
      }
    } else {
      showChatbot();
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      const container = document.querySelector('[data-innovating-chatbot]');
      if (container) {
        container.remove();
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        cursor: 'pointer',
      }}
    >
      {/* Robot animado */}
      <div
        onClick={toggleChat}
        style={{
          width: '70px',
          height: '70px',
          backgroundColor: '#10B981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          transition: 'all 0.3s ease',
          border: '3px solid white',
          animation: 'pulse 2s infinite',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.backgroundColor = '#059669';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.backgroundColor = '#10B981';
        }}
      >
        🤖
      </div>

      {/* Globo de diálogo */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '0px',
          backgroundColor: 'white',
          padding: '12px 16px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          whiteSpace: 'nowrap',
          opacity: isChatVisible ? 0 : 1,
          transform: isChatVisible ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        ¡Hola, soy tu Robot Guía!
        <br />
        🎯 Haz clic para chatear
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '30px',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid white',
          }}
        />
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6); }
        }
      `}</style>
    </div>
  );
};

export default MissyCompanion;