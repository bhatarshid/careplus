import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/Components/ui/form";
import { Label } from "@/components/ui/label"
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { Button } from "./ui/button";
import SubmitButton from "./SubmitButton";
import { useEffect, useState } from "react";
import { formatDate, formatEndTimeSlot, formatTimeSlot } from "@/lib/utils";
import { ServiceDoctorDetails } from "@/types/entities/service-types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { bookAppointment, reset } from "@/redux/features/appointment-slice";
// import { bookAppointment, reset } from "@/redux/features/service-slice";

export const AppointmentModal = ({
  isOpen, 
  onClose,
  doctorData
}: {
  isOpen: boolean,
  onClose: () => void,
  doctorData: ServiceDoctorDetails,
}) => { 
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any>([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const { isError: appointmentError, isSuccess: appointmentSuccess, isLoading: appointmentLoading } = useSelector((state: RootState) => state.appointment);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm();
  
  useEffect(() => {
    if(doctorData && !formInitialized) {
      form.reset({
        serviceDoctorId: doctorData?.id,
        selectedDate: '',
        selectedTime: '',
        appointmentDate: '',
        reason: ''
      });
      setFormInitialized(true);
    }
  }, [doctorData, formInitialized, form]);

  useEffect(() => {
    if(doctorData?.slots) {
      const dates = Object.keys(doctorData.slots);
      setAvailableDates(dates);
    }
  }, [doctorData])

  useEffect(() => {
    if(appointmentError) {
      toast.error("Failed to book an appointment")
      // dispatch(reset())
    }

    if(appointmentSuccess) {
      toast.success("Appointment booked successfully")
      dispatch(reset())
      onClose()
    }

    // dispatch(reset());
  }, [appointmentError, appointmentLoading, appointmentSuccess, dispatch]);

  const handleDateChange = (date: string) => {
    form.setValue('selectedDate', date);
    form.setValue('selectedTime', '');
    form.setValue('appointmentDate', '');

    const timeSlots = doctorData.slots[date].map((slot: any) => ({ startTime: slot.startTime, id: slot.id }));
    setAvailableTimeSlots(timeSlots);
  }

  const onSubmit = async (data: any) => {
    console.log({data})
    if (data.appointmentDate === '') {
      toast.error("Please select a date and time");
      return;
    }

    if (data.reason === '') {
      toast.error("Please provide a reason for the appointment");
      return;
    }

    const requestBody: {
      serviceDoctorId: string;
      appointmentDate: string;
      reason: string;
    } = {
      serviceDoctorId: data.serviceDoctorId,
      appointmentDate: data.appointmentDate,
      reason: data.reason
    }
    dispatch(bookAppointment(requestBody));    
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <DialogTitle>Book Appointment</DialogTitle>
            </div>
            <div className="text-lg font-semibold text-blue-600">${doctorData?.cost}</div>
          </div>
          <DialogDescription>
            Appointment with Dr. {doctorData?.firstName} {doctorData?.lastName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4 text-[#8f8e8e] ">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="shad-input-label">Date</Label>
                <Select
                  onValueChange={handleDateChange}
                  value={form.watch('selectedDate')}
                >
                  <SelectTrigger className="w-full bg-[#ebe9e9] rounded-[6px]">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableDates.map((date, index) => (
                      <SelectItem key={index} value={date}>
                        {formatDate(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="shad-input-label">Time</Label>
                <Select
                  onValueChange={(id) => form.setValue('appointmentDate', id)}
                  value={form.watch('appointmentDate')}
                  disabled={!form.watch('selectedDate')}
                >
                  <SelectTrigger className="w-full bg-[#ebe9e9] rounded-[6px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableTimeSlots.map((time: any, index: any) => (
                      <SelectItem key={index} value={time.id}>
                        {formatTimeSlot(time.startTime)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reason"
              label="Reason for appointment"
              placeholder="I have cold and fever."
            />

            <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={appointmentLoading}
                  className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-2"
                >
                  {appointmentLoading ? "Booking..." : "Book Appointment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}