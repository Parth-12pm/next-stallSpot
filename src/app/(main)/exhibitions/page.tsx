import { Suspense } from 'react'
import { FilterProvider } from "@/components/exhibitions/filter-context"
import { ExhibitionComponents } from "@/components/exhibitions/exhibition-components"
import { categories } from "@/components/exhibitions/mock"
import { Event } from "@/components/events/types/types"

async function getExhibitions() {
  const res = await fetch(`${process.env.NEXTAUTH_PUBLIC_URL}/api/exhibitions`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch exhibitions')
  }

  const data = await res.json()
  return data.events as Event[]
}

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions()

  return (
    <FilterProvider>
      <Suspense fallback={<ExhibitionsSkeleton />}>
        <ExhibitionComponents 
          exhibitions={exhibitions}
          categories={categories}
        />
      </Suspense>
    </FilterProvider>
  )
}
function ExhibitionsSkeleton() {
  return (
    <div className="container mx-auto p-20">
      <div className="space-y-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  )
}

