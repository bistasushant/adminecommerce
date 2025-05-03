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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ICategory } from "@/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Dummy data
const dummyCategories: ICategory[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets and electronic devices",
    isActive: true,
    createdAt: new Date("2025-04-20T11:00:00Z"),
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and accessories",
    isActive: true,
    createdAt: new Date("2025-04-20T11:00:00Z"),
  },
  {
    id: "3",
    name: "Books",
    slug: "books",
    description: "Printed and digital books",
    isActive: false,
    createdAt: new Date("2025-04-20T11:00:00Z"),
  },
  {
    id: "4",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Furniture and gardening supplies",
    isActive: true,
    createdAt: new Date("2025-04-20T11:00:00Z"),
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

const CategoriesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoriesData, setCategoriesData] =
    useState<ICategory[]>(dummyCategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(null);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(dummyCategories.length / 10)
  );

  const itemsPerPage = 10;
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = () => {
    if (!selectedCategorySlug) return;
    setCategoriesData((prev) =>
      prev.filter((cat) => cat.slug !== selectedCategorySlug)
    );
    setTotalPages(Math.ceil((categoriesData.length - 1) / itemsPerPage));
    toast.success("Category deleted successfully!");
    setSelectedCategorySlug(null);
  };

  const filteredCategories = categoriesData.filter((category) => {
    if (!category) return false;
    const nameMatch =
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const slugMatch =
      category.slug?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const descMatch =
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesSearch =
      searchTerm === "" || nameMatch || slugMatch || descMatch;
    if (filter === "Active" && category.isActive === false) return false;
    if (filter === "Inactive" && category.isActive === true) return false;
    return matchesSearch;
  });

  const sortedCategories = filteredCategories.sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigateToOrders = () => router.push("/orders");

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
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search Categories..."
                  className="w-full bg-white/5 border border-white/30 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  <DropdownMenuItem onClick={() => setFilter("Active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("Inactive")}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gray-400/20 border hover:bg-gray-900">
                    <span className="font-normal">Sort by Name</span>
                    <ArrowUpDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/90 text-white">
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    A → Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    Z → A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => router.push("/category/add")}
              className="flex items-center gap-2 bg-emerald-600/30 border border-emerald-500 hover:bg-emerald-600/40 mt-4 md:mt-0"
            >
              <Plus size={16} />
              <span className="font-normal">Add Category</span>
            </Button>
          </div>

          <Card className="bg-white/5 border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-2xl">
                Category Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70 text-md">
                        ID
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Name
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Description
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Slug
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Status
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Created
                      </TableHead>
                      <TableHead className="text-white/70 text-md">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCategories.length > 0 ? (
                      paginatedCategories.map((category, index) => (
                        <TableRow
                          key={category.id || category.slug}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="text-white/70 text-md">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="text-white/70 text-md font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell className="text-white/70 text-md max-w-[200px] truncate">
                            {category.description || "No description"}
                          </TableCell>
                          <TableCell className="text-white/70 text-md max-w-[200px] truncate">
                            {category.slug || "No slug"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                category.isActive
                                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                              }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/70 text-md">
                            {category.createdAt
                              ? new Date(
                                  category.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-400/20"
                                onClick={() =>
                                  router.push(`/category/edit/${category.slug}`)
                                }
                              >
                                <Pencil className="w-4 h-4 text-emerald-400" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-gray-400/20"
                                    onClick={() =>
                                      setSelectedCategorySlug(category.slug)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-950/90">
                                  <AlertDialogHeader className="text-white">
                                    <AlertDialogTitle>
                                      Confirm Deletion
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/80">
                                      Are you sure you want to delete this
                                      category? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() =>
                                        setSelectedCategorySlug(null)
                                      }
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDelete}
                                      className="bg-red-500 hover:bg-red-800"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key="no-categories">
                        <TableCell
                          colSpan={7}
                          className="text-center text-white/70"
                        >
                          No categories found
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
    </div>
  );
};

export default CategoriesPage;
