"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar,   } from "@/components/ui/avatar";
import {
  Calendar,
  Car,
  CreditCard,
  Star,
  User,
  MapPin,
  List,
  CheckCircle,
} from "lucide-react";

// Dummy data for UI only
const clientName = "Alex";
const summary = [
  { label: "Upcoming Bookings", value: 2, icon: Calendar },
  { label: "Active Rentals", value: 1, icon: Car },
  { label: "Total Spent", value: "$1,200", icon: CreditCard },
  { label: "Loyalty Points", value: 320, icon: Star },
];
const quickActions = [
  { label: "Book a Vehicle", icon: Car, href: "/book-a-vehicle" },
  { label: "Track My Car", icon: MapPin, href: "#" },
  { label: "My Bookings", icon: List, href: "/my-booking" },
  { label: "Payments", icon: CreditCard, href: "/payment" },
];
const upcomingBooking = {
  car: "Toyota Camry 2022",
  pickup: "2025-09-01 10:00 AM",
  return: "2025-09-05 2:00 PM",
  pickupLocation: "Downtown Branch",
  dropoffLocation: "Airport Terminal",
  status: "Confirmed",
};
const recentActivity = [
  {
    icon: CheckCircle,
    text: "Booking #1234 confirmed",
    time: "2 days ago",
    color: "text-green-600",
  },
  {
    icon: CreditCard,
    text: "Payment of $200 processed",
    time: "3 days ago",
    color: "text-blue-600",
  },
  {
    icon: Star,
    text: "Review submitted for Toyota Corolla",
    time: "1 week ago",
    color: "text-yellow-500",
  },
];

export default function ClientDashboardPage() {
  const hasUpcoming = !!upcomingBooking;
  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16 bg-gray-100" alt="Avatar" />
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {clientName}</h1>
          <div className="text-gray-600">Here’s an overview of your rentals.</div>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summary.map((item) => (
          <Card key={item.label} className="flex items-center gap-4 p-4">
            <div className="bg-gray-100 rounded-full p-3">
              <item.icon className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-gray-600 text-sm">{item.label}</div>
            </div>
          </Card>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
            asChild
          >
            <a href={action.href}>
              <action.icon className="w-5 h-5" />
              {action.label}
            </a>
          </Button>
        ))}
      </div>
      {/* Upcoming Booking Preview */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Upcoming Booking</h2>
        {hasUpcoming ? (
          <Card className="flex flex-col sm:flex-row gap-4 p-4 items-center">
            <div className="bg-gray-100 rounded w-32 h-24 flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <div className="flex-1 w-full">
              <div className="font-semibold text-lg mb-1">{upcomingBooking.car}</div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-1">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {upcomingBooking.pickup}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {upcomingBooking.return}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-1">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingBooking.pickupLocation}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingBooking.dropoffLocation}</span>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mb-2">
                {upcomingBooking.status}
              </div>
              <div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-lg text-gray-500 mb-4 text-center">You don’t have any active rentals. Book your first car today!</div>
            <Button className="mt-2 flex items-center gap-2" asChild>
              <a href="/client/book-a-vehicle">
                <Car className="w-5 h-5" /> Book a Vehicle
              </a>
            </Button>
          </div>
        )}
      </div>
      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-gray-500">No recent activity.</div>
          ) : (
            recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div className="flex-1">
                  <div className="text-sm">{item.text}</div>
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
