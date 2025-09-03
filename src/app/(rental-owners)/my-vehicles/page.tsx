"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Edit, Trash2, PlusCircle, Settings, Fuel, Users as UsersIcon, Gauge } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Define a type for vehicles matching your Supabase schema
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
}

export default function MyVehiclesPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]); // Use Vehicle[] type
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  // State for viewing a vehicle
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError("");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setVehicleList([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("owner_id", user.id);
      if (error) {
        setError(error.message);
        setVehicleList([]);
      } else {
        setVehicleList(data || []);
      }
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  // Add vehicle handler
  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      const vehicle_name = formData.get("vehicle_name")?.toString().trim();
      const vehicle_type = formData.get("vehicle_type")?.toString().trim();
      const plate_number = formData.get("plate_number")?.toString().trim();
      const price_perday = Number(formData.get("price_perday"));
      const status = formData.get("status")?.toString() || "Available";
      const transmission = formData.get("transmission")?.toString() || null;
      const fuel_type = formData.get("fuel_type")?.toString() || null;
      const seats = formData.get("seats") ? Number(formData.get("seats")) : null;
      const mileage = formData.get("mileage") ? Number(formData.get("mileage")) : null;

      // Validate required fields
      if (!vehicle_name || !plate_number || !price_perday) {
        setError("Vehicle name, plate number, and price per day are required.");
        setLoading(false);
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      // Handle image upload
      let vehicle_image = null;
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
        if (uploadError) {
          setError("Image upload failed: " + uploadError.message);
          setLoading(false);
          return;
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from("vehicle-images").getPublicUrl(fileName);
        vehicle_image = publicUrlData?.publicUrl || null;
      }

      // Insert vehicle
      const { error: insertError, data: newVehicle } = await supabase
        .from("vehicles")
        .insert([
          {
            vehicle_name,
            vehicle_type,
            plate_number,
            price_perday,
            status,
            owner_id: user.id,
            transmission,
            fuel_type,
            seats: seats ? Number(seats) : null,
            mileage: mileage ? Number(mileage) : null,
            vehicle_image,
          },
        ])
        .select()
        .single();
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      setVehicleList((prev) => [
        ...prev,
        { ...newVehicle, name: newVehicle.vehicle_name, type: newVehicle.vehicle_type },
      ]);
      formRef.current?.reset(); // Use ref to reset the form safely
      setLoading(false);
      toast("Vehicle added", { description: `${vehicle_name} has been added.` });
      // Do NOT close the modal
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  // Delete vehicle handler
  const handleDeleteVehicle = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);
      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }
      // Remove from local state
      setVehicleList((prev) => prev.filter((v) => v.id !== id));
      toast("Vehicle deleted", { description: `Vehicle has been removed.` });
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const hasVehicles = vehicleList.length > 0;
  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Vehicles</h1>
        <Button className="flex items-center gap-2" onClick={() => setShowModal(true)}>
          <PlusCircle className="w-5 h-5" /> Add New Vehicle
        </Button>
      </div>
      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Add New Vehicle</h2>
            <form ref={formRef} className="space-y-3" onSubmit={handleAddVehicle}>
              <Input name="vehicle_name" placeholder="Vehicle Name/Model" required />
              <Input name="vehicle_type" placeholder="Type (e.g. SUV, Sedan)" required />
              <Input name="plate_number" placeholder="Plate Number" required />
              <Input name="price_perday" type="number" min={0} placeholder="Price per Day" required />
              {/* Image upload */}
              <Input name="image" type="file" accept="image/*" />
              {/* Vehicle Specs */}
              <div className="flex gap-2">
                <Settings className="w-5 h-5 text-gray-400 mt-2" />
                <select name="transmission" className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none" defaultValue="">
                  <option value="">Transmission (optional)</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Fuel className="w-5 h-5 text-gray-400 mt-2" />
                <select name="fuel_type" className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none" defaultValue="">
                  <option value="">Fuel Type (optional)</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div className="flex gap-2">
                <UsersIcon className="w-5 h-5 text-gray-400 mt-2" />
                <Input name="seats" type="number" min={1} placeholder="Seats (e.g. 5)" />
              </div>
              <div className="flex gap-2">
                <Gauge className="w-5 h-5 text-gray-400 mt-2" />
                <Input name="mileage" type="number" min={0} placeholder="Mileage (e.g. 50000)" />
              </div>
              <select name="status" className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none">
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
              </select>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Vehicle"}
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* Vehicle Grid or Empty State */}
      {hasVehicles ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicleList.map((v: Vehicle) => (
            <Card key={v.id} className="p-4 flex flex-col gap-3 rounded-xl shadow">
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-2">
                {v.vehicle_image ? (
                  <img
                    src={v.vehicle_image}
                    alt={v.vehicle_name}
                    className="object-contain h-28 w-full"
                  />
                ) : (
                  <Car className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="font-semibold text-lg">{v.vehicle_name}</div>
              <div className="text-gray-600 text-sm">Type: {v.vehicle_type}</div>
              <div className="text-gray-600 text-sm">Plate: {v.plate_number}</div>
              <div className="text-gray-600 text-sm">Price/Day: <span className="font-medium text-black">${v.price_perday}</span></div>
              <div className={`text-xs font-semibold rounded px-2 py-1 w-fit ${v.status === "Available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{v.status}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => setViewVehicle(v)}><Car className="w-4 h-4" /> View</Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1"><Edit className="w-4 h-4" /> Edit</Button>
                <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDeleteVehicle(v.id)} disabled={v.status === "Rented"}><Trash2 className="w-4 h-4" /> Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Car className="w-16 h-16 text-gray-300 mb-4" />
          <div className="text-lg text-gray-500 mb-2">No vehicles found.</div>
          <Button className="flex items-center gap-2 mt-2" onClick={() => setShowModal(true)}>
            <PlusCircle className="w-5 h-5" /> Add New Vehicle
          </Button>
        </div>
      )}
      {/* View Vehicle Modal */}
      {viewVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setViewVehicle(null)}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
            <div className="space-y-2">
              <div><span className="font-semibold">Name/Model:</span> {viewVehicle.vehicle_name}</div>
              <div><span className="font-semibold">Type:</span> {viewVehicle.vehicle_type}</div>
              <div><span className="font-semibold">Plate Number:</span> {viewVehicle.plate_number}</div>
              <div><span className="font-semibold">Price per Day:</span> ${viewVehicle.price_perday}</div>
              <div><span className="font-semibold">Status:</span> {viewVehicle.status}</div>
              {viewVehicle.transmission && <div><span className="font-semibold">Transmission:</span> {viewVehicle.transmission}</div>}
              {viewVehicle.fuel_type && <div><span className="font-semibold">Fuel Type:</span> {viewVehicle.fuel_type}</div>}
              {viewVehicle.seats !== null && viewVehicle.seats !== undefined && <div><span className="font-semibold">Seats:</span> {viewVehicle.seats}</div>}
              {viewVehicle.mileage !== null && viewVehicle.mileage !== undefined && <div><span className="font-semibold">Mileage:</span> {viewVehicle.mileage}</div>}
              {viewVehicle.vehicle_image && <div><span className="font-semibold">Image:</span> <img src={viewVehicle.vehicle_image} alt="Vehicle" className="w-full h-auto mt-2" /></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
