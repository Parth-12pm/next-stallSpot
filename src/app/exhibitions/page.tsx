import { SearchBar } from "./components/search-bar";
import { TagList } from "./components/tag-list";
import { CategorySidebar } from "./components/category-sidebar";
import { ExhibitionList } from "./components/exhibition-list";
import { MobileFilters } from "./components/mobile-filters";

export default function ExhibitionsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Find Exhibitions</h1>
        <MobileFilters />
      </div>
      <SearchBar />
      <TagList />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1">
          <CategorySidebar />
        </div>
        <div className="lg:col-span-3">
          <ExhibitionList />
        </div>
      </div>
    </div>
  );
}