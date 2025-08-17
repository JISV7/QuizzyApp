export const StatusPage = () => {
  return (
    <div className="doc-section">
      <h2>Estado del Sistema</h2>
      <div className="status-indicator">
        <div className="status-light-green"></div>
        <span>Servidor</span>
      </div>
      <br></br>
      <div className="status-indicator">
        <div className="status-light-green"></div>
        <span>API</span>
      </div>
      <br></br>
      <div className="status-indicator">
        <div className="status-light-green"></div>
        <span>Cliente</span>
      </div>
      <p style={{ marginTop: '20px' }}>No se han reportado incidentes en las últimas 24 horas.</p>
    </div>
  );
};