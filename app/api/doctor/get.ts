import AppError, { handleErrorNextResponse } from "@/lib/App-Error";
import { fetchAllDoctors, fetchDoctorById } from "@/services/doctor-service";
import { DoctorDetails } from "@/types/entities/doctor-types";

import { NextRequest, NextResponse } from "next/server";

export async function getAllDoctors() {
  try {
    const doctors = await fetchAllDoctors();

    return NextResponse.json({ doctors }, { status: 200 });
  }
  catch (error) {
    return handleErrorNextResponse(error);
  }
}

export async function getDoctorById(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      throw new AppError('Provide Id of doctor', 400);
    }

    const doctor: DoctorDetails | null = await fetchDoctorById(id);

    return NextResponse.json({ doctor }, { status: 200 });
  }
  catch (error) {
    return handleErrorNextResponse(error);
  }
}