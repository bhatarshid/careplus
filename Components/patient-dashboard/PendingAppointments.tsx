import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllAppointments } from "@/redux/features/appointment-slice";
import { AppointmentDetails } from "@/types/entities/service-types";
import Link from "next/link";
import AppointmentDetailsModal from "@/app/patient/(under_navbar)/appointments/AppointmentDetailsModal";
import { AppointmentCard } from "@/Components/appointments/AppointmentCard";

export const PendingAppointments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading } = useSelector((state: RootState) => state.appointment);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetails | null>(null);

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  const pendingAppointments = appointments?.filter(
    (appointment) => appointment.status === "PENDING"
  ).slice(0, 3); // Only show first 3 pending appointments

  if (isLoading) {
    return <div className="text-center py-4">Loading appointments...</div>;
  }

  if (!pendingAppointments?.length) {
    return null; // Don't show the section if there are no pending appointments
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Appointments</h2>
        <Link 
          href="/patient/appointments" 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingAppointments.map((appointment: AppointmentDetails) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onViewDetails={setSelectedAppointment}
          />
        ))}
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  );
}; 