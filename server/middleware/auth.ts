import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';

export interface AuthRequest extends Request {
    auth: () => { userId: string };
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const authReq = req as AuthRequest;
        const { userId } = authReq.auth();

        const user = await clerkClient.users.getUser(userId);

        if (user.privateMetadata?.role !== 'admin') {
            return res.json({
                success: false,
                message: "not authorized"
            });
        }
        next();
    } catch (error: any) {
        return res.json({ success: false, message: "not authorized" });
    }
};
