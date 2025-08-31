import OwnerSidebar from "./owners-sidebar";
 

export default function OwnerPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <OwnerSidebar />
      {/* Main content area */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
