import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MainNavigation } from "@/components/main-navigation";
import { AlertCircle, Save, RefreshCw } from "lucide-react";

export default function UpdateSecrets() {
  const { toast } = useToast();
  const [priceIds, setPriceIds] = useState({
    STRIPE_PRO_MONTHLY_PRICE_ID: 'price_1RncgSGTriQojbPQX65SA4Do',
    STRIPE_PRO_YEARLY_PRICE_ID: 'price_1RnchDGTriQojbPQ75f5koOK',
    STRIPE_PREMIUM_MONTHLY_PRICE_ID: 'price_1RnchqGTriQojbPQVhsCJgGX',
    STRIPE_PREMIUM_YEARLY_PRICE_ID: 'price_1RnciZGTriQojbPQUUDxXW1Y'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/admin/update-stripe-secrets', priceIds);
      
      toast({
        title: "Success!",
        description: "Stripe Price IDs updated successfully. Restarting server...",
      });

      // Wait a moment then reload the page to get fresh environment
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Update failed:', error);
      toast({
        title: "Update Failed",
        description: "Could not update the secrets. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
              Update Stripe Price IDs
            </CardTitle>
            <CardDescription>
              This will update the environment variables and restart the server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                These are the correct Price IDs you validated earlier. Click "Update & Restart" to apply them.
              </p>
            </div>

            {Object.entries(priceIds).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>{key.replace('STRIPE_', '').replace('_', ' ')}</Label>
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => setPriceIds(prev => ({ ...prev, [key]: e.target.value }))}
                  className="font-mono text-sm"
                  readOnly
                />
              </div>
            ))}

            <div className="pt-4">
              <Button 
                onClick={handleUpdate} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating & Restarting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update & Restart Server
                  </>
                )}
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <p className="text-yellow-800">
                <strong>Note:</strong> This will restart the server with the new Price IDs. 
                The subscription system should work immediately after the restart.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}