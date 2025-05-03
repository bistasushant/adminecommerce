"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SideBar from "@/components/SideBar";
import MobileSideBar from "@/components/MobileSideBar";
import Header from "@/components/Header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ICategory } from "@/types";

// Dummy data
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
  {
    id: "4",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Furniture and gardening supplies",
    isActive: true,
    createdAt: new Date("2025-04-05T16:45:00Z"),
  },
  {
    id: "5",
    name: "Toys",
    slug: "toys",
    description: "Children's toys and games",
    isActive: false,
    createdAt: new Date("2025-04-20T11:00:00Z"),
  },
];

const EditCategoryForm = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const categorySlug = Array.isArray(params.id) ? params.id[0] : params.id;

  // Load dummy data based on slug
  useState(() => {
    if (!categorySlug) {
      toast.error("No category slug provided in URL.");
      router.push("/category");
      return;
    }

    setIsLoading(true);
    try {
      const category = dummyCategories.find((cat) => cat.slug === categorySlug);
      if (!category) {
        throw new Error(`Category with slug "${categorySlug}" not found`);
      }

      setCategoryName(category.name || "");
      setDescription(category.description || "");
      setIsActive(category.isActive ?? true);
    } catch (error) {
      console.error("Error loading category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load category data",
        {
          description: "Please try again or check the console for details.",
        }
      );
      router.push("/category");
    } finally {
      setIsLoading(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: categoryName.trim(),
        slug: categorySlug,
        description: description.trim() || undefined,
        isActive,
      };

      // Simulate updating dummy data
      console.log("Updating category:", payload);
      toast.success("Category updated successfully!", {
        description: "The category has been updated.",
      });
      router.push("/category");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
        {
          description: "Check the console for more details.",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigateToOrders={() => router.push("/orders")}
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
              onClick={() => router.back()}
              disabled={isSubmitting || isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Edit Category</h1>
          <Card className="bg-gradient-to-br from-slate-950 to-indigo-950 border border-white/40 max-w-3xl mx-auto">
            <CardHeader>
              <h2 className="text-lg font-bold text-white">Category Details</h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-white text-center py-4">
                  Loading category data...
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white/80">Category Name</Label>
                      <Input
                        className="bg-white/5 border-white/20 focus:ring-2 focus:ring-purple-500 text-white w-full"
                        placeholder="Enter category name"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">
                        Description (Optional)
                      </Label>
                      <Textarea
                        className="bg-white/5 border-white/20 focus:ring-2 focus:ring-purple-500 text-white h-32 w-full"
                        placeholder="Describe the category..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/80">Status</Label>
                      <div className="flex items-center">
                        <Switch
                          checked={isActive}
                          onCheckedChange={setIsActive}
                          className="mr-2"
                          disabled={isSubmitting}
                        />
                        <Label className="text-white/80">
                          {isActive ? "Active" : "Inactive"}
                        </Label>
                      </div>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Category"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditCategoryForm;
