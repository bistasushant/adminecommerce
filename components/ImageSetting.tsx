"use client";
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiImageAdd, BiUser } from "react-icons/bi";
import Image from "next/image";
import { toast } from "sonner";

export const ImageSettings = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit.");
        return;
      }
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    setIsLoading(true);

    try {
      // Simulate image upload
      console.log("Uploading image:", selectedImage.name);
      toast.success("Profile image updated successfully");
      // Optionally reset form
      setSelectedImage(null);
      setPreviewImage("");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleImageUpload} className="space-y-6">
      <div className="flex flex-col items-center sm:items-start gap-6">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-600/80 sm:lg:ml-30">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Profile"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <BiUser className="text-4xl text-white/50" />
            </div>
          )}
        </div>

        <label
          htmlFor="imageUpload"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 sm:lg:ml-24 w-full sm:w-auto justify-center"
        >
          <BiImageAdd />
          Choose Image
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isLoading}
          />
        </label>

        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-[400px]"
          disabled={isLoading || !selectedImage}
        >
          {isLoading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>
    </form>
  );
};
