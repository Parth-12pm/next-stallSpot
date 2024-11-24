// auth/layout.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <Button variant="ghost" className="px-0">
                ← Back to home
              </Button>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}