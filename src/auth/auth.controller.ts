import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signin.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: SigninDto) {
        return this.authService.signin(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.id);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    googleAuth() {
        // Guard redirects to Google
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    googleAuthCallback(@Req() req: any) {
        return this.authService.validateGoogleUser(req.user);
    }
}
