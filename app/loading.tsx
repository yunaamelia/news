import { FiActivity } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <FiActivity className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Memuat...</p>
      </div>
    </div>
  );
}
