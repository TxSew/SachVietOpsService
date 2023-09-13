// import {
//     Injectable,
//     NestMiddleware,
//     UnauthorizedException
//   } from '@nestjs/common';
//   import { JwtService } from '@nestjs/jwt';
//   import { Request, Response, NextFunction } from 'express';
// import { AccountService } from 'src/modules/Auth/auth.service';
  
//   interface CustomRequest extends Request {
//     user: { role: any };
//   }
  
//   @Injectable()
//   export class AuthenticationMiddleware implements NestMiddleware {
//     constructor(
//       private readonly jwtService: JwtService,
//       private readonly userService: AccountService
//     ) {}
  
//     async use(req: CustomRequest, res: Response, next: NextFunction) {
//       const ignoredUrls = [
//         '/auth/login',
//         '/auth/google',
//         '/auth/admin/login',
//         '/auth/register',
//         '/'
//       ];
//       const isBlogGetRequest =
//         req.originalUrl.startsWith('/blog') && req.method === 'GET';
//       const isConfigGetRequest =
//         req.originalUrl.startsWith('/configs') && req.method === 'GET';
//       const isGroupGetRequest =
//         req.originalUrl.startsWith('/questions/group') && req.method === 'GET';
//       const isFeedbackRequest =
//         req.originalUrl.startsWith('/feedback') && req.method === 'POST';
  
//       if (
//         ignoredUrls.includes(req.originalUrl) ||
//         isBlogGetRequest ||
//         isConfigGetRequest ||
//         isFeedbackRequest ||
//         isGroupGetRequest ||
//         req.originalUrl.startsWith('/forgot-password') ||
//         req.originalUrl.startsWith('/reset-password') ||
//         req.originalUrl.startsWith('/uploads')
//       ) {
//         return next();
//       }
  
//       const token = req.headers['authorization']?.replace('Bearer ', '');
//       if (!token) {
//         return res.status(401).json({ message: 'Not authenticated' });
//       }
  
//       try {
//         const decoded = this.jwtService.verify(token);
//         const user = await this.userService.findByEmail(decoded.email);
//         req.user = user;
//         if (!user || user.currentToken !== token) {
//           return res.status(401).json({
//             message: 'Invalid token or authenticated from another device'
//           });
//         }
  
//         next();
//       } catch (error) {
//         console.log(error);
//         throw new UnauthorizedException('Unauthorized');
//       }
//     }
//   }
  