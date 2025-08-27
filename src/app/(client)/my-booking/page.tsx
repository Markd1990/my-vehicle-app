"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Fix: define BookingStatus type separately
type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

// Fix: add type annotation to booking arrays
const bookingsUpcoming: Booking[] = [
  {
    id: 1,
    car: "Toyota Camry 2022",
    image: "/car-placeholder.png",
    pickup: "2025-09-01 10:00 AM",
    return: "2025-09-05 2:00 PM",
    pickupLocation: "Downtown Branch",
    dropoffLocation: "Airport Terminal",
    status: "Confirmed",
    price: "$320.00",
  },
  {
    id: 2,
    car: "Honda Civic 2023",
    image: "/car-placeholder.png",
    pickup: "2025-09-10 9:00 AM",
    return: "2025-09-12 6:00 PM",
    pickupLocation: "City Center",
    dropoffLocation: "City Center",
    status: "Pending",
    price: "$180.00",
  },
];

const bookingsPast: Booking[] = [
  {
    id: 3,
    car: "Tesla Model 3 2024",
    image: "/car-placeholder.png",
    pickup: "2025-08-01 8:00 AM",
    return: "2025-08-03 8:00 PM",
    pickupLocation: "Airport Terminal",
    dropoffLocation: "Downtown Branch",
    status: "Completed",
    price: "$400.00",
  },
  {
    id: 4,
    car: "Ford Explorer 2021",
    image: "/car-placeholder.png",
    pickup: "2025-07-15 7:00 AM",
    return: "2025-07-18 7:00 PM",
    pickupLocation: "Suburb Lot",
    dropoffLocation: "Suburb Lot",
    status: "Cancelled",
    price: "$0.00",
  },
];

// Fix: statusColors index type
const statusColors: Record<BookingStatus, string> = {
  Confirmed: "text-green-600",
  Pending: "text-yellow-600",
  Cancelled: "text-red-600",
  Completed: "text-blue-600",
};

// Type for a booking
interface Booking {
  id: number;
  car: string;
  image: string;
  pickup: string;
  return: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: BookingStatus;
  price: string;
}

export default function MyBookingPage() {
  const [tab, setTab] = useState("upcoming");
  const [modal, setModal] = useState<Booking | null>(null);
  const bookings = tab === "upcoming" ? bookingsUpcoming : bookingsPast;

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button variant={tab === "upcoming" ? "default" : "outline"} onClick={() => setTab("upcoming")}>Upcoming Bookings</Button>
        <Button variant={tab === "past" ? "default" : "outline"} onClick={() => setTab("past")}>Past Bookings</Button>
      </div>
      {/* Booking List */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-lg text-gray-500 mb-4">No bookings found.</div>
          <Button className="mt-2">Book a Vehicle</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-col sm:flex-row gap-4 p-4">
              <img src={b.image} alt={b.car} className="w-full sm:w-32 h-32 object-cover rounded" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-lg mb-1">{b.car}</div>
                  <div className="text-sm text-gray-600 mb-1">Pickup: <span className="font-medium">{b.pickup}</span></div>
                  <div className="text-sm text-gray-600 mb-1">Return: <span className="font-medium">{b.return}</span></div>
                  <div className="text-sm text-gray-600 mb-1">Pickup Location: <span className="font-medium">{b.pickupLocation}</span></div>
                  <div className="text-sm text-gray-600 mb-1">Drop-off Location: <span className="font-medium">{b.dropoffLocation}</span></div>
                  <div className={`text-sm font-semibold mb-1 ${statusColors[b.status]}`}>Status: {b.status}</div>
                  <div className="text-sm text-gray-800 font-bold mb-2">Total: {b.price}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setModal(b)}>View Details</Button>
                  {tab === "upcoming" && <Button size="sm" variant="outline">Modify</Button>}
                  {tab === "upcoming" && <Button size="sm" variant="destructive">Cancel</Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setModal(null)}>&times;</button>
            <div className="flex items-center justify-center w-48 h-32 mx-auto mb-4 bg-gray-100 rounded">
              {/* Car icon placeholder (Lucide Car) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car text-gray-400 w-16 h-16">
                <path d="M16 3c-1.7 0-3.4 0-5 0C7.3 3 6 4.3 6 6v2.2c0 .3-.2.6-.5.7l-2.1.7C2.6 9.8 2 10.7 2 11.7V17c0 1.1.9 2 2 2h1c.6 0 1-.4 1-1v-1h10v1c0 .6.4 1 1 1h1c1.1 0 2-.9 2-2v-5.3c0-1-.6-1.9-1.4-2.1l-2.1-.7c-.3-.1-.5-.4-.5-.7V6c0-1.7-1.3-3-3-3z" />
                <circle cx="7.5" cy="16.5" r="1.5" />
                <circle cx="16.5" cy="16.5" r="1.5" />
              </svg>
            </div>
            <div className="font-bold text-lg mb-2">{modal.car}</div>
            <div className="text-sm text-gray-600 mb-1">Pickup: {modal.pickup}</div>
            <div className="text-sm text-gray-600 mb-1">Return: {modal.return}</div>
            <div className="text-sm text-gray-600 mb-1">Pickup Location: {modal.pickupLocation}</div>
            <div className="text-sm text-gray-600 mb-1">Drop-off Location: {modal.dropoffLocation}</div>
            <div className={`text-sm font-semibold mb-1 ${statusColors[modal.status]}`}>Status: {modal.status}</div>
            <div className="text-sm text-gray-800 font-bold mb-2">Total: {modal.price}</div>
            <div className="text-sm text-gray-700 mb-1">Add-ons: GPS, Child Seat</div>
            <div className="text-sm text-gray-700 mb-1">Payment Method: Visa **** 1234</div>
            <div className="text-sm text-blue-700 mb-1">Support: support@carrental.com</div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setModal(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
