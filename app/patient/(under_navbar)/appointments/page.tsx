"use client"

import { useState, useEffect } from "react"
import { Input } from "@/Components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Search } from "lucide-react"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllAppointments, reset } from '@/redux/features/appointment-slice';
import { AppointmentDetails } from '@/types/entities/service-types';
import AppointmentDetailsModal from "./AppointmentDetailsModal"
import { AppointmentCard } from "@/Components/appointments/AppointmentCard";
import { Badge } from "@/Components/ui/badge"

// Format date for display
const formatAppointmentDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Format time for display
const formatAppointmentTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Pending</Badge>
    case "COMPLETED":
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    case "CANCELLED":
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>
  }
}

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentDetails[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetails | null>(null)
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading, isError } = useSelector((state: RootState) => state.appointment);

  useEffect(() => {
    dispatch(fetchAllAppointments());

    return () => {
      dispatch(reset());
    }
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...(appointments || [])];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          `${appointment.doctorFirstName} ${appointment.doctorLastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === activeTab.toUpperCase())
    }

    // Sort by status (pending first) and then by appointment time
    if (filtered.length > 0) {
      filtered = [...filtered].sort((a, b) => {
        // First sort by status priority
        const statusPriority = { PENDING: 0, COMPLETED: 1, CANCELLED: 2 }
        const statusDiff =
          statusPriority[a.status as keyof typeof statusPriority] -
          statusPriority[b.status as keyof typeof statusPriority]

        if (statusDiff !== 0) return statusDiff

        // Then sort by date (newest first for pending, oldest first for others)
        const dateA = new Date(a.appointmentDate)
        const dateB = new Date(b.appointmentDate)

        if (a.status === "PENDING") {
          return dateA.getTime() - dateB.getTime() // Ascending for pending
        } else {
          return dateB.getTime() - dateA.getTime() // Descending for others
        }
      })
    }

    setFilteredAppointments(filtered)
  }, [searchTerm, activeTab, appointments])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">Loading appointments...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center text-red-500">Error loading appointments. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Appointments</h1>
        <p className="text-gray-600">Manage and view all your scheduled appointments</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onViewDetails={setSelectedAppointment}
            variant="full"
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredAppointments.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No appointments found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  )
}

