import { Router, type Request, type Response } from 'express';
import { exec } from 'child_process';
import axios from 'axios';
import { EvaluatorService } from '../services/evaluator';

const router = Router();

// Run natively evaluated Node.js tests
router.post('/tests', async (req: Request, res: Response) => {
    const { test, rate, duration } = req.body;
    
    try {
        if (test === 'nominal') {
            const results = await EvaluatorService.runNominalTest();
            return res.json(results);
        } else if (test === 'stress') {
            const results = await EvaluatorService.runStressTest(rate || 10, duration || 60);
            return res.json(results);
        } else {
            return res.status(400).json({ error: 'Unknown test type' });
        }
    } catch (error: any) {
        console.error(`Test execution error: ${error}`);
        return res.status(500).json({ error: error.message });
    }
});

// Chaos engineering
router.post('/chaos', (req: Request, res: Response) => {
    const { action, target, mttr } = req.body;
    let cmd = '';

    if (action === 'stop' && target === 'homeassistant') {
        cmd = 'docker stop eas_edge_node';
    } else if (action === 'start' && target === 'homeassistant') {
        cmd = 'docker start eas_edge_node';
    } else if (action === 'log') {
        // Log the MTTR from the frontend
        EvaluatorService.saveChaosEvidence(mttr).then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
        return;
    } else {
        return res.status(400).json({ error: 'Invalid action or target' });
    }

    console.log(`Executing Chaos: ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: error.message, stderr });
        }
        res.json({ message: 'Chaos action executed successfully', output: stdout });
    });
});

// Telemetry from Prometheus
router.get('/telemetry', async (req: Request, res: Response) => {
    try {
        const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';
        const cpuQuery = `rate(container_cpu_usage_seconds_total{name="eas_edge_node"}[1m]) * 100`;
        const memoryQuery = `container_memory_usage_bytes{name="eas_edge_node"}`;

        const [cpuResponse, memoryResponse] = await Promise.all([
            axios.get(`${prometheusUrl}/api/v1/query`, { params: { query: cpuQuery } }),
            axios.get(`${prometheusUrl}/api/v1/query`, { params: { query: memoryQuery } })
        ]);

        const cpuData = cpuResponse.data.data.result[0]?.value[1] || 0;
        const memoryData = memoryResponse.data.data.result[0]?.value[1] || 0;

        res.json({
            cpu: parseFloat(cpuData),
            memory: parseInt(memoryData)
        });
    } catch (error: any) {
        console.error('Error fetching telemetry:', error.message);
        res.status(500).json({ error: 'Failed to fetch telemetry' });
    }
});

export default router;
