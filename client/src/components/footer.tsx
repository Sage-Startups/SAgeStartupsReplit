import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Brain className="text-primary text-2xl mr-2" />
              <h3 className="text-xl font-bold">BrandAI Pro</h3>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered branding automation for the next generation of startups.
            </p>
            <div className="flex space-x-4">
              <i className="fab fa-twitter text-xl text-gray-400 hover:text-white cursor-pointer transition"></i>
              <i className="fab fa-linkedin text-xl text-gray-400 hover:text-white cursor-pointer transition"></i>
              <i className="fab fa-github text-xl text-gray-400 hover:text-white cursor-pointer transition"></i>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">API</a></li>
              <li><a href="#" className="hover:text-white transition">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BrandAI Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
