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
      <div className="container mx-auto px-4 flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md mx-4">
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