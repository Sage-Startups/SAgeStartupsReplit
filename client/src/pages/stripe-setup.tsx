import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function StripeSetup() {
  const { toast } = useToast();
  const [priceIds, setPriceIds] = useState({
    STRIPE_PRO_MONTHLY_PRICE_ID: '',
    STRIPE_PRO_YEARLY_PRICE_ID: '',
    STRIPE_PREMIUM_MONTHLY_PRICE_ID: '',
    STRIPE_PREMIUM_YEARLY_PRICE_ID: ''
  });

  const handleInputChange = (key: string, value: string) => {
    setPriceIds(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await apiRequest('POST', '/api/admin/update-stripe-config', priceIds);
      toast({
        title: "Success",
        description: "Stripe Price IDs updated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Stripe configuration",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Stripe Configuration</CardTitle>
            <CardDescription>
              Enter your Stripe Price IDs to enable subscription functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pro-monthly">Pro Plan Monthly ($24/month)</Label>
                <Input
                  id="pro-monthly"
                  placeholder="price_1QhvTxBUgEEKZ1Ua..."
                  value={priceIds.STRIPE_PRO_MONTHLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PRO_MONTHLY_PRICE_ID', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="pro-yearly">Pro Plan Yearly ($240/year)</Label>
                <Input
                  id="pro-yearly"
                  placeholder="price_1QhvTxBUgEEKZ1Ub..."
                  value={priceIds.STRIPE_PRO_YEARLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PRO_YEARLY_PRICE_ID', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="premium-monthly">Premium Plan Monthly ($44/month)</Label>
                <Input
                  id="premium-monthly"
                  placeholder="price_1QhvTxBUgEEKZ1Uc..."
                  value={priceIds.STRIPE_PREMIUM_MONTHLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PREMIUM_MONTHLY_PRICE_ID', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="premium-yearly">Premium Plan Yearly ($432/year)</Label>
                <Input
                  id="premium-yearly"
                  placeholder="price_1QhvTxBUgEEKZ1Ud..."
                  value={priceIds.STRIPE_PREMIUM_YEARLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PREMIUM_YEARLY_PRICE_ID', e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSubmit} className="w-full">
                Save Price IDs
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>How to find your Price IDs:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://dashboard.stripe.com/products" target="_blank" className="text-blue-600 hover:underline">Stripe Products Dashboard</a></li>
                <li>Create products for each plan if not already created</li>
                <li>Click on each product to see its prices</li>
                <li>Copy the Price ID (starts with "price_")</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}