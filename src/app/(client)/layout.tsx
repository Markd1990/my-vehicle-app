import Sidebar from "./sidebar";

export default function ClientPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      {/* Main content area */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
