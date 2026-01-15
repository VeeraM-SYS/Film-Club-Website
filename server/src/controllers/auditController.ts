import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getLogs = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.accessLog.findMany({
            include: { user: { select: { username: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

export const deleteLog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.accessLog.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting log' });
    }
};

export const clearLogs = async (req: Request, res: Response) => {
    try {
        await prisma.accessLog.deleteMany({});
        res.json({ message: 'All logs cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing logs' });
    }
};

export const updateLog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { action, details } = req.body;
        const updated = await prisma.accessLog.update({
            where: { id: parseInt(id) },
            data: { action, details }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating log' });
    }
};
