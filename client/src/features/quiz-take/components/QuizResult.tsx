import './QuizResult.css';

interface QuizResultProps {
    score: number;
    maxPoints: number;
    onBackToCourses: () => void;
}

export const QuizResult = ({ score, maxPoints, onBackToCourses }: QuizResultProps) => {
    const percentage = maxPoints > 0 ? Math.round((score / maxPoints) * 100) : 0;

    return (
        <div className="quiz-result-layout">
            <main className="quiz-result-content">
                <div className="result-card">
                    <header className="result-card-header">
                        <h1>¡Quiz Completado!</h1>
                        <p>Este es tu resultado final.</p>
                    </header>
                    <div className="score-display">
                        <p className="your-score">Tu puntaje</p>
                        <p className="score-value">{score} / {maxPoints}</p>
                        <p className="score-percentage">{percentage}%</p>
                    </div>
                    <div className="result-actions">
                        <button 
                            className="btn btn-primary" 
                            onClick={onBackToCourses}
                        >
                            Volver a Mis Cursos
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};