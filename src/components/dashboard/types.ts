// components/dashboard/types.ts
import { Session } from "next-auth"

export interface DashboardProps {
  user: NonNullable<Session["user"]>
}

export interface ExtendedSession {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: 'organizer' | 'vendor' | null
  }
}


export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}