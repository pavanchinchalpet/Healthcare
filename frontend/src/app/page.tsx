import { Button } from "@/components/ui/button"

export default function HealthcarePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Hero Content */}
          <section className="pt-8 pb-16 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Healthcare Management
                  <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    System
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                  Modern healthcare management with role-based access control. 
                  Streamline patient care, staff operations, and appointment scheduling.
                </p>
              </div>

              {/* Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <a href="/staff" className="group">
                  <div className="h-full rounded-3xl border-2 border-gray-200 p-8 text-left bg-white hover:border-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-3">Staff Access</h3>
                    <p className="text-gray-600 mb-4">Enter access code to manage doctors, patients, and appointments with full administrative control.</p>
                    <div className="flex items-center text-gray-900 font-medium">
                      Access Management
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>

                <a href="/login" className="group">
                  <div className="h-full rounded-3xl border-2 border-blue-200 p-8 text-left bg-gradient-to-br from-blue-50 to-white hover:border-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-3">Patient Login</h3>
                    <p className="text-gray-600 mb-4">Existing patients sign in with email and password to access their appointments and medical records.</p>
                    <div className="flex items-center text-blue-600 font-medium">
                      Sign In
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>

                <a href="/register" className="group">
                  <div className="h-full rounded-3xl border-2 border-green-200 p-8 text-left bg-gradient-to-br from-green-50 to-white hover:border-green-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-3">Patient Register</h3>
                    <p className="text-gray-600 mb-4">New patients create an account to book appointments, manage their health records, and access healthcare services.</p>
                    <div className="flex items-center text-green-600 font-medium">
                      Get Started
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the power of modern healthcare management with cutting-edge technology and user-friendly design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Optimized queries and caching for sub-second load times and professional skeleton loading.</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">Enterprise-grade security with role-based access control and persistent session management.</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">User-Friendly</h3>
                <p className="text-gray-600">Intuitive interface designed for healthcare professionals with responsive mobile-first design.</p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive</h3>
                <p className="text-gray-600">Complete solution for patient management, appointment scheduling, and healthcare operations.</p>
              </div>
            </div>
          </section>


          {/* CTA Section */}
          <section className="py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Healthcare?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare professionals who trust our platform for their daily operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                  <a href="/register">Get Started as Patient</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-4 text-lg">
                  <a href="/staff">Staff Access</a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}