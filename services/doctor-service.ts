import AppError from "@/lib/App-Error";
import prisma from "@/lib/db";
import { CreateDoctorBody, DoctorDetails, UpdateDoctorBody } from "@/types/entities";

export const fetchAllDoctors = async () => {
  try {
    const doctors: DoctorDetails[] = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profilePicture: true,
            userType: true,
            isRegistered: true
          },
        },
      },
    });

    const doctorResponse = doctors.map(doctor => ({
     ...doctor,
     firstName: doctor.user.firstName,
     lastName: doctor.user.lastName,
     phoneNumber: doctor.user.phoneNumber,
     profilePicture: doctor.user.profilePicture? Buffer.from(doctor.user.profilePicture).toString('base64') : null,
     userType: doctor.user.userType,
     isRegistered: doctor.user.isRegistered, 
    }))

    return doctorResponse;
  }
  catch (error) {
    throw error;
  }
}

export const fetchDoctorById = async (id: string): Promise<DoctorDetails> => {
  try {
    const doctor: DoctorDetails | null = await prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profilePicture: true,
            userType: true,
            isRegistered: true
          },
        },
      },
    });

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    return doctor;
  }
  catch (error) {
    throw error;
  }
}

// export const createDoctorService = async (data: CreateDoctorBody): Promise<string> => {
//   try {
//     const doctor: DoctorType | null = await prisma.doctor.findUnique({ 
//       where: {
//         phoneNumber: data.phoneNumber 
//       } 
//     });

//     if (doctor) {
//       throw new AppError("Doctor with the same name already exists", 400);
//     }

//     await prisma.doctor.create({
//       data: {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         phoneNumber: data.phoneNumber,
//         emailId: data.emailId,
//         picture: data.picture,
//         specialization: data.specialization,
//         experience: data.experience,
//         department: data.department,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     });

//     return "Doctor created"
//   }
//   catch (error) {
//     throw error;
//   }
// }

// export const updateDoctorService = async (data: UpdateDoctorBody): Promise<string> => {
//   try {
//     const doctor: DoctorType | null = await prisma.doctor.findUnique({
//       where: {
//         id: data.id,
//       },
//     });

//     if (!doctor) {
//       throw new AppError("Doctor not found", 404);
//     }

//     await prisma.doctor.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         firstName: data.firstName ?? doctor.firstName,
//         lastName: data.lastName ?? doctor.lastName,
//         phoneNumber: data.phoneNumber ?? doctor.phoneNumber,
//         emailId: data.emailId ?? doctor.emailId,
//         picture: data.picture ?? doctor.picture,
//         specialization: data.specialization ?? doctor.specialization,
//         experience: data.experience ?? doctor.experience,
//         department: data.department ?? doctor.department,
//         updatedAt: new Date()
//       },
//     });

//     return "Doctor Data Updated"
//   }
//   catch (error) {
//     throw error;
//   }
// }