import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  // Add your providers and callbacks here
}

export default NextAuth(authOptions)
