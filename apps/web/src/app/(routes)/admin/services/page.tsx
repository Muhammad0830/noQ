'use client'

import Link from 'next/link'
import { Scissors } from 'lucide-react'

export default function AdminServicesPage() {
  return (
    <div className="bg-gray-50 py-8 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Admin — Services</h1>
        </div>

        <p className="mb-4 text-gray-600">Placeholder page for admin services. Add management UI here.</p>

        <div className="space-y-3">
          <Link href="/admin/services/new" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Create new service</Link>
          <Link href="/admin" className="inline-block px-4 py-2 border rounded-lg">Back to dashboard</Link>
        </div>
      </div>
    </div>
  )
}
