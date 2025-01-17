import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface ProfileSectionProps {
  user: {
    name?: string | null
    image?: string | null
  }
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <div className="mt-auto border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 w-full p-4 hover:bg-accent transition-colors">
            <Avatar>
              <AvatarImage src={user.image || '/placeholder.svg'} alt={user.name || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-medium leading-none truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate mt-1">View profile</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <Link href="/dashboard/settings">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => signOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

