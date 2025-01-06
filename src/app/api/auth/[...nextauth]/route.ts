// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      profileComplete?: boolean;
    };
  }

  interface User {
    role?: string;
    profileComplete?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    profileComplete?: boolean;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'vendor', // Add default role
          profileComplete: user.profileComplete || false, // Add default value
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role || 'vendor'; // Add default role
        token.profileComplete = user.profileComplete || false; // Add default value
      }

      // Handle profile completion update
      if (trigger === "update" && session?.user?.profileComplete) {
        token.profileComplete = session.user.profileComplete;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role || 'vendor'; // Add default role
        session.user.profileComplete = token.profileComplete || false; // Add default value
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async signIn({ user }) {
      // Update last login time if needed
      if (user.email) {
        await dbConnect();
        await User.findOneAndUpdate(
          { email: user.email },
          { lastLogin: new Date() }
        );
      }
    },
  },
});

export { handler as GET, handler as POST };