"use client"

import { useState } from "react"
import { Calendar, Clock, Medal, Phone, DollarSign, Star, ChevronsDown, ChevronsRight } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { formatDate, formatTimeSlot, getImageSrc } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DoctorCardProps {
  doctor: any
  onBookNow: (doctor: any) => void
}

export function DoctorCard({ doctor, onBookNow }: DoctorCardProps) {
  const [expandedDate, setExpandedDate] = useState(null)
  const router = useRouter()

  const handleViewProfile = () => {
    router.push(`/patient/doctors/${doctor.doctorId}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-3 relative">
          <img
            src={getImageSrc(doctor.doctorPicture) || "/placeholder.svg"}
            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            className="w-full h-64 object-fill"
          />
        </div>

        <div className="lg:col-span-4 p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-darkcolor-high mb-2">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <div className="flex items-center mb-4">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-gray-700">4.0</span>
            <span className="ml-1 text-darkcolor-medium">(193 reviews)</span>
          </div>
          <div className="space-y-3 text-darkcolor-medium">
            <div className="flex items-center">
              <Medal className="h-4 w-4 mr-2" />
              <span>{doctor.specialization}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{doctor.experience} experience</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>{doctor.phoneNumber}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>${doctor.cost} per visit</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
          <h4 className="text-lg font-semibold text-darkcolor-high mb-4">Available Dates</h4>
          <div className="space-y-2">
            {Object.keys(doctor.slots).map((dateStr: any) => (
              <div key={dateStr} className="border border-blue-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-blue-50 transition-colors"
                  onClick={() => setExpandedDate(expandedDate === dateStr ? null : dateStr)}
                >
                  <div className="flex items-center text-blue-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(dateStr)}</span>
                  </div>
                  <div className="h-4 w-4 text-blue-600">
                    {expandedDate === dateStr ? <ChevronsRight /> : <ChevronsDown />}
                  </div>
                </button>

                {expandedDate === dateStr && (
                  <div className="border-t border-blue-200 bg-blue-50 p-2">
                    <div className="grid grid-cols-1 gap-2">
                      {doctor.slots[dateStr].map((slot: any, index: number) => (
                        <button
                          key={index}
                          className="flex items-center justify-center p-2 bg-white border border-blue-200 rounded-md text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatTimeSlot(slot.startTime)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-darkcolor-low flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-200">
          <Button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-3"
            onClick={() => onBookNow(doctor)}
          >
            Book Now
          </Button>
          <Button variant="outline" className="w-full" onClick={handleViewProfile}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

