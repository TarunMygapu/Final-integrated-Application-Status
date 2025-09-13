
import React, { useState, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import { Button as MuiButton } from "@mui/material";
import Button from "../../Widgets/Button/Button";
import { ReactComponent as Add } from "../../Asserts/ApplicationStatus/si_add-fill.svg";
import { ReactComponent as TrendingUpIcon } from "../../Asserts/ApplicationStatus/Trending up.svg";
import CashIcon from "../../Asserts/ApplicationStatus/Cash (1).svg";
import DDIcon from "../../Asserts/ApplicationStatus/DD (1).svg";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import { ReactComponent as UploadIcon } from "../../Asserts/ApplicationStatus/Upload.svg";
import SkipIcon from "../../Asserts/ApplicationStatus/SkipIcon.svg";
import { ReactComponent as PhoneIcon } from "../../Asserts/ApplicationStatus/PhoneIcon.svg";
import { ReactComponent as EmailIcon } from "../../Asserts/ApplicationStatus/EmailIcon.svg";
import * as Yup from "yup";
import apiService from "../../Bakend/SaleFormapis";
import SiblingInfoSection from "../SiblingInfoSection/SiblingInfoSection";
import styles from "./GeneralInfoSection.module.css";

// Commented out validation schema as requested
const validationSchema = Yup.object().shape({
  // Updated field names based on flatfields
  category: Yup.string().required("Category is required"),
  htNo: Yup.string().matches(/^\d+$/, "HT No must be numeric"),
  aadhar: Yup.string()
    .required("Aadhaar Card No is required")
    .matches(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  admissionType: Yup.string().required("Admission Type is required"), // Changed from appType
  surname: Yup.string().required("Surname is required"),
  firstName: Yup.string().required("First Name is required"), // Changed from studentName
  fatherName: Yup.string().required("Father Name is required"),
  fatherPhoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  motherPhoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  dob: Yup.date()
    .required("Date of Birth is required")
    .nullable()
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("age-range", "Student must be between 5 and 18 years old", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return adjustedAge >= 5 && adjustedAge <= 18;
    }),
  gender: Yup.string().required("Gender is required"),
  joinedCampus: Yup.string().required("Joined Campus is required"),
  joiningClassName: Yup.string().required("Joining Class is required"), // Changed from joinInto
  orientationName: Yup.string().required("Orientation is required"), // Changed from course
  orientationBatch: Yup.string().required("Course Batch is required"), // Changed from orientationBatch
  orientationDates: Yup.date()
    .required("Course Dates is required")
    .nullable(), // Changed from orientationDates
  schoolState: Yup.string().required("School State is required"),
  schoolDistrict: Yup.string().required("School District is required"),
  schoolType: Yup.string().required("School Type is required"),
  marks: Yup.string().required("Marks is required"),
  appFee: Yup.string().matches(/^\d*$/, "Application Fee must be numeric").notRequired(), // Changed label to match flatfields
  fee: Yup.string().matches(/^\d*$/, "Fee must be numeric").notRequired(),
  additionalCourseFee: Yup.string().matches(/^\d*$/, "Additional Course Fee must be numeric").notRequired(), // Changed from additionalOrientationFee
  scoreAppNo: Yup.string().matches(/^\d*$/, "Score App No must be numeric").notRequired(),
  admissionReferredBy: Yup.string().notRequired(),
  quota: Yup.string().notRequired(),
  photo: Yup.mixed()
    .notRequired()
    .test("fileType", "Only image files are allowed (jpg, jpeg, png)", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
    })
    .test("fileSize", "File size must be less than 2MB", (value) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024;
    }),
  profilePhoto: Yup.mixed()
    .notRequired()
    .test("fileType", "Only image files are allowed (jpg, jpeg, png)", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
    })
    .test("fileSize", "Max image size is 300kb", (value) => {
      if (!value) return true;
      return value.size <= 300 * 1024;
    }),
  annexure: Yup.array()
    .of(
      Yup.mixed()
        .test("fileType", "Only PDF, Excel, and Word files are allowed", (value) => {
          if (!value) return true;
          return [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ].includes(value.type);
        })
        .test("fileSize", "Each file size must be less than 5MB", (value) => {
          if (!value) return true;
          return value.size <= 5 * 1024 * 1024;
        })
    )
    .notRequired(),
  foodprefrence: Yup.string().notRequired(),
  schoolName: Yup.string().notRequired(),
});

