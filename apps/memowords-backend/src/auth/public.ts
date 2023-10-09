import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// A decorator for public routes
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
