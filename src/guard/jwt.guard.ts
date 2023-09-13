// jwt.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is marked as public (no authentication required), allow access
    if (isPublic) {
      console.log('sss');
      
      return true;
    }

    // Check if a JWT token is present in the request headers
    const token = request.headers.authorization?.split(' ')[1];
console.log(token);

    if (!token) {
       
      return false; // No token found, access denied
    }

    try {
      // Verify and decode the token using the JWT service
       
      const decoded =  this.jwtService.verify(token, {
         secret:process.env.JWT_ExpiresIn
      })
       console.log("decoded", decoded);
        console.log("response", request);
        
       
      
      // Attach the user data to the request for later use in controllers
      request.user = decoded;
      
      return true; // Token is valid, allow access
    } catch (error) {
      console.log('Token is not valid - Khong co quyen');
      
      return false; // Token is invalid, access denied
    }
  }
}
