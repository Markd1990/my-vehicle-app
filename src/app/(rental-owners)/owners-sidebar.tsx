"use client";
import {
  LayoutDashboard,
  Car,
  Calendar,
  MapPin,
  FileText,
  Users,
  HelpCircle,
  Badge,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export default function OwnerSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-50 min-h-screen p-4">
      <nav className="flex flex-col gap-6">
        {[
             {
            href: "/owners-profile",
            icon: FileText,
            label: "Owners Profile",
          },
          {
            href: "/owner-dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
          },
          {
            href: "/bookings",
            icon: Car,
            label: "Bookings",
          },
          {
            href: "/clients",
            icon: Calendar,
            label: "Clients",
          },
          {
            href: "/my-vehicles",
            icon: Calendar,
            label: "My Vehicles",
          },
       
          {
            href: "/community",
            icon: Users,
            label: "Community",
          },
          {
            href: "/owners-support",
            icon: HelpCircle,
            label: "Support",
          },
               {
            href: "/settings",
            icon: MapPin,
            label: "Settings",
          },
          {
            href: "/fleet-management",
            icon: Badge,
            label: "Fleet Management",
          },
        ].map(({ href, icon: Icon, label }) => {
          const isActive = href !== "#" && pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : "text-gray-800"}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        className="flex items-center gap-3 text-red-600 hover:text-red-800 mt-8 w-full px-4 py-2 rounded transition"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
