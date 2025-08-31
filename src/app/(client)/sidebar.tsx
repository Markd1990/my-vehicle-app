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
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-56 bg-gray-50 min-h-screen p-4">
      <nav className="flex flex-col gap-6">
        {[
          {
            href: "/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
          },
          {
            href: "/book-a-vehicle",
            icon: Car,
            label: "Book a vehicle",
          },
          {
            href: "/my-booking",
            icon: Calendar,
            label: "My Bookings",
          },
          {
            href: "#",
            icon: MapPin,
            label: "Track My Car",
          },
          {
            href: "#",
            icon: FileText,
            label: "Payment Invoices",
          },
          {
            href: "#",
            icon: Users,
            label: "Community",
          },
          {
            href: "/client-support",
            icon: HelpCircle,
            label: "Support",
          },
          {
            href: "/profile",
            icon: Badge,
            label: "Profiles",
          },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={label} href={href} className="flex items-center gap-3 text-gray-800 hover:text-blue-600">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
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
