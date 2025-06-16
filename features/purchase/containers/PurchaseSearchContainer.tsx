"use client"
import { SearchForm } from "../components/SearchForm";

export function PurchaseSearchContainer() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-2 pt-4 pb-24">
      <SearchForm onSearch={() => {}} />
    </div>
  );
}
