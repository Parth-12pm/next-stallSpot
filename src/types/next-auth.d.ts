// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'organizer' | 'vendor' | null;
      profileComplete?: boolean;
    };
  }

  interface User {
    role?: 'organizer' | 'vendor';
    profileComplete?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'organizer' | 'vendor';
    profileComplete?: boolean;
  }
}