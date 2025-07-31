import 'dotenv/config';
import App from './app';

const startServer = async () => {
  try {
    const app = new App();
    await app.connectToDatabase();
    app.listen();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
