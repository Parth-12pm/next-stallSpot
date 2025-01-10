// components/dashboard/types.ts
import { Session } from "next-auth"

export interface DashboardProps {
  user: NonNullable<Session["user"]>
}