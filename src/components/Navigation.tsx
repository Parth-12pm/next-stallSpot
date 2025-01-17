"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileFormData } from '@/components/profile/types/profile';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";

const useProfileData = () => {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => setProfileData(data))
        .catch(err => console.error('Error fetching profile:', err));
    }
  }, [session]);

  const initials = session?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const avatarImage = profileData?.profilePicture || session?.user?.image || '/placeholder.svg';

  return { session, profileData, initials, avatarImage };
};

const MobileNav = () => {
  const { session, initials, avatarImage } = useProfileData();

  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <nav className="flex flex-col gap-4">
          <Link href="/exhibitions" className="block py-2">Exhibitions</Link>
          <Link href="/about" className="block py-2">About</Link>
          <Link href="/contact" className="block py-2">Contact</Link>
          <div className="flex flex-col gap-2 mt-4">
            {session?.user ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <Avatar>
                    <AvatarImage src={avatarImage} alt={session.user.name || ''} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span>{session.user.name}</span>
                </div>
                <Button variant="outline" className="w-full" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/auth/role-select">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const DesktopNav = () => {
  const { session, initials, avatarImage } = useProfileData();

  return (
    <>
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/exhibitions" legacyBehavior passHref>
              <NavigationMenuLink className="px-4 py-2">Exhibitions</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className="px-4 py-2">About</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className="px-4 py-2">Contact</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden md:flex items-center gap-4">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={avatarImage} alt={session.user.name || ''} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
              <Link href="/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
              <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </>
  );
};

export const Navigation = () => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            StallSpot
          </Link>
          <MobileNav />
          <DesktopNav />
        </nav>
      </div>
    </header>
  );
};