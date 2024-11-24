// components/icons.tsx
import {
    Loader2,
    Github,
    Mail,
  } from "lucide-react"
  
  export const Icons = {
    spinner: Loader2,
    gitHub: Github,
    google: Mail,  // Using Mail icon as placeholder for Google
  }
  
  export type Icon = keyof typeof Icons