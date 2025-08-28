import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './DocsPage.css';
import { Footer } from '@/components/Footer';

// Menú de navegación para las páginas de documentos
const docsMenu = [
  { path: '/docs/terms', label: 'Términos y Condiciones' },
  { path: '/docs/privacy', label: 'Política de Privacidad' },
  { path: '/docs/security', label: 'Seguridad' },
  { path: '/docs/manuals', label: 'Manuales de Usuario' },
  { path: '/docs/faq', label: 'Preguntas Frecuentes' },
  { path: '/docs/contact', label: 'Contacto' },
];

// Mapeo de rutas a títulos para el encabezado
const pageTitles: { [key: string]: string } = {
  '/docs/terms': 'Términos y Condiciones',
  '/docs/privacy': 'Política de Privacidad',
  '/docs/security': 'Seguridad',
  '/docs/manuals': 'Manuales de Usuario',
  '/docs/faq': 'Preguntas Frecuentes',
  '/docs/contact': 'Contacta con Nosotros',
  '/docs/cookies': 'Preferencias de Cookies',
};


export const DocsLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Documentación';

  return (
    <div className="docs-page-container">
      <header className="docs-header">
        <div className="docs-header-content">
          <a href="/" className="docs-logo">Quizzy</a>
          <h1>{title}</h1>
        </div>
      </header>
      <div className="docs-main-content">
        <aside className="docs-sidebar">
          <nav>
            <ul>
              {docsMenu.map(item => (
                <li key={item.path}>
                  <NavLink to={item.path}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="docs-content">
          <Outlet /> {/* Aquí se renderizará el contenido de cada página */}
        </main>
      </div>
      <Footer />
    </div>
  );
};