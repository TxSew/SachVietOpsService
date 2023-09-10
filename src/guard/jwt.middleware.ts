// 1. JWT Middleware (jwt.middleware.ts)

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get the token from the request headers (you may customize this)
    // const token = req.headers.authorization?.split(' ')[1];
 const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5oZHEyMDAzQGdtYWlsLmNvbSIsInJvbGUiOjEsImlhdCI6MTY5NDI5MjY2NX0.2BeH7dPk36Jkm6pZa-xAY5txDPo5wjGdjcMCRftH12U"
    if (token) {
      try {
        // Verify the token using your JWT secret
        const decoded = jwt.verify(token, process.env.JWT_ExpiresIn);

        // Attach the decoded user object to the request for later use
        req['user'] = decoded;

        next(); // Continue with the request
      } catch (error) {
        // Token is invalid
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      // No token provided
      res.status(401).json({ message: 'No token provided' });
    }
  }
}
