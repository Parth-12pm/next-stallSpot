import NextAuth from 'next-auth';
import { authOptions } from '../[...nextauth]/auth-options';

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

