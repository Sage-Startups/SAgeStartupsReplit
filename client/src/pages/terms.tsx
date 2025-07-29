import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, FileText, Scale, AlertTriangle, DollarSign } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Sage-Startups</span>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: January 29, 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Agreement */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-blue-600" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                These Terms of Service ("Terms") govern your use of the Sage-Startups website, mobile application, 
                and services (collectively, the "Services") operated by Sage-Startups ("we," "us," or "our").
              </p>
              <p className="text-gray-600">
                By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any 
                part of these terms, then you may not access the Services.
              </p>
            </CardContent>
          </Card>

          {/* Description of Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Description of Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Sage-Startups provides AI-powered business tools and resources designed to help entrepreneurs build, 
                launch, and grow their startups. Our Services include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>60+ specialized AI tools for marketing, branding, advertising, and analytics</li>
                <li>Business plan generation and strategy development</li>
                <li>Brand identity creation and marketing content generation</li>
                <li>Market research and competitive analysis</li>
                <li>SEO optimization and digital marketing guidance</li>
                <li>Financial projections and business metrics tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
                <p className="text-gray-600">
                  To access certain features of our Services, you must create an account. You agree to provide 
                  accurate, current, and complete information during registration and to update such information 
                  to keep it accurate, current, and complete.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
                <p className="text-gray-600">
                  You are responsible for safeguarding your password and all activities that occur under your account. 
                  You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Termination</h3>
                <p className="text-gray-600">
                  We may terminate or suspend your account at any time for violations of these Terms or for any other 
                  reason at our sole discretion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription and Billing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Subscription and Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Subscription Plans</h3>
                <p className="text-gray-600">
                  We offer various subscription plans with different features and usage limits. By subscribing, 
                  you agree to pay the applicable fees and any applicable taxes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Billing</h3>
                <p className="text-gray-600">
                  Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable 
                  except as provided in our refund policy or required by law.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Price Changes</h3>
                <p className="text-gray-600">
                  We reserve the right to change our pricing at any time. We will provide notice of price changes 
                  and the opportunity to cancel your subscription before the change takes effect.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Refund Policy</h3>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee for new subscriptions. Refund requests must be submitted 
                  within 30 days of your initial purchase.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">You agree not to use the Services to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Upload, post, or transmit any harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use our Services to create content that promotes illegal activities</li>
                <li>Reverse engineer, decompile, or attempt to extract source code</li>
                <li>Use automated systems to access our Services without permission</li>
                <li>Resell or redistribute our Services without authorization</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Our Intellectual Property</h3>
                <p className="text-gray-600">
                  The Services and their original content, features, and functionality are owned by Sage-Startups 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
                <p className="text-gray-600">
                  You retain ownership of any content you create using our Services. By using our Services, you 
                  grant us a limited license to use your content solely for the purpose of providing and improving 
                  our Services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Content</h3>
                <p className="text-gray-600">
                  Content generated by our AI tools is provided to you for your use. However, you should review 
                  and verify all AI-generated content before using it for commercial purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of 
                the Services, to understand our practices regarding the collection and use of your information.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Disclaimers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE DISCLAIM ALL WARRANTIES, 
                WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-600">
                We do not warrant that the Services will be uninterrupted, error-free, or completely secure. 
                The AI-generated content is provided for informational purposes and should not be considered 
                professional advice.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
                DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You agree to defend, indemnify, and hold harmless Sage-Startups and its employees, contractors, 
                agents, officers, and directors from and against any and all claims, damages, obligations, losses, 
                liabilities, costs, or debt arising from your use of the Services or violation of these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, for any 
                reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-600">
                Upon termination, your right to use the Services will cease immediately. If you wish to terminate 
                your account, you may simply discontinue using the Services.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, 
                without regard to its conflict of law provisions. Any legal action or proceeding arising under these 
                Terms will be brought exclusively in the courts of California.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we 
                will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes 
                a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>Email: legal@sage-startups.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Innovation Drive, Tech Quarter, Building 5, San Francisco, CA 94105</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">Sage-Startups</span>
          </div>
          <p className="text-sm">
            &copy; 2025 Sage-Startups. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}