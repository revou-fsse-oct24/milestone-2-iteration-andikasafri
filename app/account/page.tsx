// account/page.tsx
"use client";

import { withAuth } from "@/lib/hoc/withAuth";
import { useAuth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthWishlist } from "@/lib/hooks/use-wishlist";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProduct } from "@/lib/productApi";
import { Product } from "@/lib/types";

const mockOrders = [
  {
    id: "1",
    date: "2024-03-20",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: 1,
        title: "Premium Headphones",
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      },
      {
        id: 2,
        title: "Wireless Mouse",
        price: 49.99,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      },
    ],
  },
];

function AccountPage() {
  const { user } = useAuth();
  const { items: wishlistIds, removeItem: removeFromWishlist } =
    useAuthWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    newsletter: true,
  });

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!user || wishlistIds.length === 0) return;

      try {
        const productPromises = wishlistIds.map(async (id) => {
          try {
            const product = await getProduct(id);
            return product;
          } catch (error) {
            console.warn(`Product ${id} not found, removing from wishlist`);
            removeFromWishlist(id);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        // Filter out null values (failed product fetches)
        const validProducts = products.filter(
          (product): product is Product => product !== null
        );
        setWishlistProducts(validProducts);
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
        toast({
          variant: "destructive",
          description: "Failed to load wishlist products",
        });
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds, user, toast, removeFromWishlist]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Implement your profile update logic here.
      toast({
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password update logic as needed.
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast({
      description: "Notification preferences updated",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit">Update Profile</Button>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button type="submit">Change Password</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : "secondary"
                          }
                          className="mb-2"
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <p className="font-semibold">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-20 h-20">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Package className="w-4 h-4 mr-2" />
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Need Help?
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <Card key={product.id} className="relative group">
                      <Link href={`/product/${product.id}`}>
                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{product.title}</h3>
                        <p className="text-lg font-bold text-primary">
                          ${product.price}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button className="flex-1">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              removeFromWishlist(product.id);
                              toast({
                                description: "Removed from wishlist",
                              });
                            }}
                          >
                            <Heart className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Your wishlist is empty
                  </p>
                  <Link href="/products">
                    <Button className="mt-4">Browse Products</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important account notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate("emailNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about your order status
                  </p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate("orderUpdates", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Promotional Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive special offers and promotions
                  </p>
                </div>
                <Switch
                  checked={notifications.promotionalEmails}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate("promotionalEmails", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Subscribe to our weekly newsletter
                  </p>
                </div>
                <Switch
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate("newsletter", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(AccountPage);
