import express from 'express';
import path from 'path';
import ejs from 'ejs';
import mainRoutes from './routes/appRoutes';

const app = express();

// static file render configuration
app.use(express.static(path.join(__dirname, '../public')));

// render engine configuration
app.set('view engine', 'ejs');
app.set('views', './src/views');

ejs.clearCache();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mainRoutes);

export default app;
