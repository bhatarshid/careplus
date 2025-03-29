import { createDoctorBody, updateDoctorBody } from "@/lib/validations/doctor.schema";
import { Doctor } from "@prisma/client";
import { z } from "zod";

export type DoctorDetails = Doctor & { 
  user: { 
    id: string; 
    firstName: string; 
    lastName: string;
    phoneNumber: string;
    profilePicture: Uint8Array<ArrayBufferLike> | null;
    userType: string;
    isRegistered: boolean;
  } 
};
export type CreateDoctorBody = z.infer<typeof createDoctorBody>;
export type UpdateDoctorBody = z.infer<typeof updateDoctorBody>;