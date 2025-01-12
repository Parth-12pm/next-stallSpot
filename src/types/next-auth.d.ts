import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'organizer' | 'vendor' | null;
      profileComplete?: boolean;
    };
  }

  interface User {
    id?: string;
    role?: 'organizer' | 'vendor';
    profileComplete?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'organizer' | 'vendor';
    profileComplete?: boolean;
  }
}