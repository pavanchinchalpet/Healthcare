export default function HealthcarePage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-6xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-16 md:mb-24">
              {/* Title with Heart Icon */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                HealthCare Pro
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </h1>
              
              {/* Tagline */}
              <p className="text-lg md:text-xl text-gray-600 mb-3">
                Modern healthcare management system for patients and medical staff
              </p>
              
              {/* Description */}
              <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                Book appointments, manage patient records, and streamline healthcare operations all in one place.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Staff Access Card */}
              <a href="/staff" className="group">
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Staff Access</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">For doctors and administrators</p>
                  <p className="text-gray-600 text-sm mb-6">Manage doctors, patients, appointments, and view comprehensive system data</p>
                  
                  {/* Button */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                      Enter Access Code
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>

              {/* Patient Login Card */}
              <a href="/login" className="group">
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Patient Login</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">Existing patients sign in</p>
                  <p className="text-gray-600 text-sm mb-6">Access your appointments, browse doctors, and manage your healthcare</p>
                  
                  {/* Button */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
                      Sign In
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>

              {/* New Patient Card */}
              <a href="/register" className="group">
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">New Patient</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">Create your account</p>
                  <p className="text-gray-600 text-sm mb-6">Register to book appointments with our doctors and manage your health</p>
                  
                  {/* Button */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-5 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                      Register Now
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the power of modern healthcare management with cutting-edge technology and user-friendly design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Optimized queries and caching for sub-second load times</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-sm text-gray-600">Enterprise-grade security with role-based access control</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">User-Friendly</h3>
                <p className="text-sm text-gray-600">Intuitive interface designed for healthcare professionals</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Comprehensive</h3>
                <p className="text-sm text-gray-600">Complete solution for patient management and scheduling</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Healthcare?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals who trust our platform for their daily operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
              >
                Get Started as Patient
              </a>
              <a 
                href="/staff" 
                className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
              >
                Staff Access
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
