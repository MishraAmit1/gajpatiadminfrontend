import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Factory,
  Leaf,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Package,
      description: "Active products in catalog",
    },
    {
      title: "Plants",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Factory,
      description: "Manufacturing plants",
    },
    {
      title: "Natures",
      value: "12",
      change: "+3",
      trend: "up",
      icon: Leaf,
      description: "Product categories",
    },
    {
      title: "Blogs",
      value: "18",
      change: "+5",
      trend: "up",
      icon: FileText,
      description: "Published articles",
    },
    {
      title: "Inquiries",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: MessageSquare,
      description: "Customer inquiries",
    },
    {
      title: "Users",
      value: "89",
      change: "-2%",
      trend: "down",
      icon: Users,
      description: "Registered users",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Gajpati Industries Admin Panel
        </p>
      </div>
      {/* Stats Grid */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={stat.trend === "up" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div> */}
      {/* Recent Activity */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      New product added: Product {i}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i} hour{i !== 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm">
                Add New Product
              </button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm">
                Create Blog Post
              </button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm">
                View Inquiries
              </button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm">
                Manage Users
              </button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default Dashboard;
