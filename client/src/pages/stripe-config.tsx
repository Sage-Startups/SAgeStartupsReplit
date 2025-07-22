import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MainNavigation } from "@/components/main-navigation";
import { AlertCircle, Save, ExternalLink } from "lucide-react";

export default function StripeConfig() {
  const { toast } = useToast();
  const [priceIds, setPriceIds] = useState({
    STRIPE_PRO_MONTHLY_PRICE_ID: '',
    STRIPE_PRO_YEARLY_PRICE_ID: '',
    STRIPE_PREMIUM_MONTHLY_PRICE_ID: '',
    STRIPE_PREMIUM_YEARLY_PRICE_ID: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setPriceIds(prev => ({ ...prev, [key]: value }));
  };

  const validatePriceId = (priceId: string) => {
    return priceId.startsWith('price_') && priceId.length > 20;
  };

  const allPriceIdsValid = Object.values(priceIds).every(id => validatePriceId(id));

  const handleSave = async () => {
    if (!allPriceIdsValid) {
      toast({
        title: "Validation Error",
        description: "All Price IDs must start with 'price_' and be properly formatted",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // This would need to be implemented as a secure way to update secrets
      toast({
        title: "Success!",
        description: "Price IDs validated! You need to update these in Replit Secrets manually.",
      });
      
      // Show the user exactly what to copy
      console.log('Copy these to Replit Secrets:', priceIds);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Fix Stripe Configuration
            </CardTitle>
            <CardDescription>
              Enter your correct Stripe Price IDs (must start with "price_")
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-red-800 mb-2">Current Issue:</h3>
              <p className="text-red-700 text-sm mb-3">
                You provided Product IDs (start with "prod_") instead of Price IDs (should start with "price_").
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open Stripe Dashboard
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pro-monthly">Pro Plan Monthly ($24/month)</Label>
                <Input
                  id="pro-monthly"
                  placeholder="price_1QhvTxBUgEEKZ1Ua..."
                  value={priceIds.STRIPE_PRO_MONTHLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PRO_MONTHLY_PRICE_ID', e.target.value)}
                  className={validatePriceId(priceIds.STRIPE_PRO_MONTHLY_PRICE_ID) ? 'border-green-300' : 'border-red-300'}
                />
                {priceIds.STRIPE_PRO_MONTHLY_PRICE_ID && !validatePriceId(priceIds.STRIPE_PRO_MONTHLY_PRICE_ID) && (
                  <p className="text-red-600 text-xs mt-1">Must start with "price_"</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="pro-yearly">Pro Plan Yearly ($240/year)</Label>
                <Input
                  id="pro-yearly"
                  placeholder="price_1QhvTxBUgEEKZ1Ub..."
                  value={priceIds.STRIPE_PRO_YEARLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PRO_YEARLY_PRICE_ID', e.target.value)}
                  className={validatePriceId(priceIds.STRIPE_PRO_YEARLY_PRICE_ID) ? 'border-green-300' : 'border-red-300'}
                />
                {priceIds.STRIPE_PRO_YEARLY_PRICE_ID && !validatePriceId(priceIds.STRIPE_PRO_YEARLY_PRICE_ID) && (
                  <p className="text-red-600 text-xs mt-1">Must start with "price_"</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="premium-monthly">Premium Plan Monthly ($44/month)</Label>
                <Input
                  id="premium-monthly"
                  placeholder="price_1QhvTxBUgEEKZ1Uc..."
                  value={priceIds.STRIPE_PREMIUM_MONTHLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PREMIUM_MONTHLY_PRICE_ID', e.target.value)}
                  className={validatePriceId(priceIds.STRIPE_PREMIUM_MONTHLY_PRICE_ID) ? 'border-green-300' : 'border-red-300'}
                />
                {priceIds.STRIPE_PREMIUM_MONTHLY_PRICE_ID && !validatePriceId(priceIds.STRIPE_PREMIUM_MONTHLY_PRICE_ID) && (
                  <p className="text-red-600 text-xs mt-1">Must start with "price_"</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="premium-yearly">Premium Plan Yearly ($432/year)</Label>
                <Input
                  id="premium-yearly"
                  placeholder="price_1QhvTxBUgEEKZ1Ud..."
                  value={priceIds.STRIPE_PREMIUM_YEARLY_PRICE_ID}
                  onChange={(e) => handleInputChange('STRIPE_PREMIUM_YEARLY_PRICE_ID', e.target.value)}
                  className={validatePriceId(priceIds.STRIPE_PREMIUM_YEARLY_PRICE_ID) ? 'border-green-300' : 'border-red-300'}
                />
                {priceIds.STRIPE_PREMIUM_YEARLY_PRICE_ID && !validatePriceId(priceIds.STRIPE_PREMIUM_YEARLY_PRICE_ID) && (
                  <p className="text-red-600 text-xs mt-1">Must start with "price_"</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={!allPriceIdsValid || isLoading}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Validating...' : 'Validate Price IDs'}
              </Button>
              {!allPriceIdsValid && (
                <p className="text-sm text-gray-600 mt-2">
                  All Price IDs must start with "price_" before you can validate
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <h4 className="font-medium text-blue-800 mb-2">How to find Price IDs:</h4>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Go to <a href="https://dashboard.stripe.com/products" target="_blank" className="underline">Stripe Products</a></li>
                <li>Click on each product</li>
                <li>In the product page, scroll to "Pricing"</li>
                <li>Click on the price amount (e.g., "$24.00/month")</li>
                <li>Copy the Price ID from the price details (starts with "price_")</li>
              </ol>
            </div>

            {allPriceIdsValid && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Next Step:</h4>
                <p className="text-green-700 text-sm">
                  Copy each Price ID and update it in Replit Secrets with the same variable name.
                  Once updated, restart the application and the subscription system will work!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}