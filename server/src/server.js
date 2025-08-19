import dotenv from 'dotenv';
dotenv.config({
  path: './.env'
});

const startServer = async () => {
  try {
    const { connectDB } = await import('./config/database.js');
    const appModule = await import('./app.js');
    const app = appModule.default;

    const PORT = process.env.PORT || 8080;

    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor escuchando en: http://localhost:${PORT}/api/check`);
    });

  } catch (error) {
    console.error("❌ Error en arranque del servidor:", error);
    process.exit(1);
  }
};

startServer();
