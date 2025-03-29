import axios from "axios";

const DOCTOR_API = '/api/doctor';

export const fetchDoctorsAPI = async () => {
  try {
    const response = await axios.get(`${DOCTOR_API}?action=all`);
    return response;
  }
  catch (error: any) {
    throw error;
  }
}

export const fetchDoctorDetailsAPI = async (doctorId: string) => {
  try {
    const response = await axios.get(`${DOCTOR_API}?action=single&id=${doctorId}`);
    return response;
  }
  catch (error: any) {
    throw error;
  }
}