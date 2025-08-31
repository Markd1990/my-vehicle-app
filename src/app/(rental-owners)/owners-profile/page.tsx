"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Building2, Car, BarChart2, Lock, Bell, HelpCircle, User, Briefcase } from "lucide-react";

export default function OwnersProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-2 sm:px-4 space-y-8">
      {/* 1. Account Info */}
      <Card className="relative rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-blue-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil w-5 h-5"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"></path></svg>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-2">
            <User className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg mb-2">Account Info</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700"><User className="w-4 h-4" /> Alex Rental</div>
            <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> alex@rental.com</div>
            <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4" /> +1 555-123-4567</div>
            <div className="flex items-center gap-2 text-gray-700 col-span-2"><MapPin className="w-4 h-4" /> 123 Main St, Springfield</div>
          </div>
        </div>
      </Card>

      {/* 2. Business Info */}
      <Card className="relative rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-blue-600">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil w-5 h-5"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"></path></svg>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded w-20 h-20 flex items-center justify-center mb-2">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg mb-2">Business Info</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700"><Building2 className="w-4 h-4" /> Springfield Rentals LLC</div>
            <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> payouts@springfieldrentals.com</div>
            <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4" /> +1 555-987-6543</div>
            <div className="flex items-center gap-2 text-gray-700 col-span-2"><MapPin className="w-4 h-4" /> 456 Commerce Ave, Springfield</div>
          </div>
        </div>
      </Card>

      {/* 3. Vehicle Management */}
      <Card className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <Car className="w-10 h-10 text-blue-500" />
          <div>
            <div className="font-semibold text-lg">Vehicle Inventory</div>
            <div className="text-gray-600 text-sm">12 vehicles managed</div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button variant="outline">Add New Vehicle</Button>
          <Button variant="ghost" asChild>
            <a href="/rental-owners/fleet-management">View Inventory</a>
          </Button>
        </div>
      </Card>

      {/* 4. Rental Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <Car className="w-8 h-8 text-blue-500" />
          <div>
            <div className="font-bold text-xl">12</div>
            <div className="text-gray-600 text-sm">Total Vehicles</div>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <BarChart2 className="w-8 h-8 text-green-500" />
          <div>
            <div className="font-bold text-xl">87</div>
            <div className="text-gray-600 text-sm">Completed Bookings</div>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <Car className="w-8 h-8 text-yellow-500" />
          <div>
            <div className="font-bold text-xl">3</div>
            <div className="text-gray-600 text-sm">Ongoing Rentals</div>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <BarChart2 className="w-8 h-8 text-purple-500" />
          <div>
            <div className="font-bold text-xl">$4,200</div>
            <div className="text-gray-600 text-sm">Monthly Earnings</div>
          </div>
        </Card>
      </div>

      {/* 5. Security Settings */}
      <Card className="p-6 flex flex-col gap-4">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><Lock className="w-5 h-5" /> Security Settings</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</Button>
          <Button variant="outline" className="flex-1 flex items-center gap-2"><Bell className="w-4 h-4" /> Notification Preferences</Button>
        </div>
      </Card>

      {/* 6. Support */}
      <Card className="p-6 flex flex-col items-center">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5" /> Need Help?</div>
        <Button variant="default">Contact Support</Button>
      </Card>
    </div>
  );
}
