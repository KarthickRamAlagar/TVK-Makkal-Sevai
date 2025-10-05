import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  email: "",
  whatsapp: "",
  userId: "",
  department: "",
  district: "",
  taluk: "",
  wardNo: "",
  role: "user",
  isSignedIn: false,
  isFirstTime: true,
  complaintId: "", //  Tracks current complaint
  userRegistry: {},
  complaintLetter: null, //  Stores structured file object
  images: [], //  Stores uploaded proof images
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
    setUserRegistry: (state, action) => {
      state.userRegistry = action.payload;
    },
    setComplaintId: (state, action) => {
      state.complaintId = action.payload;
    },
    resetForm: () => initialState,
    setSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },
    setFirstTime: (state, action) => {
      state.isFirstTime = action.payload;
    },
    resetComplaintFields: (state) => {
      state.district = "";
      state.taluk = "";
      state.wardNo = "";
      state.department = "";
      state.complaintLetter = null;
      state.images = [];
      state.complaintId = "";
    },
  },
});

export const {
  updateField,
  setFormData,
  setUserRegistry,
  setComplaintId,
  resetForm,
  setSignedIn,
  setFirstTime,
  resetComplaintFields,
} = formSlice.actions;

export default formSlice.reducer;
