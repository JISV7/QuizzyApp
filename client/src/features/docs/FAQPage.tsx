import { useState } from 'react';
import '@/features/docs/DocsPage.css';

// Datos de las preguntas frecuentes
const faqData = [
  {
    category: 'Generales',
    questions: [
      {
        q: '¿Qué es Quizzy?',
        a: 'Quizzy es una aplicación web minimalista diseñada para que profesores y educadores puedan crear, gestionar y compartir quizzes o evaluaciones de selección múltiple de manera rápida y sencilla. Los estudiantes pueden unirse a cursos y resolver los quizzes fácilmente a través de un enlace.',
      },
      {
        q: '¿Quizzy tiene algún costo?',
        a: 'No, Quizzy es una herramienta completamente gratuita. Nuestro objetivo es ofrecer un sistema ágil y sin costo para la gestión de evaluaciones.',
      },
      {
        q: '¿Qué necesito para empezar a usar Quizzy?',
        a: 'Solo necesitas registrarte. Si eres profesor, podrás crear cursos y quizzes inmediatamente. Si eres estudiante, sólo necesitas el enlace de invitación de tu profesor para unirte.',
      },
      {
        q: '¿Qué hago si olvido mi contraseña?',
        a: 'Actualmente, las contraseñas no se pueden recuperar por correo. Si no puedes acceder a tu cuenta, te recomendamos ponerte en contacto con nuestro equipo de soporte a través de la página de "Contacto".',
      },
    ],
  },
  {
    category: 'Para Profesores',
    questions: [
      {
        q: '¿Cómo creo un nuevo curso?',
        a: 'Una vez que inicies sesión, en tu sección “Mis Cursos”, verás la opción para "Crear Curso". Simplemente asigna un nombre y una descripción. Luego puedes compartir con tus estudiantes el enlace de invitación para que puedan unirse.',
      },
      {
        q: '¿Cómo creo un quiz?',
        a: 'Dentro de la página de detalle de uno de tus cursos, encontrarás la opción para "Crear Asignación". Desde allí, podrás acceder al editor de quizzes, donde podrás añadir un título, una descripción, y crear las preguntas.',
      },
      {
        q: '¿Puedo establecer fechas límite para los quizzes?',
        a: 'Sí. Al crear una asignación, puedes configurar una fecha y hora de inicio y de cierre. Los estudiantes solo podrán acceder y responder el quiz dentro de ese período.',
      },
      {
        q: '¿Cómo veo los resultados de mis estudiantes?',
        a: 'Dentro de cada curso, haz clic en una asignación para ver los resultados. Allí encontrarás una lista con las calificaciones y respuestas de cada estudiante.',
      },
    ],
  },
  {
    category: 'Para Estudiantes',
    questions: [
        {
            q: '¿Cómo me uno a un curso?',
            a: 'Para unirte a un curso, necesitas un enlace de invitación que te proporcionará tu profesor. Una vez que hayas iniciado sesión, simplemente abre el enlace en el mismo navegador y serás añadido automáticamente al curso.'
        },
        {
            q: '¿Cómo sé cuándo tengo un quiz pendiente?',
            a: 'En tu panel principal encontrarás la sección "Calendario", que muestra todas tus actividades y fechas de entrega. Las asignaciones aparecen marcadas para que puedas organizar tu tiempo fácilmente.'
        },
        {
            q: '¿Dónde puedo ver mis calificaciones?',
            a: 'Después de completar un quiz, el sistema te mostrará tu resultado inmediatamente. También podrás ver un historial de tus envíos y calificaciones en la sección de cada asignación dentro del curso.'
        }
    ]
  },
  {
    category: 'Límites y Capacidades',
    questions: [
        {
            q: '¿Cuántos cursos puedo crear?',
            a: 'No hay límite. Puedes crear todos los cursos que necesites para gestionar tus clases.'
        },
        {
            q: '¿Cuántas asignaciones (quizzes) puede tener un curso?',
            a: 'Un curso puede contener un número ilimitado de asignaciones.'
        },
        {
            q: '¿Cuántas preguntas puede tener un quiz?',
            a: 'No hay un límite definido. Puedes diseñar quizzes tan extensos como lo requiera tu evaluación.'
        },
        {
            q: '¿Cuántas opciones de respuesta puede tener una pregunta?',
            a: 'Cada pregunta debe tener un mínimo de dos opciones, pero no hay un límite máximo. Puedes añadir tantas alternativas como necesites.'
        },
        {
            q: '¿Cuál es el puntaje máximo para una pregunta o un quiz?',
            a: 'Puedes asignar cualquier puntaje razonable a tus preguntas (hasta 10,000 puntos por pregunta). El puntaje total del quiz se calcula automáticamente sumando los puntos de cada pregunta, por lo que no tiene un límite predefinido.'
        }
    ]
  }
];

// Componente para un solo item de FAQ (pregunta y respuesta)
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className={`faq-icon ${isOpen ? 'open' : ''}`}>+</span>
      </button>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

// Componente principal de la página de FAQ
export const FAQPage = () => {
  return (
    <div className="doc-section">
      <h2>Preguntas Frecuentes (FAQ)</h2>
      <p>Aquí encontrarás respuestas a las preguntas más comunes sobre Quizzy. Si no encuentras lo que buscas, no dudes en contactarnos.</p>
      
      {faqData.map((categoryItem) => (
        <div key={categoryItem.category} className="faq-category">
          <h3>{categoryItem.category}</h3>
          {categoryItem.questions.map((item) => (
            <FAQItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      ))}
    </div>
  );
};