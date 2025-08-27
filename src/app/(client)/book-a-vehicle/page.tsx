"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MapPin, Calendar, Car, Star, Users, Settings, Fuel, Shield, Baby, Navigation } from "lucide-react";

const vehicleTypes = ["All", "Economy", "SUV", "Luxury", "Van"];
const vehicles = [
  {
    id: 1,
    name: "Toyota Camry 2022",
    category: "Economy",
    price: 45,
    rating: 4.5,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    description: "A reliable and fuel-efficient sedan, perfect for city and highway driving.",
  },
  {
    id: 2,
    name: "BMW X5 2023",
    category: "Luxury",
    price: 120,
    rating: 4.9,
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    description: "Premium SUV with luxury features and top safety ratings.",
  },
  {
    id: 3,
    name: "Honda CR-V 2021",
    category: "SUV",
    price: 70,
    rating: 4.7,
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    description: "Spacious SUV with great mileage and comfort for families.",
  },
];

const addOns = [
  { label: "GPS", icon: Navigation },
  { label: "Baby Seat", icon: Baby },
  { label: "Insurance", icon: Shield },
];

export default function BookAVehiclePage() {
  const [vehicleType, setVehicleType] = useState("All");
  const [modal, setModal] = useState(null as (typeof vehicles)[0] | null);

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Book a Vehicle</h1>
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-5 h-5 text-gray-400" />
          <Input placeholder="Pickup location" className="w-full" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-5 h-5 text-gray-400" />
          <Input type="date" className="w-full" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-5 h-5 text-gray-400" />
          <Input type="date" className="w-full" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 min-w-[140px]">
              <Car className="w-5 h-5 text-gray-400" />
              <span>{vehicleType}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {vehicleTypes.map((type) => (
              <DropdownMenuItem key={type} onClick={() => setVehicleType(type)}>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="w-full md:w-auto">Search</Button>
      </div>
      {/* Vehicle Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles
          .filter((v) => vehicleType === "All" || v.category === vehicleType)
          .map((v) => (
            <Card key={v.id} className="flex flex-col items-center p-6 gap-4">
              <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-2">
                <Car className="w-12 h-12 text-gray-400" />
              </div>
              <div className="font-bold text-lg text-center">{v.name}</div>
              <div className="text-sm text-gray-500 mb-1">{v.category}</div>
              <div className="text-blue-700 font-bold text-xl mb-1">${v.price}/day</div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(v.rating) ? "text-yellow-400" : "text-gray-300"}`} fill={i < Math.round(v.rating) ? "#facc15" : "none"} />
                ))}
                <span className="text-xs text-gray-500 ml-1">{v.rating}</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{v.seats} seats</span>
                <span className="flex items-center gap-1"><Settings className="w-4 h-4" />{v.transmission}</span>
                <span className="flex items-center gap-1"><Fuel className="w-4 h-4" />{v.fuel}</span>
              </div>
              <Button className="w-full" onClick={() => setModal(v)}>Book Now</Button>
            </Card>
          ))}
      </div>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setModal(null)}>&times;</button>
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-4">
                <Car className="w-16 h-16 text-gray-400" />
              </div>
              <div className="font-bold text-2xl mb-1">{modal.name}</div>
              <div className="text-sm text-gray-500 mb-2">{modal.category}</div>
              <div className="text-gray-700 text-center mb-4">{modal.description}</div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Available: Aug 28 – Sep 30, 2025</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Pricing:</span>
              <div className="text-sm text-gray-700">${modal.price} x 3 days = ${modal.price * 3 || modal.price * 1} (example)</div>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Add-ons:</span>
              <div className="flex gap-4 mt-2">
                {addOns.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center text-xs text-gray-600">
                    <Icon className="w-6 h-6 mb-1" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full">Confirm Booking</Button>
          </div>
        </div>
      )}
    </div>
  );
}
