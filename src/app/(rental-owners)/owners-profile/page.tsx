"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 
 
import { Mail, Phone, MapPin, Building2, Car, BarChart2, Lock, Bell, HelpCircle, User, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OwnersProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editAccount, setEditAccount] = useState(false);
  const [editRental, setEditRental] = useState(false);
  const [formAccount, setFormAccount] = useState<any>(null);
  const [formRental, setFormRental] = useState<any>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const rentalImageInputRef = useRef<HTMLInputElement>(null);
  const [rentalImageUploading, setRentalImageUploading] = useState(false);
  const [rentalImageError, setRentalImageError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // Debug: log user.id
      console.log('Supabase Auth user.id:', user.id);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, user_name, user_email, avatar_url, contact_number, address, role")
        .eq("id", user.id)
        .single();
      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
      }
      // Debug: log profileData
      console.log('Profile data:', profileData);
      setProfile(profileData ? { ...profileData, user_email: user.email } : null);
      setFormAccount(profileData ? { ...profileData, user_email: user.email } : null);
      setLoading(false);

      const { data: rentalData, error: rentalError } = await supabase
        .from("rental_details")
        .select("id, user_id, rental_name, rental_email, rental_contact, rental_location, rental_image")
        .eq("user_id", user.id)
        .maybeSingle();
      if (rentalError && rentalError.code !== 'PGRST116') { // PGRST116: No rows found
        console.error('Rental fetch error:', rentalError.message);
      }
      // Debug: log rentalData
      console.log('Rental data:', rentalData);
      setFormRental(rentalData ? { ...rentalData } : null);
    };
    fetchProfile();
  }, []);

  // Save Account Info
  const handleSaveAccount = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        user_name: formAccount.user_name,
        contact_number: formAccount.contact_number,
        address: formAccount.address,
        avatar_url: formAccount.avatar_url,
      })
      .eq("id", profile.id);
    if (!error) {
      setProfile((prev: any) => ({ ...prev, ...formAccount }));
      setEditAccount(false);
    }
    setLoading(false);
  };

  // Save Rental Info
  const handleSaveRental = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("rental_details")
      .upsert({
        user_id: profile.id, // use the user's id from the profile
        rental_name: formRental.rental_name,
        rental_email: formRental.rental_email,
        rental_contact: formRental.rental_contact,
        rental_location: formRental.rental_location,
        rental_image: formRental.rental_image,
        // Do NOT send id or created_at, let Supabase handle it
      }, { onConflict: 'user_id' });
    if (!error) {
      setFormRental((prev: any) => ({ ...prev, ...formRental }));
      setEditRental(false);
    }
    setLoading(false);
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;
    setAvatarUploading(true);
    setAvatarError(null);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${profile.id}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setAvatarError('Upload failed.');
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setFormAccount((f: any) => ({ ...f, avatar_url: data.publicUrl }));
    setAvatarUploading(false);
  };

  // Rental image upload handler
  const handleRentalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;
    setRentalImageUploading(true);
    setRentalImageError(null);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${profile.id}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('rental-avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setRentalImageError('Upload failed.');
      setRentalImageUploading(false);
      return;
    }
    const { data } = supabase.storage.from('rental-avatars').getPublicUrl(filePath);
    setFormRental((f: any) => ({ ...f, rental_image: data.publicUrl }));
    setRentalImageUploading(false);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!profile) return <div className="text-center py-10">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 sm:px-4 space-y-8">
      {/* 1. Account Info */}
      <Card className="relative rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-blue-600" onClick={() => setEditAccount(true)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil w-5 h-5"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"></path></svg>
        </div>
        <div className="flex flex-col items-center">
         <Avatar className="w-20 h-20 mb-2">
  <AvatarImage src={formAccount?.avatar_url || "/default-avatar.png"} alt={formAccount?.user_name || "Avatar"} />
  <AvatarFallback>{formAccount?.user_name?.charAt(0) || "U"}</AvatarFallback>
</Avatar>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg mb-2">Account Info</div>
          {editAccount ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Avatar upload */}
              <div className="col-span-2 flex flex-col gap-2">
                <label className="font-medium">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                  className="block"
                />
                {avatarUploading && <span className="text-xs text-blue-500">Uploading...</span>}
                {avatarError && <span className="text-xs text-red-500">{avatarError}</span>}
              </div>
              <Input value={formAccount.user_name || ""} onChange={e => setFormAccount((f: any) => ({ ...f, user_name: e.target.value }))} placeholder="Name" />
              <Input value={formAccount.user_email || ""} disabled placeholder="Email" />
              <Input value={formAccount.contact_number || ""} onChange={e => setFormAccount((f: any) => ({ ...f, contact_number: e.target.value }))} placeholder="Contact Number" />
              <Input value={formAccount.address || ""} onChange={e => setFormAccount((f: any) => ({ ...f, address: e.target.value }))} placeholder="Address" className="col-span-2" />
              <div className="col-span-2 flex gap-2 mt-2">
                <Button onClick={handleSaveAccount} disabled={loading}>Save</Button>
                <Button variant="outline" onClick={() => setEditAccount(false)} disabled={loading}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700"><User className="w-4 h-4" /> {profile.user_name || "-"}</div>
              <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> {profile.user_email || "-"}</div>
              <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4" /> {profile.contact_number || "-"}</div>
              <div className="flex items-center gap-2 text-gray-700 col-span-2"><MapPin className="w-4 h-4" /> {profile.address || "-"}</div>
            </div>
          )}
        </div>
      </Card>

      {/* 2. Rental Info */}
      <Card className="relative rounded-xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-blue-600" onClick={() => formRental && setEditRental(true)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil w-5 h-5"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"></path></svg>
        </div>
       <div className="flex flex-col items-center">
  {formRental?.rental_image ? (
    <Avatar className="w-20 h-20 mb-2">
      <AvatarImage src={formRental.rental_image} alt={formRental.rental_name || "Rental Avatar"} />
      <AvatarFallback>{formRental.rental_name?.charAt(0) || "R"}</AvatarFallback>
    </Avatar>
  ) : (
    <div className="bg-gray-100 rounded w-20 h-20 flex items-center justify-center mb-2">
      <Briefcase className="w-10 h-10 text-gray-400" />
    </div>
  )}
</div>

        <div className="flex-1">
          <div className="font-semibold text-lg mb-2">Rental Info</div>
          {formRental ? (
            editRental ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rental image upload */}
                <div className="col-span-2 flex flex-col gap-2">
                  <label className="font-medium">Rental Image</label>
                  {formRental.rental_image && (
                    <img src={formRental.rental_image} alt="Rental" className="w-32 h-20 object-cover rounded mb-2 border" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={rentalImageInputRef}
                    onChange={handleRentalImageChange}
                    disabled={rentalImageUploading}
                    className="block"
                  />
                  {rentalImageUploading && <span className="text-xs text-blue-500">Uploading...</span>}
                  {rentalImageError && <span className="text-xs text-red-500">{rentalImageError}</span>}
                </div>
                <Input value={formRental.rental_name || ""} onChange={e => setFormRental((f: any) => ({ ...f, rental_name: e.target.value }))} placeholder="Rental Name" />
                <Input value={formRental.rental_email || ""} onChange={e => setFormRental((f: any) => ({ ...f, rental_email: e.target.value }))} placeholder="Rental Email" />
                <Input value={formRental.rental_contact || ""} onChange={e => setFormRental((f: any) => ({ ...f, rental_contact: e.target.value }))} placeholder="Rental Contact" />
                <Input value={formRental.rental_location || ""} onChange={e => setFormRental((f: any) => ({ ...f, rental_location: e.target.value }))} placeholder="Rental Location" className="col-span-2" />
                <div className="col-span-2 flex gap-2 mt-2">
                  <Button onClick={handleSaveRental} disabled={loading}>Save</Button>
                  <Button variant="outline" onClick={() => setEditRental(false)} disabled={loading}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700"><Building2 className="w-4 h-4" /> {formRental.rental_name || "-"}</div>
                <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> {formRental.rental_email || "-"}</div>
                <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4" /> {formRental.rental_contact || "-"}</div>
                <div className="flex items-center gap-2 text-gray-700 col-span-2"><MapPin className="w-4 h-4" /> {formRental.rental_location || "-"}</div>
                <div className="col-span-2 flex gap-2 mt-2">
                  <Button onClick={() => setEditRental(true)} variant="outline">Edit</Button>
                </div>
              </div>
            )
          ) : (
            <div className="text-gray-500 flex flex-col gap-2">
              <span>No rental info found. Please add your rental details.</span>
              <Button onClick={() => { setFormRental({ rental_name: '', rental_email: '', rental_contact: '', rental_location: '', rental_image: '' }); setEditRental(true); }} variant="outline">Add Rental Info</Button>
            </div>
          )}
        </div>
      </Card>

      {/* 3. Vehicle Management */}
      <Card className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <Car className="w-10 h-10 text-blue-500" />
          <div>
            <div className="font-semibold text-lg">Vehicle Inventory</div>
            <div className="text-gray-600 text-sm">- vehicles managed</div>
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
            <div className="font-semibold">Total Vehicles</div>
            <div className="text-2xl font-bold text-gray-800">-</div>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <BarChart2 className="w-8 h-8 text-green-500" />
          <div>
            <div className="font-semibold">Total Bookings</div>
            <div className="text-2xl font-bold text-gray-800">-</div>
          </div>
        </Card>
      </div>
    </div>
  );
}