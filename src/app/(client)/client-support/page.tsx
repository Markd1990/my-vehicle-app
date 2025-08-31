"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 
import { Mail, MessageCircle, HelpCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ClientSupportPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Client Support</h1>
        <p className="text-gray-500">How can we help you today?</p>
      </div>
      {/* Support Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card className="flex flex-col items-center p-6 text-center">
          <HelpCircle className="w-8 h-8 text-blue-600 mb-2" />
          <div className="font-semibold mb-1">FAQs</div>
          <div className="text-gray-500 text-sm mb-2">Find answers to common questions.</div>
          <Button variant="outline" asChild>
            <a href="#">View FAQs</a>
          </Button>
        </Card>
        <Card className="flex flex-col items-center p-6 text-center">
          <MessageCircle className="w-8 h-8 text-green-600 mb-2" />
          <div className="font-semibold mb-1">Live Chat</div>
          <div className="text-gray-500 text-sm mb-2">Chat with our support team in real time.</div>
          <Button variant="outline" asChild>
            <a href="#">Start Chat</a>
          </Button>
        </Card>
        <Card className="flex flex-col items-center p-6 text-center">
          <Mail className="w-8 h-8 text-purple-600 mb-2" />
          <div className="font-semibold mb-1">Email Us</div>
          <div className="text-gray-500 text-sm mb-2">Send us an email and we’ll get back to you soon.</div>
          <Button variant="outline" asChild>
            <a href="mailto:support@myvehicleapp.com">Send Email</a>
          </Button>
        </Card>
      </div>
      {/* Contact Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
        <form className="space-y-4">
          <Input type="text" placeholder="Your Name" required />
          <Input type="email" placeholder="Your Email" required />
          <Textarea rows={4} placeholder="How can we help you?" required />
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </Card>
    </div>
  );
}
