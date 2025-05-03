import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ShoppingCart, Users } from "lucide-react";

const Stats = () => {
  return (
    <div className="grid gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-white/70">
          Welcome back, Admin! Here&apos;s what&apos;s happening with your store
          today.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium text-white/70">
              Total Revenue
            </CardTitle>
            <FontAwesomeIcon
              icon={faRupeeSign}
              className="h-6 w-6 text-purple-400"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">Rs 45,231</div>
            <p className="text-sm text-white/70">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium text-white/70">
              Orders
            </CardTitle>
            <ShoppingCart className="h-6 w-6 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">+2,350</div>
            <p className="text-sm text-white/70">+12.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium text-white/70">
              Products
            </CardTitle>
            <Box className="h-6 w-6 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">12,234</div>
            <p className="text-sm text-white/70">+32 new this month</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 shadow-lg hover:shadow-purple-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium text-white/70">
              Active Users
            </CardTitle>
            <Users className="h-6 w-6 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">+573</div>
            <p className="text-sm text-white/70">+201 since last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
