import { useState } from 'react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío, por ahora solo mostramos un mensaje.
    setFeedback(`Gracias, ${name}. Tu mensaje ha sido enviado a QuizzyContact@gmail.com.`);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="doc-section">
      <h2>Contacta con Nosotros</h2>
      <p>¿Tienes preguntas o comentarios? Escríbenos a <a href="mailto:QuizzyContact@gmail.com">QuizzyContact@gmail.com</a> o utiliza el formulario a continuación.</p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Nombre de usuario</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Tu Correo Electrónico</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Mensaje</label>
          <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
      </form>
      {feedback && <p className="feedback-message">{feedback}</p>}
    </div>
  );
};