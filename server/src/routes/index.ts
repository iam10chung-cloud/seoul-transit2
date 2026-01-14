import { Router } from 'express';
import { getHealth } from './routes/health';
import { postRoutes } from './routes/routes';
import { getRealtimeStatus } from './routes/realtime';

const router = Router();

// Health check
router.get('/health', getHealth);

// Routing endpoints
router.post('/routes', postRoutes);

// Real-time status
router.get('/realtime/status', getRealtimeStatus);

export default router;
