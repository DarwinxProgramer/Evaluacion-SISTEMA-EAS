import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';
import { configureHomeAssistant } from './utils/setupHA';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

configureHomeAssistant().then(() => {
    app.listen(PORT, () => {
        console.log(`EAS Backend running on port ${PORT}`);
    });
});
