import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, TrendingUp, Calculator, PieChart, 
  BarChart3, ArrowUpRight, ArrowDownRight, 
  Download, FileText
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export function FinancialCalculator() {
  // Revenue Calculator State
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [churnRate, setChurnRate] = useState("");
  
  // Expense Tracker State
  const [expenses, setExpenses] = useState([
    { category: "Salaries", amount: 50000, percentage: 40 },
    { category: "Marketing", amount: 20000, percentage: 16 },
    { category: "Operations", amount: 15000, percentage: 12 },
    { category: "Technology", amount: 10000, percentage: 8 },
    { category: "Office", amount: 8000, percentage: 6.4 },
    { category: "Other", amount: 22000, percentage: 17.6 }
  ]);
  
  // ROI Calculator State
  const [investment, setInvestment] = useState("");
  const [returns, setReturns] = useState("");
  const [timeframe, setTimeframe] = useState("12");

  // Calculate projections
  const calculateProjections = () => {
    const monthly = parseFloat(monthlyRevenue) || 0;
    const growth = parseFloat(growthRate) || 0;
    const churn = parseFloat(churnRate) || 0;
    
    const projections = [];
    let currentRevenue = monthly;
    
    for (let i = 0; i < 12; i++) {
      const netGrowth = (growth - churn) / 100;
      currentRevenue = currentRevenue * (1 + netGrowth);
      projections.push({
        month: `Month ${i + 1}`,
        revenue: Math.round(currentRevenue),
        growth: Math.round(currentRevenue * (growth / 100)),
        churn: Math.round(currentRevenue * (churn / 100))
      });
    }
    
    return projections;
  };

  const projectionData = calculateProjections();
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const roi = investment && returns ? ((parseFloat(returns) - parseFloat(investment)) / parseFloat(investment) * 100).toFixed(2) : 0;

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          Financial Calculator Suite
        </h1>
        <p className="text-gray-600 mt-2">
          Professional financial tools for startup planning and analysis
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Projections</TabsTrigger>
          <TabsTrigger value="expenses">Expense Tracker</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
          <TabsTrigger value="runway">Burn Rate</TabsTrigger>
        </TabsList>

        {/* Revenue Projections Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Revenue Parameters</CardTitle>
                <CardDescription>Enter your business metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthly-revenue">Current Monthly Revenue ($)</Label>
                  <Input
                    id="monthly-revenue"
                    type="number"
                    placeholder="50000"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="growth-rate">Monthly Growth Rate (%)</Label>
                  <Input
                    id="growth-rate"
                    type="number"
                    placeholder="10"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="churn-rate">Monthly Churn Rate (%)</Label>
                  <Input
                    id="churn-rate"
                    type="number"
                    placeholder="2"
                    value={churnRate}
                    onChange={(e) => setChurnRate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>12-Month Revenue Projection</CardTitle>
                <CardDescription>Based on your growth and churn rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="growth" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Growth"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="churn" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Churn"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Year 1 Total</p>
                    <p className="text-2xl font-bold">
                      ${projectionData.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Growth</p>
                    <p className="text-2xl font-bold">
                      {((parseFloat(growthRate) || 0) - (parseFloat(churnRate) || 0)).toFixed(1)}%
                    </p>
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Month 12 MRR</p>
                    <p className="text-2xl font-bold">
                      ${projectionData[11]?.revenue.toLocaleString() || 0}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Growth Multiple</p>
                    <p className="text-2xl font-bold">
                      {monthlyRevenue ? (projectionData[11]?.revenue / parseFloat(monthlyRevenue)).toFixed(1) : 0}x
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expense Tracker Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Visualize your spending categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={expenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {expenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>Track and manage your costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{expense.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">${expense.amount.toLocaleString()}</span>
                        <Badge variant="secondary">{expense.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Monthly Expenses</span>
                      <span>${totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
              <CardDescription>Monthly expense comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Calculator Tab */}
        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Calculator</CardTitle>
                <CardDescription>Calculate your return on investment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="investment">Initial Investment ($)</Label>
                  <Input
                    id="investment"
                    type="number"
                    placeholder="100000"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="returns">Expected Returns ($)</Label>
                  <Input
                    id="returns"
                    type="number"
                    placeholder="150000"
                    value={returns}
                    onChange={(e) => setReturns(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe (months)</Label>
                  <Input
                    id="timeframe"
                    type="number"
                    placeholder="12"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Results</CardTitle>
                <CardDescription>Your investment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Return on Investment</p>
                    <p className="text-5xl font-bold text-green-600">{roi}%</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Net Profit</p>
                      <p className="text-2xl font-bold">
                        ${((parseFloat(returns) || 0) - (parseFloat(investment) || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly ROI</p>
                      <p className="text-2xl font-bold">
                        {timeframe ? (parseFloat(roi) / parseFloat(timeframe)).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Burn Rate Tab */}
        <TabsContent value="runway" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Burn Rate & Runway Calculator</CardTitle>
              <CardDescription>Understand your cash runway</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Status</h3>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Burn Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${(totalExpenses - (parseFloat(monthlyRevenue) || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cash Balance</p>
                    <p className="text-2xl font-bold">$500,000</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Runway Analysis</h3>
                  <div>
                    <p className="text-sm text-gray-600">Months of Runway</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalExpenses > (parseFloat(monthlyRevenue) || 0) 
                        ? Math.round(500000 / (totalExpenses - (parseFloat(monthlyRevenue) || 0)))
                        : '∞'} months
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Run Out Date</p>
                    <p className="text-lg font-semibold">
                      {totalExpenses > (parseFloat(monthlyRevenue) || 0)
                        ? new Date(Date.now() + (500000 / (totalExpenses - (parseFloat(monthlyRevenue) || 0))) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                        : 'Cash Flow Positive'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Recommendations</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {totalExpenses > (parseFloat(monthlyRevenue) || 0) * 1.5 ? 'High Burn' : 'Moderate Burn'}
                  </Badge>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Reduce non-essential expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Focus on revenue growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Consider fundraising options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Export Financial Reports</h3>
              <p className="text-sm text-gray-600">Download comprehensive financial analysis</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                PDF Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Excel Sheet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}