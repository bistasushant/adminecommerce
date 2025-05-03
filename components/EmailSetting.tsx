"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BiEnvelope } from "react-icons/bi";

export const EmailSettings = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Simulate email update
      console.log("Updating email to:", email);
      toast.success("Email updated successfully");
      setEmail(""); // Reset form
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="text-white/80 flex items-center gap-2">
          <BiEnvelope className="text-xl" />
          New Email Address
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter new email"
          className="bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 lg:w-[400px]"
          required
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white w-full lg:w-[400px]"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Email"}
      </Button>
    </form>
  );
};
