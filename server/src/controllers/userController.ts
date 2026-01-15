import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, role: true, canViewReviews: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword, role: role || 'lead' }
        });
        res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ message: 'Username exists' });
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, role } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { username, role }
        });
        res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ message: 'Username exists' });
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const toggleReviewAccess = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { canViewReviews } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { canViewReviews }
        });
        res.json({ id: user.id, canViewReviews: user.canViewReviews });
    } catch (error) {
        res.status(500).json({ message: 'Error updating permissions' });
    }
};
