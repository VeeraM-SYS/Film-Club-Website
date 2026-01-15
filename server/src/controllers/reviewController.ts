import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const submitReview = async (req: Request, res: Response) => {
    const { userName, comment, rating } = req.body;
    try {
        const review = await prisma.review.create({
            data: { userName, comment, rating: parseInt(rating) }
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review' });
    }
};

export const getReviews = async (req: any, res: Response) => {
    try {
        // Admins can see all, Leads only if permitted
        if (req.user.role !== 'admin' && !req.user.canViewReviews) {
            return res.status(403).json({ message: 'Unauthorized review access' });
        }
        const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // APPROVED, REJECTED
    try {
        const review = await prisma.review.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error updating review' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.review.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review' });
    }
};
