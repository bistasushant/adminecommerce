"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import MobileSideBar from "@/components/MobileSideBar";
import { IProduct, ICategory } from "@/types";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const ProductsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [productsData, setProductsData] = useState<IProduct[]>(dummyProducts);
  const [categories] = useState<ICategory[]>(dummyCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(Math.ceil(dummyProducts.length / 10));
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const router = useRouter();

  const navigateToOrders = () => {
    router.push("/orders");
  };

  // Function to get category names by IDs
  const getCategoryNames = (categoryIds: string[]) => {
    if (!Array.isArray(categoryIds)) {
      return "Unknown Category";
    }

    return categoryIds
      .map((categoryId) => {
        const category =
          categories.find((cat) => cat.id === categoryId)?.name ||
          "Unknown Category";
        return category;
      })
      .join(", ");
  };

  const filteredProducts = productsData.filter((product) => {
    const categoryNames = getCategoryNames(product.category);
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryNames.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "In Stock" && product.stock > 0) ||
      (filter === "Out of Stock" && product.stock === 0) ||
      (filter === "On Sale" && product.price < 500);
    return matchesSearch && matchesFilter;
  });

  const sortedProducts = filteredProducts.sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (id: string) => {
    router.push(`/products/edit/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openDeleteDialog = (product: { id: string; slug: string }) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedProduct) {
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      setProductsData((prev) =>
        prev.filter((product) => product.slug !== selectedProduct.slug)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", {
        description: "Please try again later.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
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
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search Products....."
                  className="w-full bg-white/5 border border-white/30 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gray-400/20 border hover:bg-gray-900">
                    <Filter size={16} />
                    <span className="font-normal">Filter</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/90 text-white">
                  <DropdownMenuItem onClick={() => setFilter("All")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("In Stock")}>
                    In Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("Out of Stock")}>
                    Out of Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("On Sale")}>
                    On Sale
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gray-400/20 border hover:bg-gray-900">
                    <span className="font-normal">Sort by Price</span>
                    <ArrowUpDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/90 text-white">
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => router.push("/products/add")}
              className="flex items-center gap-2 bg-emerald-600/30 border border-emerald-500 hover:bg-emerald-600/40 mt-4 md:mt-0"
            >
              <Plus size={16} />
              <span className="font-normal">Add Product</span>
            </Button>
          </div>

          <Card className="bg-white/5 border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-2xl">
                Product List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70 text-md">
                        Product ID
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Product Name
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Slug
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Categories
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Price
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Stock
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Status
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((product, index) => (
                        <TableRow
                          key={product.id}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="text-white/70 text-md">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    product.image || "/images/placeholder.png"
                                  }
                                  alt="Product Image"
                                />
                                <AvatarFallback className="bg-purple-600">
                                  P
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white/70 text-md">
                                {product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/70 text-md">
                            {product.slug}
                          </TableCell>
                          <TableCell className="text-white/70 text-md">
                            {getCategoryNames(product.category)}
                          </TableCell>
                          <TableCell className="text-white/70 text-md">
                            Rs {product.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-white/70 text-md">
                            {product.stock}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                product.stock > 0
                                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              }`}
                            >
                              {product.stock > 0 ? "Available" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-400/20"
                                onClick={() =>
                                  product.id && handleEdit(product.id)
                                }
                              >
                                <span className="text-blue-500">
                                  <Pencil />
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-400/20"
                                onClick={() =>
                                  product.id &&
                                  product.slug &&
                                  openDeleteDialog({
                                    id: product.id,
                                    slug: product.slug,
                                  })
                                }
                              >
                                <span className="text-red-500">
                                  <Trash2 />
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-white/70"
                        >
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <Pagination className="mt-3">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`text-white/60 hover:bg-gray-500/20 hover:text-white/80 ${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`text-white/60 hover:bg-gray-500/20 hover:text-white/80 ${
                          currentPage === page
                            ? "bg-emerald-500/20 text-emerald-400"
                            : ""
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`text-white/60 hover:bg-gray-500/20 hover:text-white/80 ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-gray-900 border border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
