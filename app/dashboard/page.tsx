import { PurchaseSearchContainer } from "@/features/purchase/containers/PurchaseSearchContainer";

export default function DashboardPage() {
  return (
    <div className="max-w-md mx-auto min-h-screen">
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-blue-900 mb-1">
          A donde quieres ir hoy?
        </h1>
        <p className="text-gray-600 mb-6">Vámonos de viaje</p>
      </div>
      <PurchaseSearchContainer />
    </div>
  );
}
