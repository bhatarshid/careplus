import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDoctorDetailsAPI } from '@/lib/actions/doctor.actions';
import { DoctorDetails } from '@/types/entities';

interface DoctorState {
  doctor: DoctorDetails | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctor: null,
  isLoading: false,
  isError: false,
  error: null,
};

export const fetchDoctorDetails = createAsyncThunk(
  'doctor/fetchDoctorDetails',
  async (doctorId: string) => {
    const response = await fetchDoctorDetailsAPI(doctorId);
    return response.data.doctor;
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    reset: (state) => {
      state.doctor = null;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctor = action.payload;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message || 'Failed to fetch doctor details';
      });
  },
});

export const { reset } = doctorSlice.actions;
export default doctorSlice.reducer;