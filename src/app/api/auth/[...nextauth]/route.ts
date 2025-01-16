// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const config: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }
          
          await dbConnect();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            profileComplete: user.profileComplete,
            image: user.profilePicture || null
          };
        } catch(error) {
          // Error handling without unused parameter
          console.error('Auth error:', error instanceof Error ? error.message : 'Unknown error');
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileComplete = user.profileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profileComplete = token.profileComplete;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
};

const handler = NextAuth(config);
export { handler as GET, handler as POST };