const GeneralInfoSection = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  setFieldTouched,
  activeStep,
  setActiveStep,
  steps,
  handleNext,
  handleBack,
  validateForm,
}) => {
  const { setErrors, setTouched: setFormikTouched } = useFormikContext();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to format date values for display
  const formatDateForDisplay = (dateValue, fieldName) => {
    if (!dateValue) return "";
    
    console.log(`📍 formatDateForDisplay called with:`, { dateValue, fieldName, type: typeof dateValue });
    
    // If it's already in yyyy-mm-dd format, return as is
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      console.log(`📍 Date already in yyyy-mm-dd format:`, dateValue);
      return dateValue;
    }
    
    // If it's a date object or ISO string, convert to yyyy-mm-dd
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const formatted = date.toISOString().split('T')[0];
      console.log(`📍 Converted date to yyyy-mm-dd:`, formatted);
      return formatted;
    }
    
    console.log(`📍 Could not format date, returning original:`, dateValue);
    return dateValue;
  };
  const [dropdownOptions, setDropdownOptions] = useState({
    appTypes: [],
    studentTypes: [],
    genders: [],
    campuses: [],
    cities: [],
    courses: [],
    courseBatches: [],
    districts: [],
    schoolTypes: [],
    quotas: [],
    relationTypes: [],
    classes: [],
    sections: [],
    foodPreferences: ["Veg", "Non Veg", "Other"],
    // New dropdown options
    religions: [],
    castes: [],
    bloodGroups: [],
    schoolStates: [],
    schoolDistricts: [],
    allStudentClasses: [],
    orientations: [],
    orientationBatches: [],
    // New cascading dropdown options
    joiningClasses: [], // Classes based on campus
    batchTypes: [], // Batch types based on campus and class
    orientationNames: [], // Orientation names based on campus, class, and batch type
    orientationBatchesCascading: [], // Orientation batches based on all previous fields
  });
  const [loadingStates, setLoadingStates] = useState({
    appTypes: true,
    studentTypes: true,
    genders: true,
    campuses: true,
    cities: true,
    courses: true,
    courseBatches: true,
    schoolTypes: true,
    quotas: true,
    relationTypes: true,
    classes: true,
    sections: true,
    // New loading states
    religions: true,
    castes: true,
    bloodGroups: true,
    schoolStates: true,
    schoolDistricts: false,
    allStudentClasses: true,
    orientations: false,
    orientationBatches: false,
    // New cascading dropdown loading states
    joiningClasses: false,
    batchTypes: false,
    orientationNames: false,
    orientationBatchesCascading: false,
  });
  const [persistentErrors, setPersistentErrors] = useState({});
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      console.log("🔄 Starting to fetch dropdown options from API...");
      
      // Set parent name IDs
      setFieldValue("fatherNameId", "1");
      setFieldValue("motherNameId", "2");
      
      // Define all API calls with their corresponding keys
      const apiCalls = [
        { key: 'appTypes', call: () => apiService.fetchAdmissionTypes() },
        { key: 'studentTypes', call: () => apiService.fetchStudentTypes() },
        { key: 'genders', call: () => apiService.fetchGenders() },
        { key: 'campuses', call: () => apiService.fetchCampuses() },
        { key: 'cities', call: () => apiService.getCities() },
        { key: 'courses', call: () => apiService.fetchCourses() },
     
        { key: 'quotas', call: () => apiService.fetchQuotas() },
        { key: 'relationTypes', call: () => apiService.fetchRelationTypes() },
        { key: 'classes', call: () => apiService.fetchClasses() },
        { key: 'sections', call: () => apiService.getSections() },
        // New API calls
        { key: 'religions', call: () => apiService.fetchReligions() },
        { key: 'castes', call: () => apiService.fetchCastes() },
        { key: 'bloodGroups', call: () => apiService.fetchBloodGroups() },
        { key: 'schoolStates', call: () => {
          console.log("🔄 Calling fetchSchoolStates API...");
          return apiService.fetchSchoolStates();
        }},
        { key: 'schoolTypes', call: () => {
          console.log("🔄 Calling fetchSchoolTypes API...");
          return apiService.fetchSchoolTypes();
        }},
        { key: 'allStudentClasses', call: () => apiService.fetchAllStudentClasses() },
      ];

      // Process each API call individually
      apiCalls.forEach(async ({ key, call }) => {
        try {
          const data = await call();
          console.log(`🔍 Raw data for ${key}:`, data);
          
          // Handle different data structures
          let processedData = data;
          if (!Array.isArray(data)) {
            if (data && typeof data === 'object') {
              processedData = [data];
            } else {
              processedData = [];
            }
          }
          
          const mappedData = processedData.map((item) => {
            // Handle different field names for different APIs
            let id = item?.id || item?.stateId || item?.classId || item?.orientationId || item?.batchId;
            let label = item?.name || item?.stateName || item?.className || item?.orientationName || item?.batchName || item?.label;
            
            return {
              id: id?.toString() || "",
              label: label || String(item),
            };
          });
          
          console.log(`🔍 Mapped data for ${key}:`, mappedData);

          // Special handling for cities
          const finalData = key === 'cities' && mappedData.length === 0 
            ? [{ id: "", label: "No cities available" }] 
            : mappedData;

          setDropdownOptions(prev => ({
            ...prev,
            [key]: finalData,
          }));

          setLoadingStates(prev => ({
            ...prev,
            [key]: false,
          }));

          console.log(`✅ Loaded ${key}:`, finalData);
        } catch (error) {
          console.error(`❌ Error fetching ${key}:`, error);
          setDropdownOptions(prev => ({
            ...prev,
            [key]: [],
          }));
          setLoadingStates(prev => ({
            ...prev,
            [key]: false,
          }));
        }
      });
    };
    
    fetchDropdownOptions();
  }, [setFieldValue]);

  // Debug useEffect to monitor dropdown options changes
  useEffect(() => {
    console.log("🔍 Current dropdown options:", {
      classes: dropdownOptions.classes,
      orientations: dropdownOptions.orientations,
      orientationBatches: dropdownOptions.orientationBatches,
      schoolStates: dropdownOptions.schoolStates,
      schoolDistricts: dropdownOptions.schoolDistricts
    });
    console.log("🔍 Loading states:", {
      schoolStates: loadingStates.schoolStates,
      schoolDistricts: loadingStates.schoolDistricts
    });
  }, [dropdownOptions, loadingStates]);

  const flatfields = [
    { label: "First Name", name: "firstName", placeholder: "Enter First Name", required: true },
    { label: "Surname", name: "surname", placeholder: "Enter Last Name", required: true },
    { label: "Profile Photo", name: "profilePhoto", type: "file", accept: "image/jpeg,image/jpg,image/png" },
    { label: "Father Name ID", name: "fatherNameId", type: "hidden" },
    { label: "Mother Name ID", name: "motherNameId", type: "hidden" },
    { label: "Category", name: "category", type: "radio", options: ["SSC", "Other"], required: true },
    { label: "HT No", name: "htNo", placeholder: "Enter Hall Ticket No" },
    { label: "Aadhar Card No", name: "aadhar", placeholder: "Enter Aaadhar Number", required: true },
    { label: "Aapar Number", name: "aapar", placeholder: "Enter Apaar Number" },
    { label: "Religion", name: "religion", type: "select", options: dropdownOptions.religions },
    { label: "Caste", name: "caste", type: "select", options: dropdownOptions.castes },
    { label: "Blood Group", name: "bloodGroup", type: "select", options: dropdownOptions.bloodGroups },
    { label: "Admission Type", name: "admissionType", type: "select", options: dropdownOptions.appTypes, required: true },
    { label: "Application Fee", name: "applicationFee", placeholder: "Enter Application Fee amount" },
    // { label: "Application Sale Date", name: "applicationSaleDate", type: "date" },
    { label: "Father Information", name: "fatherInformation", type: "custom" },
    { label: "Father Name", name: "fatherName", placeholder: "Enter Father Name", required: true },
    { label: "Occupation", name: "fatherOccupation", placeholder: "Enter Occupation" },
    { label: "Phone Number", name: "fatherPhoneNumber", placeholder: "Enter Phone Number", required: true },
    { label: "Email Id", name: "fatherEmail", placeholder: "Enter Father Mail id" },
    { label: "Mother Information", name: "motherInformation", type: "custom" },
    { label: "Mother Name", name: "motherName", placeholder: "Enter Mother Name", required: true },
    { label: "Occupation", name: "motherOccupation", placeholder: "Enter Occupation" },
    { label: "Phone Number", name: "motherPhoneNumber", placeholder: "Enter Phone Number", required: true },
    { label: "Email Id", name: "motherEmail", placeholder: "Enter Mother Mail id" },
    { label: "Orientation Information", name: "orientationInformation", type: "custom" },
    { label: "Student Type", name: "studentType", type: "select", options: dropdownOptions.studentTypes },
    { label: "Date of Birth", name: "dob", type: "date", required: true },
    { label: "Gender", name: "gender", type: "radio", options: dropdownOptions.genders, required: true },
    { label: "Joined Campus/Branch", name: "joinedCampus", type: "select", options: dropdownOptions.campuses, required: true },
    { label: "Joining Class", name: "joiningClassName", type: "select", options: dropdownOptions.joiningClasses, required: true },

    {label:"Batch Type", name: "batchType", type: "select", options: dropdownOptions.batchTypes, required: true },
    { label: "Orientation Name", name: "orientationName", type: "select", options: dropdownOptions.orientationNames, required: true },
    { label: "Orientation Batch", name: "orientationBatch", type: "select", options: dropdownOptions.orientationBatchesCascading, required: true },
    { label: "Orientation Dates", name: "orientationDates", type: "date", required: true, readOnly: true, placeholder: "Auto-populated from batch selection" },
    { label: "Orientation Fee", name: "OrientationFee", placeholder: "Auto-populated from batch selection", readOnly: true },
    { label: "School State", name: "schoolState", type: "select", options: dropdownOptions.schoolStates, required: true },
    { label: "School District", name: "schoolDistrict", type: "select", options: dropdownOptions.schoolDistricts, required: true },
    { label: "School Type", name: "schoolType", type: "select", options: dropdownOptions.schoolTypes, required: true },
    { label: "School Name", name: "schoolName", placeholder: "Enter School Name" },
    { label: "Additional Orientation Fee", name: "additionalOrientationFee", placeholder: "Enter Fee Details" },
    { label: "Score App No", name: "scoreAppNo", placeholder: "Enter Score App No" },
    { label: "Marks", name: "marks", placeholder: "Enter Marks Details", required: true },
    { label: "Admission Referred By", name: "admissionReferredBy", placeholder: "Enter Name" },
    { label: "Quota", name: "quota", type: "select", options: dropdownOptions.quotas },
  ];

  const handleSectionChange = (e) => {
    const { name, value, files } = e.target;
    let finalValue = value;
    console.log("🔄 Field changed:", { name, value, finalValue });
    console.log("🔄 Is orientationBatch change?", name === "orientationBatch");
    const currentField = flatfields.find((f) => f.name === name) || {
      name,
      type: name.includes("siblingInformation") ? "select" : "text",
      options: name.includes("relationType")
        ? dropdownOptions.relationTypes
        : name.includes("class")
        ? dropdownOptions.classes
        : name.includes("gender")
        ? dropdownOptions.genders
        : [],
    };
    if (currentField.type === "file") {
      if (currentField.multiple && name === "annexure") {
        const existingFiles = Array.isArray(values.annexure) ? values.annexure : [];
        const newFiles = files && files.length > 0 ? Array.from(files) : [];
        finalValue = [...existingFiles, ...newFiles];
      } else {
        finalValue = files && files.length > 0 ? files[0] : null;
        if (name === "profilePhoto" && files && files.length > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePhotoPreview(reader.result);
          };
          reader.readAsDataURL(files[0]);
        } else if (name === "profilePhoto" && !files) {
          setProfilePhotoPreview(null);
        }
      }
    } else if (currentField.type === "select") {
      const options = currentField.options || [];
      const selectedOption = options.find((opt) => opt.label === value);
      finalValue = selectedOption ? selectedOption.id : "";
    } else if (name.includes("gender") && !name.includes("siblingInformation")) {
      const selectedGender = dropdownOptions.genders.find((opt) => opt.label === value);
      finalValue = selectedGender ? selectedGender.id : "";
    } else if (name === "dob" || name === "orientationDates") {
      // Format date fields to yyyy-mm-dd format for HTML date input
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          finalValue = date.toISOString().split('T')[0]; // yyyy-mm-dd format
          console.log(`📍 Date formatted for ${name}:`, finalValue);
        } else {
          finalValue = value; // Keep original value if not a valid date
        }
      } else {
        finalValue = value;
      }
    } else if (["htNo", "appFee", "fee", "additionalCourseFee", "scoreAppNo", "marks", "aadhar", "fatherPhoneNumber", "motherPhoneNumber"].includes(name)) {
      finalValue = value.replace(/\D/g, "");
      if (name === "aadhar" && finalValue.length > 12) {
        finalValue = finalValue.slice(0, 12);
      } else if (["fatherPhoneNumber", "motherPhoneNumber"].includes(name) && finalValue.length > 10) {
        finalValue = finalValue.slice(0, 10);
      }
    } else if (
      [
        "studentName",
        "schoolName",
        "surname",
        "fatherName",
        "motherName",
        "fatherOccupation",
        "motherOccupation",
        "admissionReferredBy",
        "siblingInformation.fullName",
        "siblingInformation.schoolName",
      ].some((field) => name.includes(field))
    ) {
      finalValue = value.replace(/[^a-zA-Z\s.-]/g, "");
    }
    console.log(`📍 ${name} changed to:`, finalValue);
    setFieldValue(name, finalValue);
    setFieldTouched(name, true);
    
    // Clear persistent error for this field if it has a valid value
    if (finalValue && finalValue.toString().trim() !== "") {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Also clear persistent errors for nested sibling fields
    if (name.includes('siblingInformation') && finalValue && finalValue.toString().trim() !== "") {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (name === "schoolState") {
      const stateId = finalValue;
      console.log("🎯 School State changed:", { name, stateId, finalValue });
      console.log("🎯 Current school states options:", dropdownOptions.schoolStates);
      console.log("🎯 Selected state option:", dropdownOptions.schoolStates.find(opt => opt.id === stateId));
      
      if (stateId) {
        console.log("🔄 Fetching school districts for state:", stateId);
        console.log("🔄 API URL will be:", `http://localhost:8080/distribution/gets/districts/${stateId}`);
        apiService.fetchSchoolDistricts(stateId).then((districts) => {
          console.log("📍 Raw school districts response:", districts);
          
          // Handle different data structures
          let processedDistricts = districts;
          if (!Array.isArray(districts)) {
            if (districts && typeof districts === 'object') {
              processedDistricts = [districts];
            } else {
              processedDistricts = [];
            }
          }
          
          const mappedDistricts = processedDistricts.map((item) => ({
            id: (item?.id || item?.districtId)?.toString() || "",
            label: item?.name || item?.districtName || item?.label || String(item)
          }));
          
          console.log("📍 Mapped school districts:", mappedDistricts);
          setDropdownOptions((prev) => {
            const newOptions = {
              ...prev,
              schoolDistricts: mappedDistricts,
            };
          console.log("📍 Updated dropdown options schoolDistricts:", newOptions.schoolDistricts);
          console.log("📍 Number of districts loaded:", newOptions.schoolDistricts.length);
          return newOptions;
        });
        setFieldValue("schoolDistrict", "");
        setFieldTouched("schoolDistrict", true);
        console.log("✅ School districts loaded and form updated");
        }).catch((err) => {
          console.error("❌ Failed to fetch school districts:", err);
          setDropdownOptions((prev) => ({ ...prev, schoolDistricts: [] }));
          setFieldValue("schoolDistrict", "");
          setFieldTouched("schoolDistrict", true);
        });
      } else {
        console.log("🧹 Clearing school districts as no state selected");
        setDropdownOptions((prev) => ({ ...prev, schoolDistricts: [] }));
        setFieldValue("schoolDistrict", "");
        setFieldTouched("schoolDistrict", true);
      }
    }
    
    // Handle campus change for joining classes (Step 1: Campus → Joining Class)
    if (name === "joinedCampus") {
      const campusId = finalValue;
      console.log("🎯 Campus changed:", { name, campusId, finalValue });
      
      if (campusId) {
        // Set loading state
        setLoadingStates(prev => ({ ...prev, joiningClasses: true }));
        
        console.log("🔄 Fetching joining classes for campus:", campusId);
        apiService.fetchClassesByCampus(campusId).then((classes) => {
          console.log("📍 Raw joining classes response:", classes);
          
          // Handle different data structures
          let processedClasses = classes;
          if (!Array.isArray(classes)) {
            if (classes && typeof classes === 'object') {
              processedClasses = [classes];
            } else {
              processedClasses = [];
            }
          }
          
          const mappedClasses = processedClasses.map((item) => ({
            id: (item?.id || item?.classId)?.toString() || "",
            label: item?.name || item?.className || item?.label || String(item)
          }));
          
          console.log("📍 Mapped joining classes:", mappedClasses);
          setDropdownOptions((prev) => ({
            ...prev,
            joiningClasses: mappedClasses,
            // Clear dependent dropdowns
            batchTypes: [],
            orientationNames: [],
            orientationBatchesCascading: []
          }));
          
          // Clear dependent fields
          setFieldValue("joiningClassName", "");
          setFieldValue("batchType", "");
          setFieldValue("orientationName", "");
          setFieldValue("orientationBatch", "");
          setFieldValue("orientationDates", "");
          setFieldValue("OrientationFee", "");
          
          setLoadingStates(prev => ({ ...prev, joiningClasses: false }));
        }).catch((err) => {
          console.error("❌ Failed to fetch joining classes:", err);
          setLoadingStates(prev => ({ ...prev, joiningClasses: false }));
        });
      } else {
        console.log("🧹 Clearing joining classes as no campus selected");
        setDropdownOptions((prev) => ({ 
          ...prev, 
          joiningClasses: [],
          batchTypes: [],
          orientationNames: [],
          orientationBatchesCascading: []
        }));
        setFieldValue("joiningClassName", "");
        setFieldValue("batchType", "");
        setFieldValue("orientationName", "");
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
      }
    }
    
    // Handle joining class change for batch types (Step 2: Campus + Class → Batch Type)
    if (name === "joiningClassName") {
      const classId = finalValue;
      const campusId = values.joinedCampus;
      console.log("🎯 Joining class changed:", { name, classId, campusId });
      
      if (campusId && classId) {
        setLoadingStates(prev => ({ ...prev, batchTypes: true }));
        
        console.log("🔄 Fetching batch types for campus and class:", { campusId, classId });
        apiService.fetchBatchTypeByCampusAndClass(campusId, classId).then((batchTypes) => {
          console.log("📍 Raw batch types response:", batchTypes);
          
          let processedBatchTypes = batchTypes;
          if (!Array.isArray(batchTypes)) {
            if (batchTypes && typeof batchTypes === 'object') {
              processedBatchTypes = [batchTypes];
            } else {
              processedBatchTypes = [];
            }
          }
          
          const mappedBatchTypes = processedBatchTypes.map((item) => ({
            id: (item?.id || item?.studyTypeId)?.toString() || "",
            label: item?.name || item?.studyTypeName || item?.label || String(item)
          }));
          
          console.log("📍 Mapped batch types:", mappedBatchTypes);
          setDropdownOptions((prev) => ({
            ...prev,
            batchTypes: mappedBatchTypes,
            // Clear dependent dropdowns
            orientationNames: [],
            orientationBatchesCascading: []
          }));
          
          // Clear dependent fields
          setFieldValue("batchType", "");
          setFieldValue("orientationName", "");
          setFieldValue("orientationBatch", "");
          setFieldValue("orientationDates", "");
          setFieldValue("OrientationFee", "");
          
          setLoadingStates(prev => ({ ...prev, batchTypes: false }));
        }).catch((error) => {
          console.error("❌ Error fetching batch types:", error);
          setLoadingStates(prev => ({ ...prev, batchTypes: false }));
        });
      } else {
        console.log("🧹 Clearing batch types as campus or class not selected");
        setDropdownOptions((prev) => ({ 
          ...prev, 
          batchTypes: [],
          orientationNames: [],
          orientationBatchesCascading: []
        }));
        setFieldValue("batchType", "");
        setFieldValue("orientationName", "");
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
      }
    }
    
    // Handle batch type change for orientation names (Step 3: Campus + Class + Batch Type → Orientation Name)
    if (name === "batchType") {
      const studyTypeId = finalValue;
      const campusId = values.joinedCampus;
      const classId = values.joiningClassName;
      console.log("🎯 Batch type changed:", { name, studyTypeId, campusId, classId });
      
      if (campusId && classId && studyTypeId) {
        setLoadingStates(prev => ({ ...prev, orientationNames: true }));
        
        console.log("🔄 Fetching orientation names for campus, class, and batch type:", { campusId, classId, studyTypeId });
        apiService.fetchOrientationNameByCampusClassAndStudyType(campusId, classId, studyTypeId).then((orientations) => {
          console.log("📍 Raw orientation names response:", orientations);
          
          let processedOrientations = orientations;
          if (!Array.isArray(orientations)) {
            if (orientations && typeof orientations === 'object') {
              processedOrientations = [orientations];
            } else {
              processedOrientations = [];
            }
          }
          
          const mappedOrientations = processedOrientations.map((item) => ({
            id: (item?.id || item?.orientationId)?.toString() || "",
            label: item?.name || item?.orientationName || item?.label || String(item)
          }));
          
          console.log("📍 Mapped orientation names:", mappedOrientations);
          setDropdownOptions((prev) => ({
            ...prev,
            orientationNames: mappedOrientations,
            // Clear dependent dropdowns
            orientationBatchesCascading: []
          }));
          
          // Clear dependent fields
          setFieldValue("orientationName", "");
          setFieldValue("orientationBatch", "");
          setFieldValue("orientationDates", "");
          setFieldValue("OrientationFee", "");
          
          setLoadingStates(prev => ({ ...prev, orientationNames: false }));
        }).catch((error) => {
          console.error("❌ Error fetching orientation names:", error);
          setLoadingStates(prev => ({ ...prev, orientationNames: false }));
        });
      } else {
        console.log("🧹 Clearing orientation names as required fields not selected");
        setDropdownOptions((prev) => ({ 
          ...prev, 
          orientationNames: [],
          orientationBatchesCascading: []
        }));
        setFieldValue("orientationName", "");
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
      }
    }
    
    // Handle orientation name change for orientation batches (Step 4: All fields → Orientation Batch)
    if (name === "orientationName") {
      const orientationId = finalValue;
      const campusId = values.joinedCampus;
      const classId = values.joiningClassName;
      const studyTypeId = values.batchType;
      console.log("🎯 Orientation name changed:", { name, orientationId, campusId, classId, studyTypeId });
      
      if (campusId && classId && studyTypeId && orientationId) {
        setLoadingStates(prev => ({ ...prev, orientationBatchesCascading: true }));
        
        console.log("🔄 Fetching orientation batches for all fields:", { campusId, classId, studyTypeId, orientationId });
        apiService.fetchOrientationBatchByAllFields(campusId, classId, studyTypeId, orientationId).then((batches) => {
          console.log("📍 Raw orientation batches response:", batches);
          
          let processedBatches = batches;
          if (!Array.isArray(batches)) {
            if (batches && typeof batches === 'object') {
              processedBatches = [batches];
            } else {
              processedBatches = [];
            }
          }
          
          const mappedBatches = processedBatches.map((item) => ({
            id: (item?.id || item?.orientationBatchId)?.toString() || "",
            label: item?.name || item?.batchName || item?.label || String(item)
          }));
          
          console.log("📍 Mapped orientation batches:", mappedBatches);
          setDropdownOptions((prev) => ({
            ...prev,
            orientationBatchesCascading: mappedBatches
          }));
          
          // Clear dependent fields
          setFieldValue("orientationBatch", "");
          setFieldValue("orientationDates", "");
          setFieldValue("OrientationFee", "");
          
          setLoadingStates(prev => ({ ...prev, orientationBatchesCascading: false }));
        }).catch((error) => {
          console.error("❌ Error fetching orientation batches:", error);
          setLoadingStates(prev => ({ ...prev, orientationBatchesCascading: false }));
        });
      } else {
        console.log("🧹 Clearing orientation batches as required fields not selected");
        setDropdownOptions((prev) => ({ 
          ...prev, 
          orientationBatchesCascading: []
        }));
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
      }
    }
    
    // Handle orientation batch change for auto-population (Step 5: All fields → Auto-populate)
    if (name === "orientationBatch") {
      const orientationBatchId = finalValue;
      const campusId = values.joinedCampus;
      const classId = values.joiningClassName;
      const studyTypeId = values.batchType;
      const orientationId = values.orientationName;
      console.log("🎯 Orientation batch changed:", { name, orientationBatchId, campusId, classId, studyTypeId, orientationId });
      
      if (campusId && classId && studyTypeId && orientationId && orientationBatchId) {
        console.log("🔄 Fetching orientation details for auto-population:", { campusId, classId, studyTypeId, orientationId, orientationBatchId });
        apiService.fetchOrientationStartDateAndFee(campusId, classId, studyTypeId, orientationId, orientationBatchId).then((details) => {
          console.log("📍 Raw orientation details response:", details);
          console.log("📍 Response type:", typeof details);
          console.log("📍 Response keys:", details ? Object.keys(details) : "No keys");
          
          // Auto-populate orientation start date and fee
          if (details) {
            console.log("📍 Checking for startDate in details:", details.startDate);
            console.log("📍 Checking for orientationStartDate in details:", details.orientationStartDate);
            console.log("📍 Checking for date in details:", details.date);
            
            // Try multiple possible field names for the date
            let dateValue = details.startDate || details.orientationStartDate || details.date || details.orientation_date || details.batchStartDate;
            console.log("📍 Extracted date value:", dateValue);
            
            if (dateValue) {
              // Format the date to yyyy-mm-dd for HTML date input
              const formattedDate = formatDateForDisplay(dateValue, "orientationDates");
              console.log("📍 Formatted date:", formattedDate);
              setFieldValue("orientationDates", formattedDate);
              console.log("✅ Auto-populated orientation start date:", formattedDate);
            } else {
              console.log("❌ No date value found in response");
            }
            
            // Try multiple possible field names for the fee
            let feeValue = details.fee || details.orientationFee || details.orientation_fee || details.batchFee;
            console.log("📍 Extracted fee value:", feeValue);
            
            if (feeValue) {
              setFieldValue("OrientationFee", feeValue);
              console.log("✅ Auto-populated orientation fee:", feeValue);
            } else {
              console.log("❌ No fee value found in response");
            }
          } else {
            console.log("❌ No details received from API");
          }
        }).catch((error) => {
          console.error("❌ Error fetching orientation details:", error);
        });
      }
    }
    
    // Handle other field changes (existing logic)
    if (name === "orientationName" && false) { // Disabled to avoid duplicate
      const orientationId = finalValue;
      const campusId = values.joinedCampus;
      const classId = values.joiningClassName;
      console.log("🎯 Orientation changed:", { name, orientationId, campusId, classId, finalValue });
      if (orientationId && campusId && classId) {
        console.log("🔄 Fetching batches for orientation:", orientationId, "campus:", campusId, "class:", classId);
        setLoadingStates(prev => ({ ...prev, orientationBatches: true }));
        apiService.fetchOrientationBatches(campusId, classId, orientationId).then((batches) => {
          console.log("📍 Raw orientation batches response:", batches);
          
          // Handle different data structures
          let processedBatches = batches;
          if (!Array.isArray(batches)) {
            if (batches && typeof batches === 'object') {
              processedBatches = [batches];
            } else {
              processedBatches = [];
            }
          }
          
          const mappedBatches = processedBatches.map((item) => ({
            id: (item?.id || item?.batchId)?.toString() || "",
            label: item?.name || item?.batchName || item?.label || String(item)
          }));
          
          console.log("📍 Mapped orientation batches:", mappedBatches);
          setDropdownOptions((prev) => {
            const newOptions = {
              ...prev,
              orientationBatches: mappedBatches,
            };
            console.log("📍 Updated dropdown options orientationBatches:", newOptions.orientationBatches);
            return newOptions;
          });
          setLoadingStates(prev => ({ ...prev, orientationBatches: false }));
          setFieldValue("orientationBatch", "");
          setFieldTouched("orientationBatch", true);
        }).catch((err) => {
          console.error("❌ Failed to fetch orientation batches:", err);
          setDropdownOptions((prev) => ({ ...prev, orientationBatches: [] }));
          setLoadingStates(prev => ({ ...prev, orientationBatches: false }));
          setFieldValue("orientationBatch", "");
          setFieldTouched("orientationBatch", true);
        });
      } else {
        console.log("🧹 Clearing batches as missing required parameters:", { orientationId, campusId, classId });
        setDropdownOptions((prev) => ({ ...prev, orientationBatches: [] }));
        setFieldValue("orientationBatch", "");
        setFieldTouched("orientationBatch", true);
      }
    }
    
    // Handle orientation batch change for details
    if (name === "orientationBatch") {
      const orientationId = values.orientationName;
      const batchId = finalValue;
      const campusId = values.joinedCampus;
      const classId = values.joiningClassName;
      console.log("🎯 Orientation Batch changed:", { name, orientationId, batchId, campusId, classId, finalValue });
      console.log("🎯 Current form values:", values);
      
      if (orientationId && batchId && campusId && classId) {
        console.log("🔄 Fetching orientation details for campus:", campusId, "class:", classId, "orientation:", orientationId, "and batch:", batchId);
        console.log("🔄 API URL will be:", `http://localhost:8080/api/student-admissions-sale/${campusId}/${classId}/${orientationId}/${batchId}/details`);
        
        apiService.fetchOrientationDetails(campusId, classId, orientationId, batchId).then((details) => {
          console.log("📍 Raw orientation details response:", details);
          console.log("📍 Response type:", typeof details);
          console.log("📍 Response keys:", details ? Object.keys(details) : "No response");
          console.log("📍 Full response structure:", JSON.stringify(details, null, 2));
          
          // Auto-populate orientation dates and fees
          if (details) {
            console.log("📍 Processing orientation details:", details);
            
            // Try multiple possible field names for date (prioritizing start date fields)
            const possibleDateFields = [
              'startDate', 
              'orientationStartDate', 
              'batchStartDate', 
              'start_date', 
              'orientationStartDate', 
              'batchStartDate',
              'orientationDate', 
              'date', 
              'orientation_date',
              'endDate',
              'orientationEndDate',
              'batchEndDate'
            ];
            let dateValue = null;
            for (const field of possibleDateFields) {
              if (details[field]) {
                dateValue = details[field];
                console.log(`📍 Found date in field '${field}':`, dateValue);
                break;
              }
            }
            
            if (dateValue) {
              console.log("📍 Raw orientation date from API:", dateValue);
              
              // Convert ISO date to yyyy-MM-dd format for HTML date input
              let formattedDate = dateValue;
              if (typeof dateValue === 'string' && dateValue.includes('T')) {
                // Extract just the date part (yyyy-MM-dd) from ISO string
                formattedDate = dateValue.split('T')[0];
                console.log("📍 Converted date format:", formattedDate);
              } else if (dateValue instanceof Date) {
                // Convert Date object to yyyy-MM-dd format
                formattedDate = dateValue.toISOString().split('T')[0];
                console.log("📍 Converted Date object to format:", formattedDate);
              }
              
              console.log("📍 Setting orientation date:", formattedDate);
              setFieldValue("orientationDates", formattedDate);
              console.log("✅ Orientation date set successfully");
            } else {
              console.log("⚠️ No date field found in response. Available fields:", Object.keys(details));
            }
            
            // Try multiple possible field names for fee
            const possibleFeeFields = ['fee', 'orientationFee', 'amount', 'orientationAmount', 'batchFee', 'orientation_fee', 'batch_fee'];
            let feeValue = null;
            for (const field of possibleFeeFields) {
              if (details[field]) {
                feeValue = details[field];
                console.log(`📍 Found fee in field '${field}':`, feeValue);
                break;
              }
            }
            
            if (feeValue) {
              console.log("📍 Setting orientation fee:", feeValue);
              setFieldValue("OrientationFee", feeValue.toString());
              console.log("✅ Orientation fee set successfully");
            } else {
              console.log("⚠️ No fee field found in response. Available fields:", Object.keys(details));
            }
          } else {
            console.log("⚠️ No details found in response");
          }
        }).catch((err) => {
          console.error("❌ Failed to fetch orientation details:", err);
          console.error("❌ Error details:", err.response?.data || err.message);
          console.error("❌ Full error:", err);
        });
      } else {
        console.log("⚠️ Missing required parameters:", { orientationId, batchId, campusId, classId });
        console.log("⚠️ Current values.orientationName:", values.orientationName);
        console.log("⚠️ Current values.joinedCampus:", values.joinedCampus);
        console.log("⚠️ Current values.joiningClassName:", values.joiningClassName);
        console.log("⚠️ Current finalValue (batchId):", finalValue);
      }
    }
    if (["appFee", "fee", "additionalCourseFee"].includes(name)) {
      const fees = {
        appFee: name === "appFee" ? Number(finalValue) : Number(values.appFee || 0),
        fee: name === "fee" ? Number(finalValue) : Number(values.fee || 0),
        additionalCourseFee: name === "additionalCourseFee" ? Number(finalValue) : Number(values.additionalCourseFee || 0),
      };
      const total = fees.appFee + fees.fee + fees.additionalCourseFee;
      setFieldValue("totalFee", total.toString());
      setFieldTouched("totalFee", true);
    }
  };

  const handleProceed = async () => {
    const errors = await validateForm();
    console.log("Validation errors:", JSON.stringify(errors, null, 2)); // Log detailed errors for debugging
    
    // Log complete form data object
    console.log("🚀 ===== FINAL SUBMITTING OBJECT =====");
    console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
    console.log("📊 Form Data Summary:", {
      totalFields: Object.keys(values).length,
      filledFields: Object.keys(values).filter(key => values[key] !== "" && values[key] != null).length,
      emptyFields: Object.keys(values).filter(key => values[key] === "" || values[key] == null).length,
      formValues: values
    });
    console.log("🔍 Field-by-Field Data:");
    Object.entries(values).forEach(([key, value]) => {
      console.log(`  ${key}:`, value);
    });
    console.log("🚀 ===== END SUBMITTING OBJECT =====");
    
    if (Object.keys(errors).length === 0) {
      console.log("Validation passed, moving to next step");
      // Clear persistent errors when validation passes
      setPersistentErrors({});
      try {
        if (!values.proId) {
          setFieldValue("proId", 4095);
        }
      } catch (e) {
        console.error("Failed to set default proId", e);
      }
      handleNext();
    } else {
      console.log("Validation failed, marking fields as touched");
      setErrors(errors);
      setFormikTouched(errors);
      // Set persistent errors for fields that have validation errors
      setPersistentErrors(errors);
      alert("Please correct the following errors:\n" + Object.entries(errors)
        .map(([field, error]) => `${field}: ${error}`)
        .join("\n"));
    }
  };

  // Form is now always rendered, dropdowns load in background

  // Helper function to determine if a field should show an error
  const shouldShowError = (fieldName) => {
    // Handle nested field names like siblingInformation.0.fullName
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      if (parts[0] === 'siblingInformation') {
        const index = parseInt(parts[1]);
        const field = parts[2];
        const touchedValue = touched.siblingInformation?.[index]?.[field];
        const errorValue = errors.siblingInformation?.[index]?.[field];
        const persistentError = persistentErrors[fieldName];
        return (touchedValue && errorValue) || persistentError;
      }
    }
    // Show error if field is touched and has error, OR if it has a persistent error
    return (touched[fieldName] && errors[fieldName]) || persistentErrors[fieldName];
  };

  const getFieldError = (fieldName) => {
    // Handle nested field names like siblingInformation.0.fullName
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      if (parts[0] === 'siblingInformation') {
        const index = parseInt(parts[1]);
        const field = parts[2];
        return errors.siblingInformation?.[index]?.[field] || persistentErrors[fieldName];
      }
    }
    return errors[fieldName] || persistentErrors[fieldName];
  };

  const handleRemoveAnnexure = (removeIndex) => {
    const existingFiles = Array.isArray(values.annexure) ? [...values.annexure] : [];
    const nextFiles = existingFiles.filter((_, i) => i !== removeIndex);
    setFieldValue("annexure", nextFiles);
  };

  const categoryField = flatfields.find((field) => field.name === "category");
  const fatherInfoField = flatfields.find((field) => field.name === "fatherInformation");
  const motherInfoField = flatfields.find((field) => field.name === "motherInformation");
  const orientationInfoField = flatfields.find((field) => field.name === "orientationInformation");
  const fatherFields = flatfields.filter((field) =>
    ["fatherName", "fatherOccupation", "fatherPhoneNumber", "fatherEmail"].includes(field.name)
  );
  const motherFields = flatfields.filter((field) =>
    ["motherName", "motherOccupation", "motherPhoneNumber", "motherEmail"].includes(field.name)
  );
  const orientationFields = flatfields.filter((field) =>
    [
      "studentType",
      "dob",
      "gender",
      "joinedCampus",
      "joiningClassName",
      "batchType",
      "orientationName",
      "orientationBatch",
      "orientationDates",
      "OrientationFee",
      "schoolState",
      "schoolDistrict",
      "schoolType",
      "schoolName",
      "additionalOrientationFee",
      "scoreAppNo",
      "marks",
      "admissionReferredBy",
      "quota",
    ].includes(field.name)
  );
  const nonCategoryFields = flatfields.filter(
    (field) =>
      field.name !== "category" &&
      field.name !== "siblingInformation" &&
      field.name !== "fatherInformation" &&
      field.name !== "motherInformation" &&
      field.name !== "orientationInformation" &&
      !["fatherName", "fatherOccupation", "fatherPhoneNumber", "fatherEmail", "motherName", "motherOccupation", "motherPhoneNumber", "motherEmail"].includes(field.name)
  );
  const beforeAppSaleFields = nonCategoryFields.filter((field) =>
    ["htNo", "aadhar", "aapar", "religion", "caste","bloodGroup" ,"admissionType", "applicationFee", "applicationSaleDate"].includes(field.name)
  );

  const renderFieldRows = (fields) => {
    const jsxRows = [];
    for (let i = 0; i < fields.length; i += 3) {
      const row = fields.slice(i, i + 3);
      jsxRows.push(
        <div key={i} className={styles.General_Info_Section_general_form_row}>
          {row.map((field, index) => {
            const options = field.options || [];
            if (field.type === "select") {
              // Determine which dropdown is loading based on field name
              const getLoadingState = (fieldName) => {
                const fieldToLoadingMap = {
                  'admissionType': 'appTypes',
                  'studentType': 'studentTypes',
                  'gender': 'genders',
                  'joinedCampus': 'campuses',
                  'joiningClassName': 'joiningClasses',
                  'batchType': 'batchTypes',
                  'orientationName': 'orientationNames',
                  'orientationBatch': 'orientationBatchesCascading',
                  'schoolState': 'schoolStates',
                  'schoolDistrict': 'schoolDistricts',
                  'schoolType': 'schoolTypes',
                  'quota': 'quotas',
                  'relationType': 'relationTypes',
                  'class': 'classes',
                  'section': 'sections',
                  'religion': 'religions',
                  'caste': 'castes',
                  'bloodGroup': 'bloodGroups',
                };
                return loadingStates[fieldToLoadingMap[fieldName]] || false;
              };

              const isDropdownLoading = getLoadingState(field.name);
              
              // Debug logging for dropdown rendering
              if (field.name === "joiningClassName" || field.name === "orientationName" || field.name === "orientationBatch" || field.name === "schoolState" || field.name === "schoolDistrict") {
                console.log(`🔍 Rendering dropdown for ${field.name}:`, {
                  options: options,
                  mappedOptions: options.map((opt) => opt.label || opt),
                  currentValue: values[field.name],
                  selectedOption: options.find((opt) => opt.id === values[field.name]),
                  isLoading: isDropdownLoading,
                  resultsLength: options.length,
                  disabled: isDropdownLoading,
                  fieldName: field.name,
                  fieldLabel: field.label
                });
                
                // Special debugging for school district dropdown
                if (field.name === "schoolDistrict") {
                  console.log("🔍 School District Dropdown Details:", {
                    hasOptions: options.length > 0,
                    optionsData: options,
                    isDisabled: isDropdownLoading,
                    currentValue: values[field.name],
                    loadingState: loadingStates.schoolDistricts,
                    fieldName: field.name,
                    fieldType: field.type,
                    fieldRequired: field.required
                  });
                  
                  // Check if dropdown should be disabled
                  if (isDropdownLoading) {
                    console.log("⚠️ School District dropdown is DISABLED due to loading state");
                  } else if (options.length === 0) {
                    console.log("⚠️ School District dropdown has NO OPTIONS");
                  } else {
                    console.log("✅ School District dropdown should be ENABLED and clickable");
                  }
                }
              }
              
              return (
                <div key={index} className={styles.General_Info_Section_general_form_field}>
                  <Dropdown
                    dropdownname={field.label}
                    name={field.name}
                    results={Array.isArray(options) ? options.map((opt) => opt.label || opt) : []}
                    value={Array.isArray(options) ? (options.find((opt) => opt.id === values[field.name])?.label || "") : ""}
                    onChange={handleSectionChange}
                    error={shouldShowError(field.name)}
                    required={field.required}
                    disabled={isDropdownLoading}
                    loading={isDropdownLoading}
                  />
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                </div>
              );
            } else if (field.type === "radio" && field.name === "category") {
              return (
                <div key={index} className={styles.General_Info_Section_general_category_container}>
                  <div className={styles.General_Info_Section_general_field_label_wrapper}>
                    <span className={styles.General_Info_Section_general_field_label}>
                      {field.label}
                      {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
                    </span>
                    <div className={styles.General_Info_Section_general_line}></div>
                  </div>
                  <div className={styles.General_Info_Section_general_category_options}>
                    {options.map((option, i) => (
                      <label key={i} className={styles.General_Info_Section_general_category_label_wrapper}>
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          checked={values[field.name] === option}
                          onChange={() => {
                            setFieldValue(field.name, option);
                            setFieldTouched(field.name, true);
                          }}
                          className={styles.General_Info_Section_general_category_radio}
                        />
                        <span className={`${styles.General_Info_Section_general_category_label} ${values[field.name] === option ? styles.General_Info_Section_general_category_active : ""}`} onClick={() => {
                          setFieldValue(field.name, option);
                          setFieldTouched(field.name, true);
                        }}>
                          <span className={styles.General_Info_Section_general_category_text_with_icon}>
                            {option === "SSC" && <figure className={styles.General_Info_Section_general_category_icon}><img src={CashIcon} alt="cash-icon" style={{ width: "18px", height: "18px" }} /></figure>}
                            {option === "Other" && <figure className={styles.General_Info_Section_general_category_icon}><img src={DDIcon} alt="dd-icon" style={{ width: "18px", height: "18px" }} /></figure>}
                            {option}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                </div>
              );
            } else if (field.type === "radio" && field.name === "gender") {
              return (
                <div key={index} className={styles.General_Info_Section_general_gender_container}>
                  <div className={styles.General_Info_Section_general_field_label_wrapper}>
                    <span className={styles.General_Info_Section_general_field_label}>
                      {field.label}
                      {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
                    </span>
                    {/* <div className={styles.General_Info_Section_general_line}></div> */}
                  </div>
                  <div className={styles.General_Info_Section_general_gender_options}>
                    {options.map((option, i) => (
                      <label key={i} className={styles.General_Info_Section_general_gender_label_wrapper}>
                        <input
                          type="radio"
                          name={field.name}
                          value={option.label}
                          checked={values[field.name] === option.id}
                          onChange={() => {
                            setFieldValue(field.name, option.id);
                            setFieldTouched(field.name, true);
                          }}
                          className={styles.General_Info_Section_general_gender_radio}
                        />
                        <span
                          className={`${styles.General_Info_Section_general_gender_label} ${
                            values[field.name] === option.id ? styles.General_Info_Section_general_gender_active : ""
                          }`}
                          onClick={() => {
                            setFieldValue(field.name, option.id);
                            setFieldTouched(field.name, true);
                          }}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                </div>
              );
            } else if (field.type === "hidden") {
              return (
                <input
                  key={index}
                  type="hidden"
                  name={field.name}
                  value={values[field.name] || ""}
                />
              );
            } else if (field.type !== "custom") {
              return (
                <div key={index} className={styles.General_Info_Section_general_form_field}>
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={field.type === "file" ? undefined : (field.type === "date" ? formatDateForDisplay(values[field.name], field.name) : values[field.name] || "")}
                    onChange={field.readOnly ? undefined : handleSectionChange}
                    type={field.type || "text"}
                    error={shouldShowError(field.name)}
                    required={field.required}
                    disabled={field.disabled || field.readOnly || false}
                    accept={field.accept}
                    multiple={field.multiple || false}
                    readOnly={field.readOnly || false}
                  />
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                  {field.name === "annexure" && Array.isArray(values.annexure) && values.annexure.length > 0 && (
                    <div className={styles.fileList}>
                      <ul>
                        {values.annexure.map((file, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                            <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                            <MuiButton
                              type="button"
                              style={{ marginLeft: "10px", color: "red" }}
                              onClick={() => handleRemoveAnnexure(i)}
                            >
                              Remove
                            </MuiButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }, (_, padIndex) => (
              <div key={`pad-${i}-${padIndex}`} className={styles.General_Info_Section_general_empty_field}></div>
            ))}
        </div>
      );
    }
    return jsxRows;
  };

  return (
    <div className={styles.General_Info_Section_general_form_section}>
      <div className={styles.General_Info_Section_general_section_box}>
        <div className={styles.custom_flex_container}>
          <div className={styles.custom_left_group}>
            <div className={styles.custom_up_section}>
              <div className={styles.General_Info_Section_general_form_row}>
                <div className={styles.General_Info_Section_general_form_field}>
                  <Inputbox
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter Name"
                    value={values.firstName || ""}
                    onChange={handleSectionChange}
                    type="text"
                    error={shouldShowError("firstName")}
                    required
                  />
                  {shouldShowError("firstName") && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError("firstName")}
                    </div>
                  )}
                </div>
                <div className={styles.General_Info_Section_general_form_field}>
                  <Inputbox
                    label="Surname"
                    id="surname"
                    name="surname"
                    placeholder="Enter Name"
                    value={values.surname || ""}
                    onChange={handleSectionChange}
                    type="text"
                    error={shouldShowError("surname")}
                    required
                  />
                  {shouldShowError("surname") && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError("surname")}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.custom_down_section}>
              <div className={styles.General_Info_Section_general_form_row}>
                <div className={styles.General_Info_Section_general_form_field}>
                  {renderFieldRows([categoryField])}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.custom_right_group}>
            <div className={styles.General_Info_Section_general_form_field}>
              <div className={styles.profilePhotoUpload}>
                <label htmlFor="profilePhoto-input" className={styles.profilePhotoLabel}>
                  <div className={styles.uploadCircle}>
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Profile Preview" className={styles.previewImage} />
                    ) : (
                      <>
                        <figure className={styles.uploadIconFigure}>
                          <UploadIcon className={styles.uploadSvg} />
                        </figure>
                        <span className={styles.uploadText}>Upload image of student</span>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="profilePhoto-input"
                  name="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleSectionChange}
                  style={{ display: 'none' }}
                  required
                />
                {shouldShowError("profilePhoto") && (
                  <div className={styles.General_Info_Section_general_error}>
                    {getFieldError("profilePhoto")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.General_Info_Section_general_form_grid}>
          <>
            {renderFieldRows(beforeAppSaleFields)}
            {fatherInfoField && (
                  <div className={styles.General_Info_Section_general_form_row}>
                    <div className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}>
                      <div className={styles.General_Info_Section_general_field_label_wrapper}>
                        <span className={styles.General_Info_Section_general_field_label}>Father Information</span>
                        <div className={styles.General_Info_Section_general_line}></div>
                      </div>
                      <div className={styles.General_Info_Section_general_form_grid}>
                        {fatherFields.map((field, index) => (
                          <div key={index} className={styles.General_Info_Section_general_form_field}>
                            {field.name === "fatherPhoneNumber" ? (
                              <div className={styles.inputWithIconWrapper}>
                                <Inputbox
                                  label={field.label}
                                  id={field.name}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  value={values[field.name] || ""}
                                  onChange={handleSectionChange}
                                  type={field.type || "text"}
                                  error={shouldShowError(field.name)}
                                  required={field.required}
                                />
                                <PhoneIcon className={styles.inputWithIcon} />
                              </div>
                            ) : field.name === "fatherEmail" ? (
                              <div className={styles.inputWithIconWrapper}>
                                <Inputbox
                                  label={field.label}
                                  id={field.name}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  value={values[field.name] || ""}
                                  onChange={handleSectionChange}
                                  type={field.type || "text"}
                                  error={shouldShowError(field.name)}
                                  required={field.required}
                                />
                                <EmailIcon className={styles.inputWithIcon} />
                              </div>
                            ) : (
                              <Inputbox
                                label={field.label}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={values[field.name] || ""}
                                onChange={handleSectionChange}
                                type={field.type || "text"}
                                error={shouldShowError(field.name)}
                                required={field.required}
                              />
                            )}
                            {shouldShowError(field.name) && (
                              <div className={styles.General_Info_Section_general_error}>
                                {getFieldError(field.name)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            {motherInfoField && (
                  <div className={styles.General_Info_Section_general_form_row}>
                    <div className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}>
                      <div className={styles.General_Info_Section_general_field_label_wrapper}>
                        <span className={styles.General_Info_Section_general_field_label}>Mother Information</span>
                        <div className={styles.General_Info_Section_general_line}></div>
                      </div>
                      <div className={styles.General_Info_Section_general_form_grid}>
                        {motherFields.map((field, index) => (
                          <div key={index} className={styles.General_Info_Section_general_form_field}>
                            {field.name === "motherPhoneNumber" ? (
                              <div className={styles.inputWithIconWrapper}>
                                <Inputbox
                                  label={field.label}
                                  id={field.name}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  value={values[field.name] || ""}
                                  onChange={handleSectionChange}
                                  type={field.type || "text"}
                                  error={shouldShowError(field.name)}
                                  required={field.required}
                                />
                                <PhoneIcon className={styles.inputWithIcon} />
                              </div>
                            ) : field.name === "motherEmail" ? (
                              <div className={styles.inputWithIconWrapper}>
                                <Inputbox
                                  label={field.label}
                                  id={field.name}
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  value={values[field.name] || ""}
                                  onChange={handleSectionChange}
                                  type={field.type || "text"}
                                  error={shouldShowError(field.name)}
                                  required={field.required}
                                />
                                <EmailIcon className={styles.inputWithIcon} />
                              </div>
                            ) : (
                              <Inputbox
                                label={field.label}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={values[field.name] || ""}
                                onChange={handleSectionChange}
                                type={field.type || "text"}
                                error={shouldShowError(field.name)}
                                required={field.required}
                              />
                            )}
                            {shouldShowError(field.name) && (
                              <div className={styles.General_Info_Section_general_error}>
                                {getFieldError(field.name)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            {orientationInfoField && (
                  <div className={styles.General_Info_Section_general_form_row}>
                    <div className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}>
                      <div className={styles.General_Info_Section_general_field_label_wrapper}>
                        <span className={styles.General_Info_Section_general_field_label}>Orientation Information</span>
                        <div className={styles.General_Info_Section_general_line}></div>
                      </div>
                      <div className={styles.General_Info_Section_general_form_grid}>
                        {renderFieldRows(orientationFields)}
                      </div>
                    </div>
                  </div>
            )}
            <SiblingInfoSection
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              dropdownOptions={dropdownOptions}
              loadingStates={loadingStates}
            />
          </>
        </div>
        <div className={styles.General_Info_Section_general_form_actions} style={{ justifyContent: "center", marginTop: "20px", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <Button
            type="button"
            variant="primary"
            onClick={handleProceed}
            buttonname="Proceed to Add Concession"
            righticon={<TrendingUpIcon />}
          />
          <a
            href="#"
            className={styles.linkButton}
            onClick={async (e) => {
              e.preventDefault();
              const errors = await validateForm();
              
              // Log complete form data object for skip to payments
              console.log("🚀 ===== SKIP TO PAYMENTS - FINAL SUBMITTING OBJECT =====");
              console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
              console.log("📊 Form Data Summary:", {
                totalFields: Object.keys(values).length,
                filledFields: Object.keys(values).filter(key => values[key] !== "" && values[key] != null).length,
                emptyFields: Object.keys(values).filter(key => values[key] === "" || values[key] == null).length,
                formValues: values
              });
              console.log("🔍 Field-by-Field Data:");
              Object.entries(values).forEach(([key, value]) => {
                console.log(`  ${key}:`, value);
              });
              console.log("🚀 ===== END SKIP TO PAYMENTS OBJECT =====");
              
              if (Object.keys(errors).length === 0) {
                setActiveStep && setActiveStep(3);
              } else {
                setErrors(errors);
                setFormikTouched(errors);
                alert(
                  "Please correct the following errors before proceeding to payments:\n" +
                    Object.entries(errors)
                      .map(([field, error]) => `${field}: ${error}`)
                      .join("\n")
                );
              }
            }}
          >
            <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
            </figure>
            Skip all and proceed to payments
          </a>
        </div>
      </div>
    </div>
  );
};

GeneralInfoSection.validationSchema = validationSchema;
export default GeneralInfoSection;
