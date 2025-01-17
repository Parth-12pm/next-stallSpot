import { ExhibitionComponents } from "@/components/exhibitions/exhibition-components"
import { exhibitions, categories } from '../../../components/exhibitions/mock'

export default function ExhibitionsPage() {
  return (
    <div>
          <ExhibitionComponents 
      exhibitions={exhibitions}
      categories={categories}
    />
    </div>
  )
}

