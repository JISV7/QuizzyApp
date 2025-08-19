import '@/components/Footer.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
  <footer className="site-footer">
    <div className="footer-links">
      <Link to="/" className="copyright">© 2025 Quizzy, Inc.</Link>
      <Link to="/docs/terms">Terms</Link>
      <Link to="/docs/privacy">Privacy</Link>
      <Link to="/docs/security">Security</Link>
      <Link to="/docs/status">Status</Link>
      <Link to="/docs/manuals">Docs</Link>
      <Link to="/docs/contact">Contact</Link>
      <Link to="/docs/cookies">Manage cookies</Link>
      <Link to="/docs/cookies">Do not share my info</Link>
    </div>
  </footer>
  );
};