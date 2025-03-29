import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Calendar } from "lucide-react";
import { AppointmentDetails } from "@/types/entities/service-types";

interface AppointmentCardProps {
  appointment: AppointmentDetails;
  onViewDetails: (appointment: AppointmentDetails) => void;
  variant?: 'compact' | 'full';
}

export const formatAppointmentDateTime = (date: Date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 text-sm px-3 py-1">Pending</Badge>;
    case "COMPLETED":
      return <Badge className="bg-green-100 text-green-600 hover:bg-green-100 text-sm px-3 py-1">Completed</Badge>;
    case "CANCELLED":
      return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 text-sm px-3 py-1">Cancelled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-sm px-3 py-1">{status}</Badge>;
  }
};

export const AppointmentCard = ({ appointment, onViewDetails, variant = 'compact' }: AppointmentCardProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={appointment.doctorPicture ? URL.createObjectURL(new Blob([appointment.doctorPicture])) : undefined}
            alt={`${appointment.doctorFirstName} ${appointment.doctorLastName}`}
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
            {appointment.doctorFirstName[0]}{appointment.doctorLastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">
            Dr. {`${appointment.doctorFirstName} ${appointment.doctorLastName}`}
          </h3>
          <p className="text-sm text-gray-600">{appointment.doctorSpecialization}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={appointment.status} />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formatAppointmentDateTime(appointment.appointmentDate)}</span>
        </div>
        {variant === 'full' && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Service:</span> {appointment.serviceName}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-7"
          onClick={() => onViewDetails(appointment)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}; 