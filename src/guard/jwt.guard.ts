import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is marked as public (no authentication required), allow access
    if (isPublic) {
      return true;
    }

    // Check if a JWT token is present in the request headers
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token found'); // Return a custom unauthorized exception
    }

    try {
      // Verify and decode the token using the JWT service
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_ExpiresIn,
      });

      // Attach the user data to the request for later use in controllers
      request.user = decoded;

      return true; // Token is valid, allow access
    } catch (error) {
      throw new UnauthorizedException('Token is not valid'); // Return a custom unauthorized exception
    }
  }
}
