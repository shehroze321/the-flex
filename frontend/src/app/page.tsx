import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, BarChart3, MessageSquare, Star, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Flex Living</h1>
                <p className="text-sm text-muted-foreground">Reviews Dashboard</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Flex Living Reviews Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage and analyze guest reviews across all your properties. 
            Make data-driven decisions to improve guest satisfaction and property performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Building2 className="mr-2 h-5 w-5" />
                Manage Properties
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="flex-living-card">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>
                Comprehensive insights into review trends and property performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="flex-living-card">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Review Management</CardTitle>
              <CardDescription>
                Filter, sort, and manage reviews across all channels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="flex-living-card">
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Property Overview</CardTitle>
              <CardDescription>
                Track performance metrics for each property
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="flex-living-card">
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Quality Control</CardTitle>
              <CardDescription>
                Approve and curate reviews for public display
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Access your dashboard to start managing reviews and improving guest satisfaction.
          </p>
          <Link href="/dashboard">
            <Button size="lg">
              Access Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Flex Living. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}