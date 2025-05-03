"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SideBar from "@/components/SideBar";
import MobileSideBar from "@/components/MobileSideBar";
import Header from "@/components/Header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ICategory, IProduct } from "@/types";
import Image from "next/image";

// Dummy data for categories
const dummyCategories: ICategory[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets and electronic devices",
    isActive: true,
    createdAt: new Date("2025-01-15T10:30:00Z"),
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and accessories",
    isActive: true,
    createdAt: new Date("2025-02-01T14:20:00Z"),
  },
  {
    id: "3",
    name: "Books",
    slug: "books",
    description: "Printed and digital books",
    isActive: false,
    createdAt: new Date("2025-03-10T09:15:00Z"),
  },
];

// Dummy data for products
const dummyProducts: IProduct[] = [
  {
    id: "prod1",
    name: "Smartphone X",
    slug: "smartphone-x",
    category: ["1"], // References Electronics category
    price: 699.99,
    description: "This is smartphone",
    stock: 50,
    image: "/images/smartphone-x.png",
    createdAt: new Date("2025-01-20T08:00:00Z"),
  },
  {
    id: "prod2",
    name: "Graphic T-Shirt",
    slug: "graphic-t-shirt",
    category: ["2"], // References Clothing category
    price: 29.99,
    description: "This is T-shirt",
    stock: 0,
    image: "/images/graphic-t-shirt.png",
    createdAt: new Date("2025-02-10T12:00:00Z"),
  },
  {
    id: "prod3",
    name: "Sci-Fi Novel",
    slug: "sci-fi-novel",
    category: ["3"], // References Books category
    price: 15.99,
    description: "This is Novel",
    stock: 100,
    image: "/images/sci-fi-novel.png",
    createdAt: new Date("2025-03-15T09:30:00Z"),
  },
  {
    id: "prod4",
    name: "Wireless Earbuds",
    slug: "wireless-earbuds",
    category: ["1"], // References Electronics category
    price: 129.99,
    description: "This is Earbuds",
    stock: 30,
    image: "/images/wireless-earbuds.png",
    createdAt: new Date("2025-04-01T14:00:00Z"),
  },
];

const EditProductForm = () => {
  const router = useRouter();
  const params = useParams();
  const routeId = params.id as string; // Using the ID parameter from the URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState<ICategory[]>(dummyCategories);

  // Find the product based on routeId (id or slug)
  const product =
    dummyProducts.find((p) => p.id === routeId || p.slug === routeId) ||
    dummyProducts[0]; // Fallback to first product if not found
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    description: product.description,
    slug: product.slug,
  });

  // Initialize selected image and categories
  useState(() => {
    setSelectedImage(product.image || null);
    setSelectedCategories(product.category);
  });

  const navigateToOrders = () => {
    router.push("/orders");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((cat) => cat !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name?.trim()) {
      toast.error("Product name is required.");
      setIsSubmitting(false);
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error("At least one category must be selected.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(formData.price) || formData.price <= 0) {
      toast.error("Price must be a valid positive number.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(formData.stock) || formData.stock < 0) {
      toast.error("Stock quantity must be a valid non-negative number.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required.");
      setIsSubmitting(false);
      return;
    }

    const updateData = {
      id: formData.id,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      category: selectedCategories,
      price: formData.price,
      stock: formData.stock,
      description: formData.description.trim(),
      image: selectedImage || "",
      createdAt: product.createdAt,
    };

    try {
      // Simulate updating product
      console.log("Updating product:", updateData);
      toast.success("Product updated successfully");
      router.push("/products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigateToOrders={navigateToOrders}
      />
      <MobileSideBar />
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Header />
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center mb-4">
            <Button
              type="button"
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => router.push("/products")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Edit Product: {formData.name}
          </h1>

          <Card className="bg-gradient-to-br from-slate-950 to-indigo-950 border border-white/40 max-w-3xl mx-auto">
            <CardHeader>
              <h2 className="text-lg font-bold text-white">Product Details</h2>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label className="text-white/80">Product Image</Label>
                  <div className="relative group w-full max-w-md mx-auto">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                    >
                      {selectedImage ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={selectedImage}
                            alt="Product Preview"
                            width={400}
                            height={400}
                            className="object-contain w-full h-full rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-400 transition-colors"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-white/50 mb-2 group-hover:text-purple-400" />
                          <span className="text-white/70 group-hover:text-purple-400">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-sm text-white/50">
                            PNG, JPG (max. 2MB)
                          </span>
                        </>
                      )}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white/80">Product Name</Label>
                    <Input
                      name="name"
                      className="bg-white/5 border-white/20 focus:ring-2 focus:ring-purple-500 text-white w-full"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Categories</Label>
                    <div className="relative">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full bg-white/5 border-white/20 focus:ring-2 focus:ring-gray-500 text-white rounded-lg px-4 py-2"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isSubmitting}
                      >
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.length > 0 ? (
                            selectedCategories.map((categoryId) => {
                              const category = categories.find(
                                (cat) => cat.id === categoryId
                              );
                              return (
                                <span
                                  key={categoryId}
                                  className="bg-purple-600 text-white text-sm px-2 py-1 rounded flex items-center"
                                >
                                  {category ? category.name : "Unknown"}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCategoryToggle(categoryId);
                                    }}
                                    className="ml-1 text-white/80 hover:text-white cursor-pointer"
                                  >
                                    <X className="h-4 w-4" />
                                  </span>
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-white/50">
                              Select categories
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-white/50 transition-transform ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className={`px-4 py-2 cursor-pointer hover:bg-white/10 text-white hover:text-white flex items-center justify-between ${
                                selectedCategories.includes(category.id ?? "")
                                  ? "bg-purple-600/70"
                                  : ""
                              }`}
                              onClick={() =>
                                handleCategoryToggle(category.id ?? "")
                              }
                            >
                              <span>{category.name}</span>
                              {selectedCategories.includes(
                                category.id ?? ""
                              ) && <span className="text-green-400">✓</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Price (Rs)</Label>
                    <Input
                      name="price"
                      type="number"
                      className="bg-white/5 border-white/20 focus:ring-2 focus:ring-purple-500 text-white w-full"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Stock Quantity</Label>
                    <Input
                      name="stock"
                      type="number"
                      className="bg-white/5 border-white/20 focus:ring-2 focus:ring-purple-500 text-white w-full"
                      placeholder="Enter quantity"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Description</Label>
                    <Textarea
                      name="description"
                      className="bg-white/5 border-white/20 focus:ring-2 focus:ring-purple-500 text-white h-32 w-full"
                      placeholder="Describe the product..."
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSubmitting || selectedCategories.length === 0}
                  >
                    {isSubmitting ? "Updating..." : "Update Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditProductForm;
