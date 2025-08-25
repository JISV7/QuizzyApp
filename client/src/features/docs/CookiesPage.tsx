// CookiesPage.tsx

import { useState, useEffect } from 'react';

// Definimos un tipo para las preferencias para mayor claridad
type CookiePreferences = {
  analytics: boolean;
  social: boolean;
  advertising: boolean;
};

export const CookiesPage = () => {
  // Estado para las opciones de cookies
  const [analytics, setAnalytics] = useState(true);
  const [social, setSocial] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  // Estado para el mensaje de confirmación
  const [showConfirmation, setShowConfirmation] = useState(false);

  // useEffect se ejecuta cuando el componente se monta por primera vez.
  // Lo usamos para cargar las preferencias guardadas desde sessionStorage.
  useEffect(() => {
    const savedPreferences = sessionStorage.getItem('cookiePreferences');
    
    if (savedPreferences) {
      // Si existen preferencias guardadas, las parseamos y actualizamos el estado.
      const parsedPreferences: CookiePreferences = JSON.parse(savedPreferences);
      setAnalytics(parsedPreferences.analytics);
      setSocial(parsedPreferences.social);
      setAdvertising(parsedPreferences.advertising);
    }
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez al montar el componente

  // Función para manejar el guardado de las preferencias
  const handleSavePreferences = () => {
    // Creamos un objeto con las preferencias actuales
    const currentPreferences: CookiePreferences = {
      analytics,
      social,
      advertising,
    };

    // Guardamos el objeto como un string JSON en sessionStorage
    sessionStorage.setItem('cookiePreferences', JSON.stringify(currentPreferences));

    // Mostramos un mensaje de confirmación
    setShowConfirmation(true);

    // Ocultamos el mensaje después de 3 segundos para un efecto visual
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  return (
    <div className="doc-section">
      <h2>Preferencias de Cookies</h2>
      <p>Utilizamos cookies para mejorar tu experiencia. Puedes gestionar tus preferencias a continuación.</p>

      <div className="cookie-settings">
        {/* Checkbox para Analítica */}
        <div className="cookie-option">
          <input 
            type="checkbox" 
            id="analytics" 
            checked={analytics} 
            onChange={e => setAnalytics(e.target.checked)} 
          />
          <label htmlFor="analytics">
            <strong>Cookies de Analítica</strong>
            <br/>
            Nos ayudan a entender cómo los visitantes interactúan con el sitio web.
          </label>
        </div>
        
        {/* Checkbox para Redes Sociales */}
        <div className="cookie-option">
          <input 
            type="checkbox" 
            id="social" 
            checked={social} 
            onChange={e => setSocial(e.target.checked)} 
          />
          <label htmlFor="social">
            <strong>Cookies de Redes Sociales</strong>
            <br/>
            Permiten la integración con plataformas de redes sociales.
          </label>
        </div>

        {/* Checkbox para Publicidad */}
        <div className="cookie-option">
          <input 
            type="checkbox" 
            id="advertising" 
            checked={advertising} 
            onChange={e => setAdvertising(e.target.checked)} 
          />
          <label htmlFor="advertising">
            <strong>Cookies de Publicidad</strong>
            <br/>
            Se utilizan para mostrarte anuncios relevantes para ti.
          </label>
        </div>
      </div>
      
      {/* El botón ahora llama a la función de guardado */}
      <button 
        onClick={handleSavePreferences} 
        className="btn btn-primary" 
        style={{ marginTop: '20px' }}
      >
        Guardar Preferencias
      </button>

      {/* Mensaje de confirmación que aparece al guardar */}
      {showConfirmation && (
        <p style={{ color: 'green', marginTop: '15px' }}>
          ¡Tus preferencias han sido guardadas! ✅
        </p>
      )}
    </div>
  );
};