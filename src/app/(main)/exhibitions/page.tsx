import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FilterProvider } from "@/components/exhibitions/filter-context"
import { ExhibitionComponents } from "@/components/exhibitions/exhibition-components"
import { IEvent } from "@/models/Event"


const categories = [
  "Trade Shows",
  "Art Exhibitions",
  "Food Festivals",
  "Tech Conferences",
  "Fashion Shows",
  "Business Expos",
  "Cultural Events",
  "Education Fairs",
]

async function getExhibitions() {
  const res = await fetch(`${process.env.NEXTAUTH_PUBLIC_URL}/api/exhibitions`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch exhibitions')
  }

  const data = await res.json()
  return data.events as IEvent[]
}

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions();

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
      {/* Header and Search Skeleton */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" /> {/* Title */}
          <Skeleton className="h-10 w-[100px]" /> {/* Filter button */}
        </div>
        
        <div className="relative">
          <Skeleton className="h-12 w-full" /> {/* Search input */}
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 flex-shrink-0" />
          ))}
        </div>
      </div>

      <div className="flex gap-6 mt-8">
        {/* Desktop Filters Skeleton */}
        <div className="hidden lg:block w-[300px] flex-shrink-0">
          <div className="space-y-6">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>

        {/* Exhibition List Skeleton */}
        <div className="flex-1 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="md:w-1/3 h-[200px]" />
                <div className="p-6 md:w-2/3 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

