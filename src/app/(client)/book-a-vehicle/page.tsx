"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MapPin, Calendar, Car, Star, Users, Settings, Fuel, Shield, Baby, Navigation } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const vehicleTypes = ["All", "Economy", "SUV", "Luxury", "Van"];

const addOns = [
  { label: "GPS", icon: Navigation },
  { label: "Baby Seat", icon: Baby },
  { label: "Insurance", icon: Shield },
];

// Use the same Vehicle interface as in /my-vehicles
interface Vehicle {
  id: number;
  vehicle_name: string;
  vehicle_type: string;
  plate_number: string;
  price_perday: number;
  status: string;
  transmission?: string | null;
  fuel_type?: string | null;
  seats?: number | null;
  mileage?: number | null;
  vehicle_image?: string | null;
  airconditioned?: boolean;
  free_cancellation?: boolean;
  description?: string;
  rating?: number;
  owner_name?: string;
  rental_image?: string;
}

export default function BookAVehiclePage() {
  const [vehicleType, setVehicleType] = useState("All");
  const [modal, setModal] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*");
      if (!error && data) {
        setVehicles(data);
      } else {
        setVehicles([]);
      }
      setLoading(false);
    };
    fetchVehicles();
  }, []);

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
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-12">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">No vehicles found.</div>
        ) : (
          vehicles
            .filter((v) => vehicleType === "All" || v.vehicle_type === vehicleType)
            .map((v) => (
              <Card key={v.id} className="p-4 flex flex-col justify-between gap-3">
                {/* Owner avatar and name */}
                <div className="flex items-center gap-2 mb-2 h-4 w-4 bg-amber-300">
                  {v.rental_image && (
                    <img src={v.rental_image} alt="Rental" className="object-cover h-8 w-8 rounded-full border-2 border-white shadow" />
                  )}
                  {v.owner_name && (
                    <span className="text-xs text-muted-foreground h-4 w-4 bg-amber-300">By {v.owner_name}</span>
                  )}
                </div>
                <div className="rounded-md h-32 flex items-center justify-center mb-2 bg-muted">
                  {v.rental_image ? (
                    <img src={v.rental_image} alt="Rental" className="object-cover h-10 w-10 rounded-full absolute top-2 left-2 border-2 border-white shadow" style={{zIndex:2}} />
                  ) : null}
                  {v.vehicle_image ? (
                    <img
                      src={v.vehicle_image}
                      alt={v.vehicle_name}
                      className="object-contain h-28 w-full rounded"
                    />
                  ) : (
                    <Car className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-4  ">
                  <div className="font-semibold text-lg">{v.vehicle_name}</div>
                  {v.owner_name && (
                    <div className="text-xs text-muted-foreground">By {v.owner_name}</div>
                  )}
                  <div className="text-muted-foreground text-sm">Type: {v.vehicle_type}</div>
                  <div className="text-muted-foreground text-sm">Plate: {v.plate_number}</div>
                  <div className="text-muted-foreground text-sm">Price/Day: <span className="font-medium text-blue-950 text-xl">${v.price_perday}</span></div>
                  {/* Status Badge */}
                  <div className={`text-xs bg-cyan-600 font-semibold rounded px-2 py-1 w-fit 
                    ${v.status === "Available" ? "bg-green-100 text-green-800" : ""}
                    ${v.status === "Rented" ? "bg-yellow-100 text-yellow-800" : ""}
                  `}>
                    {v.status}
                  </div>
                </div>
                <div className="flex gap-2 items-center   text-xs">
                  {v.airconditioned && (
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium">Airconditioned</span>
                  )}
                  {v.free_cancellation && (
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium">Free Cancellation</span>
                  )}
                </div>
                <div className="flex gap-2 mt-2    ">
                  <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => setModal(v)}><Car className="w-4 h-4" /> View</Button>
                </div>
              </Card>
            ))
        )}
      </div>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setModal(null)}>&times;</button>
            <div className="space-y-2">
              <div className="rounded-md h-32 flex items-center justify-center mb-2 bg-muted">
                {modal.vehicle_image ? (
                  <img src={modal.vehicle_image} alt={modal.vehicle_name} className="object-contain h-28 w-full rounded" />
                ) : (
                  <Car className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="font-semibold text-lg">{modal.vehicle_name}</div>
              <div className="text-muted-foreground text-sm">Type: {modal.vehicle_type}</div>
              <div className="text-muted-foreground text-sm">Plate: {modal.plate_number}</div>
              <div className="text-muted-foreground text-sm">Price/Day: <span className="font-medium text-blue-950 text-xl">${modal.price_perday}</span></div>
              <div className={`text-xs bg-cyan-600 font-semibold rounded px-2 py-1 w-fit 
                ${modal.status === "Available" ? "bg-green-100 text-green-800" : ""}
                ${modal.status === "Rented" ? "bg-yellow-100 text-yellow-800" : ""}
              `}>
                {modal.status}
              </div>
              {modal.transmission && <div className="text-muted-foreground text-sm">Transmission: {modal.transmission}</div>}
              {modal.fuel_type && <div className="text-muted-foreground text-sm">Fuel Type: {modal.fuel_type}</div>}
              {modal.seats !== null && modal.seats !== undefined && <div className="text-muted-foreground text-sm">Seats: {modal.seats}</div>}
              {modal.mileage !== null && modal.mileage !== undefined && <div className="text-muted-foreground text-sm">Mileage: {modal.mileage}</div>}
              {modal.airconditioned && (
                <div className="flex items-center gap-1"><Settings className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">Feature:</span> Airconditioned</div>
              )}
              {modal.free_cancellation && (
                <div className="flex items-center gap-1"><Button className="w-4 h-4 p-0" variant="ghost" disabled><span className="sr-only">Free Cancellation</span></Button><span className="font-semibold">Feature:</span> Free Cancellation</div>
              )}
             
            </div>
            <Button className="w-full mt-6">Confirm Booking</Button>
          </div>
        </div>
      )}
    </div>
  );
}
