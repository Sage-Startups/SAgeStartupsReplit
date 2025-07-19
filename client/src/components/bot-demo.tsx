import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Send, Download, Share, Shield } from "lucide-react";

export function BotDemo() {
  const [message, setMessage] = useState("");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See AI Bots in Action
          </h2>
          <p className="text-xl text-gray-600">
            Experience how our AI bots work with this interactive demo of the Logo Design Assistant.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Bot Header */}
            <div className="gradient-secondary text-white p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <Palette className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Logo Design Assistant</h3>
                  <p className="text-purple-100">Powered by GPT-4 • Specialized for Logo Creation</p>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="h-96 bg-gray-50 p-6 overflow-y-auto">
              {/* Bot Message */}
              <div className="flex mb-6">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Palette className="text-white text-sm" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-md">
                  <p className="text-gray-900">Hi! I'm your Logo Design Assistant. I can help you create unique logo concepts for your startup. To get started, please tell me:</p>
                  <ul className="mt-2 text-gray-700 text-sm space-y-1">
                    <li>• Your company name</li>
                    <li>• Industry/business type</li>
                    <li>• Preferred style (modern, classic, playful, etc.)</li>
                    <li>• Any specific colors or elements you'd like</li>
                  </ul>
                </div>
              </div>

              {/* User Message */}
              <div className="flex justify-end mb-6">
                <div className="bg-primary text-white rounded-lg p-4 shadow-sm max-w-md">
                  <p>Company: "EcoTech Solutions" - We're a green technology startup focused on sustainable energy solutions. Looking for a modern, clean design with green/blue colors that conveys innovation and environmental consciousness.</p>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex mb-6">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Palette className="text-white text-sm" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-lg">
                  <p className="text-gray-900 mb-3">Perfect! Based on your requirements, I've generated 3 logo concepts for EcoTech Solutions:</p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Concept 1: Leaf-Circuit Fusion</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                      <div className="gradient-success h-16 rounded flex items-center justify-center text-white font-bold">
                        EcoTech Solutions
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Modern leaf shape with circuit board patterns inside</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">Concept 2: Energy Wave</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                      <div className="gradient-accent h-16 rounded flex items-center justify-center text-white font-bold">
                        ⚡ EcoTech
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Dynamic wave pattern representing clean energy flow</p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    Would you like me to refine any of these concepts or create variations?
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message or ask for refinements..." 
                  className="flex-1"
                />
                <Button className="bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  End-to-end encrypted
                </div>
                <div className="flex items-center space-x-4">
                  <button className="hover:text-gray-700 transition flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    Export Chat
                  </button>
                  <button className="hover:text-gray-700 transition flex items-center">
                    <Share className="w-4 h-4 mr-1" />
                    Share Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
