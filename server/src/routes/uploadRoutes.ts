import { Router } from 'express';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.single('image'), (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed' });
    }
});

export default router;
