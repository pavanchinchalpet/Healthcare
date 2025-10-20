'use client'

import { useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CREATE_PATIENT } from '@/graphql/mutations/patients'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function RegisterPage() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [createPatient, { loading }] = useMutation(CREATE_PATIENT, {
    onCompleted: (data) => {
      const p = data?.createPatient
      if (p?.id) {
        login({ role: 'patient', userId: p.id, displayName: p.name || 'Patient' })
        window.location.href = '/patient'
      }
    },
    onError: (e) => alert(e.message),
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createPatient({ 
      variables: { 
        createPatientInput: { 
          name, 
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          email, 
          phone, 
          address, 
          password 
        } 
      } 
    })
  }

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Patient Registration Page */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <section className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    Patient Registration
                  </span>
                </h1>
              </div>

              <Card className="max-w-xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Register</CardTitle>
                  <CardDescription className="text-gray-600">Fill your basic details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 text-left block">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700 text-left block">Age</Label>
                      <Input 
                        id="age" 
                        type="number"
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        className="h-10 text-base"
                        placeholder="Enter your age"
                        min="1"
                        max="150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700 text-left block">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="h-10 text-base">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 text-left block">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="h-10 text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 text-left block">Phone</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="h-10 text-base"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700 text-left block">Address</Label>
                      <Textarea 
                        id="address" 
                        rows={2} 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="text-base resize-none"
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 text-left block">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="h-10 text-base"
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-10 text-base font-medium"
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </Button>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="border-2 border-gray-300 hover:bg-gray-50 h-10 px-6"
                      >
                        <a href="/login">Login</a>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}


