"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ClientProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    avatar: "",
    verificationStatus: "Verified",
    supportId: "SUP-123456",
    rating: 5,
  });
  const [avatarSrc, setAvatarSrc] = useState("/default-avatar.png");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_name, avatar_url, contact_number, address")
        .eq("id", user.id)
        .single();
      setProfile((prev) => ({
        ...prev,
        name: profileData?.user_name || "",
        email: user.email || "",
        address: profileData?.address || "",
        contact: profileData?.contact_number || "",
        avatar: profileData?.avatar_url || "",
      }));
      if (profileData?.avatar_url) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(profileData.avatar_url);
        setAvatarSrc(urlData.publicUrl || "/default-avatar.png");
      } else {
        setAvatarSrc("/default-avatar.png");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Personal Information */}
      <Card className="flex flex-row items-center p-6 w-full">
        <div className="flex-1">
          <div className="font-semibold text-lg mb-2">Personal Information</div>
          <div className="text-sm text-gray-700 mb-1">Full Name: {profile.name || "-"}</div>
          <div className="text-sm text-gray-700 mb-1">Email: {profile.email || "-"}</div>
          <div className="text-sm text-gray-700 mb-1">Phone Number: {profile.contact || "-"}</div>
          <div className="text-sm text-gray-700 mb-1">Address: {profile.address || "-"}</div>
        </div>
        <div className="flex-shrink-0">
          <Avatar src={avatarSrc} alt={profile.name || "User"} className="w-32 h-32" />
        </div>
      </Card>

      {/* Verification */}
      <Card className="flex flex-row items-center p-6 w-full">
        <div className="flex-1">
          <div className="font-semibold text-lg mb-2">Verification</div>
          <div className="text-sm text-gray-700 mb-1">Verification Status: {profile.verificationStatus}</div>
          <div className="text-sm text-gray-700 mb-1">Support ID: {profile.supportId}</div>
          <div className="text-sm text-gray-700 mb-1 flex items-center gap-2">Ratings: {Array.from({ length: profile.rating }).map((_, i) => (
            <span key={i} className="text-yellow-500 text-lg">★</span>
          ))}</div>
        </div>
        <div className="flex-shrink-0">
          <Avatar src={avatarSrc} alt={profile.name || "User"} className="w-32 h-32" />
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-6 w-full">
        <div className="font-semibold text-lg mb-2">Payment History</div>
        {/* Add payment history details here if needed */}
      </Card>

      {/* Support & Account Actions */}
      <Card className="p-6 w-full">
        <div className="font-semibold text-lg mb-2">Support & Account Actions</div>
        <div className="text-sm text-blue-700 mb-2 cursor-pointer hover:underline">Contact Support</div>
        <div className="text-sm text-red-600 cursor-pointer hover:underline">Delete Account</div>
      </Card>
    </div>
  );
}
