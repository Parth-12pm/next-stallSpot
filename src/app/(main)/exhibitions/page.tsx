import { FilterProvider } from "@/components/exhibitions/filter-context"
import { ExhibitionComponents } from "@/components/exhibitions/exhibition-components"
import { exhibitions, categories } from "@/components/exhibitions/mock"

export default function ExhibitionsPage() {
  return (
    <FilterProvider>
      <ExhibitionComponents 
        exhibitions={exhibitions}
        categories={categories}
      />
    </FilterProvider>
  )
}

