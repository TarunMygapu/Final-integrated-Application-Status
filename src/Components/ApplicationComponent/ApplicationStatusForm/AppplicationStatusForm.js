import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import ArrowBack from "@mui/icons-material/ArrowBack";
import StatusSelector from "../../../Widgets/StatusSelector/StatusSelector";
import ProgressHeader from "../../../Widgets/ProgressHeader/ProgressHeader";
import StepperTabs from "../../../Widgets/StepperTabs/StepperTabs";
import GeneralInfoSection from "../../GeneralInfoSection/GeneralInfoSection";
import ConcessionInfoSection from "../../Concession/ConcessionInfoSection";
import AddressInfoSection from "../../AddressInfoSection/AddressInfoSection";
import PaymentInfoSection from "../../PaymentInfoSection/PaymentInfoSection";
import ConfirmationHeader from "../../Conformation/ConformatinHeader";
import Damaged from "../../Damaged/Damaged";
import SuccessPage from "../../ConformationPage/SuccessPage";
import StatusHeader from "../../Conformation/StatusHeader/StatusHeader";
import apiService from "../../../Bakend/SaleFormapis";
import backButton from "../../../Asserts/ApplicationStatus/BakArrow.svg";
import * as Yup from "yup";
import styles from "./ApplicationStatusForm.module.css";

const combinedValidationSchema = Yup.object().shape({
  ...(GeneralInfoSection.validationSchema?.fields || {}),
  ...(ConcessionInfoSection.validationSchema?.fields || {}),
  ...(AddressInfoSection.validationSchema?.fields || {}),
  ...(PaymentInfoSection.validationSchema?.fields || {}),
});

const ApplicationStatusForm = ({ onBack, initialData = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationInitialValues = (location && location.state && location.state.initialValues) ? location.state.initialValues : {};
  
  // Debug logging for location state
  console.log("📍 Location state data:", {
    hasLocation: !!location,
    hasState: !!(location && location.state),
    hasInitialValues: !!(location && location.state && location.state.initialValues),
    locationInitialValues: locationInitialValues
  });
  const { applicationNo, status } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [activeConfirmationStep, setActiveConfirmationStep] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successStatusType, setSuccessStatusType] = useState("sale");
  const [couponDetails, setCouponDetails] = useState({ mobile: "", code: "" });
  const [saleData, setSaleData] = useState(null);
  const [persistentData, setPersistentData] = useState({ campus: "", zone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const steps = [
    "General Information",
    "Concession Information",
    "Address Information",
    "Payment Information",
  ];

  const defaultInitialValues = {
    siblingInformation: [],
    status: "",
    additionalCourseFee: "",
    scoreAppNo: "",
    marks: "",
    camp: "",
    admissionReferredBy: "",
    category: "SSC",
    htNo: "",
    aadhaar: "",
    appType: "",
    appFee: "",
    surname: "",
    studentName: "",
    fatherName: "",
    occupation: "",
    phoneNumber: "",
    studentType: "",
    dob: "",
    gender: "",
    joinedCampus: "",
    city: "",
    joinInto: "",
    course: "",
    courseBatch: "",
    courseDates: "",
    fee: "",
    schoolState: "",
    schoolDistrict: "",
    schoolType: "",
    schoolName: "",
    totalFee: "",
    yearConcession1st: "",
    yearConcession2nd: "",
    yearConcession3rd: "",
    givenBy: "",
    givenById: "",
    description: "",
    authorizedBy: "",
    authorizedById: "",
    reason: "",
    concessionReasonId: "",
    concessionWritten: "",
    couponMobile: "",
    couponCode: "",
    doorNo: "",
    street: "",
    landmark: "",
    area: "",
    addressCity: "",
    district: "",
    mandal: "",
    pincode: "",
    payMode: "Cash",
    paymentDate: null,
    amount: "",
    receiptNumber: "",
    appFeeReceived: false,
    appFeePayMode: "Cash",
    appFeePayDate: null,
    appFeeAmount: "",
    appFeeReceiptNo: "",
    applicationNo: initialData.applicationNo || applicationNo || "257000006",
    zoneName: "",
    campusName: "",
    dgmName: "",
    quota: "",
    foodprefrence: "",
    mobileNumber: "",
    coupon: "",
    section: "", // Added section
    mainDdPayDate: null,
    mainDdAmount: "",
    mainDdReceiptNumber: "",
    mainDdOrganisationName: "",
    mainDdNumber: "",
    mainDdCityName: "",
    mainDdBankName: "",
    mainDdBranchName: "",
    mainDdIfscCode: "",
    mainDdDate: null,
    mainChequePayDate: null,
    mainChequeAmount: "",
    mainChequeReceiptNumber: "",
    mainChequeOrganisationName: "",
    mainChequeNumber: "",
    mainChequeCityName: "",
    mainChequeBankName: "",
    mainChequeBranchName: "",
    mainChequeIfscCode: "",
    mainChequeDate: null,
    feeDdPayDate: null,
    feeDdAmount: "",
    feeDdReceiptNumber: "",
    feeDdOrganisationName: "",
    feeDdNumber: "",
    feeDdCityName: "",
    feeDdBankName: "",
    feeDdBranchName: "",
    feeDdIfscCode: "",
    feeDdDate: null,
    feeChequePayDate: null,
    feeChequeAmount: "",
    feeChequeReceiptNumber: "",
    feeChequeOrganisationName: "",
    feeChequeNumber: "",
    feeChequeCityName: "",
    feeChequeBankName: "",
    feeChequeBranchName: "",
    feeChequeIfscCode: "",
    feeChequeDate: null,
    // Hidden/system fields
    proId: 4095,
    statusId: 2,
    createdBy: 2,
  };

  const initialValues = useMemo(
    () => {
      const values = {
        ...defaultInitialValues,
        ...locationInitialValues,
        ...initialData,
        ...applicationData, // Include fetched application data
        htNo:
          applicationData?.applicationNo ||
          (locationInitialValues && locationInitialValues.applicationNo) ||
          initialData.applicationNo ||
          initialData.htNo ||
          "",
        joinedCampus:
          applicationData?.campusName ||
          (locationInitialValues && (locationInitialValues.campus || locationInitialValues.campusName)) ||
          initialData.campus ||
          initialData.joinedCampus ||
          "",
        campusName:
          applicationData?.campusName ||
          (locationInitialValues && (locationInitialValues.campus || locationInitialValues.campusName)) ||
          initialData.campus ||
          initialData.joinedCampus ||
          "",
        campus:
          applicationData?.campusName ||
          (locationInitialValues && (locationInitialValues.campus || locationInitialValues.campusName)) ||
          initialData.campus ||
          initialData.joinedCampus ||
          "",
        district:
          applicationData?.zoneName ||
          (locationInitialValues && (locationInitialValues.zone || locationInitialValues.zoneName)) ||
          initialData.zone ||
          initialData.district ||
          "",
        zoneName:
          applicationData?.zoneName ||
          (locationInitialValues && (locationInitialValues.zone || locationInitialValues.zoneName)) ||
          initialData.zone ||
          initialData.district ||
          "",
        zone:
          applicationData?.zoneName ||
          (locationInitialValues && (locationInitialValues.zone || locationInitialValues.zoneName)) ||
          initialData.zone ||
          initialData.district ||
          "",
      };
      console.log("Initial values calculated:", { 
        applicationData, 
        locationInitialValues, 
        initialData, 
        calculatedValues: {
          htNo: values.htNo,
          joinedCampus: values.joinedCampus,
          district: values.district,
          campusName: values.campusName,
          zoneName: values.zoneName
        }
      });
      return values;
    },
    [initialData, locationInitialValues, applicationData]
  );

  useEffect(() => {
    if (status) {
      const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      if (["Sale", "Confirmation", "Damaged"].includes(normalized)) setSelectedStatus(normalized);
    }
  }, [status]);

  // Clear application data when applicationNo changes to prevent stale data
  useEffect(() => {
    setApplicationData(null);
  }, [applicationNo]);

  // Fetch application data when applicationNo changes
  useEffect(() => {
    const fetchApplicationData = async () => {
      if (applicationNo) {
        console.log("🔄 Fetching application data for:", applicationNo);
        try {
          const data = await apiService.getApplicationDetails(applicationNo);
          console.log("📥 Raw application data received:", data);
          if (data) {
            // Normalize the data to match our expected format
            const normalizedData = {
              applicationNo: data.applicationNo || data.application_no || applicationNo,
              campusName: data.campusName || data.campus_name || data.campus || data.cmps_name || data.campusName || "",
              zoneName: data.zoneName || data.zone_name || data.zone || data.zonal_name || data.zoneName || "",
              studentName: data.studentName || data.student_name || data.name || "",
              // Add other fields as needed
            };
            console.log("✅ Normalized application data:", normalizedData);
            setApplicationData(normalizedData);
          } else {
            console.log("⚠️ No data received from API");
            setApplicationData(null);
          }
        } catch (error) {
          console.error("❌ Error fetching application data:", error);
          setApplicationData(null);
        }
      } else {
        console.log("⚠️ No applicationNo provided");
        setApplicationData(null);
      }
    };

    fetchApplicationData();
  }, [applicationNo]);

  const sectionValidationSchemas = useMemo(() => ({
    0: GeneralInfoSection.validationSchema,
    1: ConcessionInfoSection.validationSchema,
    2: AddressInfoSection.validationSchema,
    3: PaymentInfoSection.validationSchema,
  }), []);

  const currentValidationSchema = useMemo(
    () => (selectedStatus === "Sale" ? sectionValidationSchemas[activeStep] : undefined),
    [activeStep, selectedStatus, sectionValidationSchemas]
  );

  const handleNext = (values, setFieldValue, validateForm, setTouched) => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (activeStep === 1) {
          setFieldValue("couponMobile", couponDetails.mobile);
          setFieldValue("couponCode", couponDetails.code);
        }
        if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
      } else {
        const touchedFields = {};
        Object.keys(errors).forEach((field) => {
          touchedFields[field] = true;
          if (field.includes("siblingInformation")) {
            const match = field.match(/siblingInformation\[(\d+)\]\.(\w+)/);
            if (match) {
              const [, index, subField] = match;
              if (!touchedFields.siblingInformation) touchedFields.siblingInformation = [];
              if (!touchedFields.siblingInformation[index]) touchedFields.siblingInformation[index] = {};
              touchedFields.siblingInformation[index][subField] = true;
            }
          }
        });
        setTouched(touchedFields);
      }
    });
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
    else navigate("/application");
  };

  const handleSubmit = async (values) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      console.log("All form values before submission:", values);

      const formData = {
        studAdmsNo: values.applicationNo,
        studentName: values.firstName,
        surname: values.surname,
        htNo: values.htNo,
        apaarNo: values.aapar || "",
        dateOfJoin: values.orientationDates || values.courseDates,
        createdBy: 2,
        aadharCardNo: values.aadhar ? Number(values.aadhar) : 0,
        dob: values.dob,
        religionId: values.religion ? Number(values.religion) : 0,
        casteId: values.caste ? Number(values.caste) : 0,
        schoolTypeId: values.schoolType ? Number(values.schoolType) : 0,
        schoolName: values.schoolName || "",
        preSchoolStateId: values.schoolState ? Number(values.schoolState) : 0,
        preSchoolDistrictId: values.schoolDistrict ? Number(values.schoolDistrict) : 0,
        schoolTypeId: values.schoolType ? Number(values.schoolType) : 0,
        admissionReferredBy: values.admissionReferredBy || "",
        scoreAppNo: values.scoreAppNo || "",
        marks: values.marks ? Number(values.marks) : 0,
        orientationDate: values.orientationDates || values.courseDates,
        appSaleDate: values.orientationDates || values.courseDates,
        orientationFee: Number(values.OrientationFee) || 0,
        genderId: values.gender ? Number(values.gender) : 0,
        appTypeId: values.admissionType ? Number(values.admissionType) : 0,
        studentTypeId: values.studentType ? Number(values.studentType) : 0,
        studyTypeId: 1,
        orientationId: values.orientationName ? Number(values.orientationName) : 0,
        sectionId: 0, // Default value as per Swagger
        quotaId: values.quota ? Number(values.quota) : 0,
        statusId: 2,
        classId: values.joiningClassName ? Number(values.joiningClassName) : 0,
        campusId: values.joinedCampus ? Number(values.joinedCampus) : 0,
        proId: values.proId ? Number(values.proId) : 4095,
        orientationBatchId: values.orientationBatch ? Number(values.orientationBatch) : 0,
        bloodGroupId: values.bloodGroup ? Number(values.bloodGroup) : 0,
        parents: [
          {
            name: values.fatherName || "",
            relationTypeId: 1, // Father information
            occupation: values.fatherOccupation || "",
            mobileNo: values.fatherPhoneNumber ? Number(values.fatherPhoneNumber) : 0,
            email: values.fatherEmail || ""
          },
          {
            name: values.motherName || "",
            relationTypeId: 2, // Mother information
            occupation: values.motherOccupation || "",
            mobileNo: values.motherPhoneNumber ? Number(values.motherPhoneNumber) : 0,
            email: values.motherEmail || ""
          }
        ],
        addressDetails: {
          doorNo: values.doorNo || "",
          street: values.street || "",
          landmark: values.landmark || "",
          area: values.area || "",
          cityId: (() => {
            const addressCityId = values.addressCity && /^\d+$/.test(String(values.addressCity)) ? Number(values.addressCity) : 0;
            const generalCityId = values.city && /^\d+$/.test(String(values.city)) ? Number(values.city) : 0;
            return addressCityId || generalCityId || 0;
          })(),
          mandalId: values.mandal ? Number(values.mandal) : 0,
          districtId: values.district ? Number(values.district) : 0,
          pincode: values.pincode ? Number(values.pincode) : 0,
          stateId: values.stateId && /^\d+$/.test(String(values.stateId)) ? Number(values.stateId) : 0,
          createdBy: 0,
        },
        studentConcessionDetails: values.yearConcession1st || values.yearConcession2nd || values.yearConcession3rd ? {
          concessionIssuedBy: Number(values.givenById) || 0,
          concessionAuthorisedBy: Number(values.authorizedById) || 0,
          description: values.reason || "",
          concessionReasonId: Number(values.concessionReasonId) || 0,
          created_by: 2,
          concessions: [
            ...(values.yearConcession1st && Number(values.yearConcession1st) > 0 ? [{
              concTypeId: 1, // First year
              amount: Number(values.yearConcession1st)
            }] : []),
            ...(values.yearConcession2nd && Number(values.yearConcession2nd) > 0 ? [{
              concTypeId: 2, // Second year
              amount: Number(values.yearConcession2nd)
            }] : []),
            ...(values.yearConcession3rd && Number(values.yearConcession3rd) > 0 ? [{
              concTypeId: 3, // Third year
              amount: Number(values.yearConcession3rd)
            }] : [])
          ]
        } : null,
        proConcessionDetails: values.yearConcession1st || values.yearConcession2nd || values.yearConcession3rd ? {
          concessionAmount: Number(values.yearConcession1st || 0) + Number(values.yearConcession2nd || 0) + Number(values.yearConcession3rd || 0),
          reason: values.reason || "",
          proEmployeeId: Number(values.authorizedById) || 0,
          created_by: 2
        } : null,
        paymentDetails: {
          applicationFeeAmount: Number(values.applicationFee) || Number(values.amount) || 0,
          prePrintedReceiptNo: values.receiptNumber || "",
          applicationFeeDate: values.paymentDate || new Date().toISOString(),
          concessionAmount: Number(values.yearConcession1st || 0) + Number(values.yearConcession2nd || 0) + Number(values.yearConcession3rd || 0),
          paymentModeId: values.payMode === "Cash" ? 1 : values.payMode === "DD" ? 2 : values.payMode === "Cheque" ? 3 : 4,
          chequeDdNo: values.payMode === "DD" ? values.mainDdNumber : values.payMode === "Cheque" ? values.mainChequeNumber : "",
          ifscCode: values.payMode === "DD" ? values.mainDdIfscCode : values.payMode === "Cheque" ? values.mainChequeIfscCode : "",
          chequeDdDate: values.paymentDate || new Date().toISOString(),
          cityId: values.payMode === "DD" ? Number(values.mainDdCityName) || 0 : values.payMode === "Cheque" ? Number(values.mainChequeCityName) || 0 : 0,
          orgBankId: values.payMode === "DD" ? Number(values.mainDdBankName) || 0 : values.payMode === "Cheque" ? Number(values.mainChequeBankName) || 0 : 0,
          orgBankBranchId: values.payMode === "DD" ? Number(values.mainDdBranchName) || 0 : values.payMode === "Cheque" ? Number(values.mainChequeBranchName) || 0 : 0,
          organizationId: values.payMode === "DD" ? Number(values.mainDdOrganisationName) || 0 : values.payMode === "Cheque" ? Number(values.mainChequeOrganisationName) || 0 : 0,
          created_by: 0,
        },
        siblings: values.siblingInformation.map((sibling) => ({
          fullName: sibling.fullName || "",
          schoolName: sibling.schoolName || "",
          classId: sibling.class ? Number(sibling.class) : 0,
          relationTypeId: sibling.relationType ? Number(sibling.relationType) : 0,
          genderId: sibling.gender ? Number(sibling.gender) : 0,
          createdBy: 0,
        })),
      };

      console.log("Submitting form data:", formData);
      console.log("School Type value:", values.schoolType);
      console.log("School Type ID:", formData.schoolTypeId);
      await apiService.submitAdmissionForm(formData);
      setSaleData(formData);
      setSuccessStatusType("sale");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting admission form:", error);
      alert("Failed to submit admission form: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCouponSubmit = (setFieldValue) => {
    if (!/^\d{10}$/.test(String(couponDetails.mobile || ""))) {
      alert("Enter a valid 10 digit mobile number");
      return;
    }
    if (!couponDetails.code || String(couponDetails.code).trim() === "") {
      alert("Enter a valid coupon code");
      return;
    }
    setFieldValue("couponMobile", couponDetails.mobile);
    setFieldValue("couponCode", couponDetails.code);
    setShowCouponModal(false);
  };

  const handleStepChange = (step) => {
    if (step <= activeStep) setActiveStep(step);
  };

  const handleConfirmationSuccess = (confirmationValues) => {
    setSuccessStatusType("confirmation");
    setShowSuccess(true);
  };

  const getApplicationData = () => ({
    applicationNo: initialValues.applicationNo,
    studentName: initialValues.studentName,
    amount: initialValues.amount,
    campus: initialValues.joinedCampus,
  });

  // Prefer human-readable labels over numeric ids for header display
  const resolveDisplayValue = (primary, ...fallbacks) => {
    const isNonNumeric = (v) => v && !/^\d+$/.test(String(v).trim());
    if (isNonNumeric(primary)) return primary;
    for (const v of fallbacks) {
      if (isNonNumeric(v)) return v;
    }
    // If everything is numeric/empty, return the first truthy value or empty string
    return primary || fallbacks.find(Boolean) || "";
  };

  // Create a more robust data resolution that handles multiple scenarios
  const getHeaderCampus = () => {
    // Try initial values first (most persistent)
    if (initialValues.campusName && initialValues.campusName !== "-" && initialValues.campusName !== "") {
      console.log("✅ Campus found in initialValues.campusName:", initialValues.campusName);
      return initialValues.campusName;
    }
    if (initialValues.campus && initialValues.campus !== "-" && initialValues.campus !== "") {
      console.log("✅ Campus found in initialValues.campus:", initialValues.campus);
      return initialValues.campus;
    }
    if (initialValues.joinedCampus && initialValues.joinedCampus !== "-" && initialValues.joinedCampus !== "") {
      console.log("✅ Campus found in initialValues.joinedCampus:", initialValues.joinedCampus);
      return initialValues.joinedCampus;
    }
    // Try location state (immediate data from navigation)
    if (locationInitialValues?.campusName && locationInitialValues.campusName !== "-" && locationInitialValues.campusName !== "") {
      console.log("✅ Campus found in locationInitialValues.campusName:", locationInitialValues.campusName);
      return locationInitialValues.campusName;
    }
    if (locationInitialValues?.campus && locationInitialValues.campus !== "-" && locationInitialValues.campus !== "") {
      console.log("✅ Campus found in locationInitialValues.campus:", locationInitialValues.campus);
      return locationInitialValues.campus;
    }
    // Try API data
    if (applicationData?.campusName && applicationData.campusName !== "-" && applicationData.campusName !== "") {
      console.log("✅ Campus found in applicationData.campusName:", applicationData.campusName);
      return applicationData.campusName;
    }
    // Try persistent data as last resort
    if (persistentData.campus && persistentData.campus !== "-" && persistentData.campus !== "") {
      console.log("✅ Campus found in persistentData.campus:", persistentData.campus);
      return persistentData.campus;
    }
    console.log("❌ No campus data found, returning '-'");
    return "-";
  };

  const getHeaderZone = () => {
    // Try initial values first (most persistent)
    if (initialValues.zoneName && initialValues.zoneName !== "-" && initialValues.zoneName !== "") {
      console.log("✅ Zone found in initialValues.zoneName:", initialValues.zoneName);
      return initialValues.zoneName;
    }
    if (initialValues.zone && initialValues.zone !== "-" && initialValues.zone !== "") {
      console.log("✅ Zone found in initialValues.zone:", initialValues.zone);
      return initialValues.zone;
    }
    if (initialValues.district && initialValues.district !== "-" && initialValues.district !== "") {
      console.log("✅ Zone found in initialValues.district:", initialValues.district);
      return initialValues.district;
    }
    // Try location state (immediate data from navigation)
    if (locationInitialValues?.zoneName && locationInitialValues.zoneName !== "-" && locationInitialValues.zoneName !== "") {
      console.log("✅ Zone found in locationInitialValues.zoneName:", locationInitialValues.zoneName);
      return locationInitialValues.zoneName;
    }
    if (locationInitialValues?.zone && locationInitialValues.zone !== "-" && locationInitialValues.zone !== "") {
      console.log("✅ Zone found in locationInitialValues.zone:", locationInitialValues.zone);
      return locationInitialValues.zone;
    }
    // Try API data
    if (applicationData?.zoneName && applicationData.zoneName !== "-" && applicationData.zoneName !== "") {
      console.log("✅ Zone found in applicationData.zoneName:", applicationData.zoneName);
      return applicationData.zoneName;
    }
    // Try persistent data as last resort
    if (persistentData.zone && persistentData.zone !== "-" && persistentData.zone !== "") {
      console.log("✅ Zone found in persistentData.zone:", persistentData.zone);
      return persistentData.zone;
    }
    console.log("❌ No zone data found, returning '-'");
    return "-";
  };

  const headerCampus = getHeaderCampus();
  const headerZone = getHeaderZone();

  // Preserve campus and zone data when first loaded
  useEffect(() => {
    if (headerCampus && headerCampus !== "-" && !persistentData.campus) {
      setPersistentData(prev => ({ ...prev, campus: headerCampus }));
    }
    if (headerZone && headerZone !== "-" && !persistentData.zone) {
      setPersistentData(prev => ({ ...prev, zone: headerZone }));
    }
  }, [headerCampus, headerZone, persistentData.campus, persistentData.zone]);

  // Debug logging for header data
  console.log("🏢 Header Campus Resolution:", {
    applicationData: applicationData?.campusName,
    locationInitialValues: locationInitialValues?.campusName,
    initialValues: {
      campusName: initialValues.campusName,
      campus: initialValues.campus,
      joinedCampus: initialValues.joinedCampus
    },
    resolved: headerCampus
  });

  console.log("🌍 Header Zone Resolution:", {
    applicationData: applicationData?.zoneName,
    locationInitialValues: locationInitialValues?.zoneName,
    initialValues: {
      zoneName: initialValues.zoneName,
      zone: initialValues.zone,
      district: initialValues.district
    },
    resolved: headerZone
  });

  console.log("📊 StatusHeader Props:", {
    applicationNo: applicationData?.applicationNo || initialValues.applicationNo || applicationNo || "",
    campusName: headerCampus,
    zoneName: headerZone
  });

  console.log("🔍 Complete Data Debug:", {
    locationInitialValues: locationInitialValues,
    applicationData: applicationData,
    initialValues: {
      campusName: initialValues.campusName,
      zoneName: initialValues.zoneName,
      campus: initialValues.campus,
      zone: initialValues.zone,
      district: initialValues.district,
      joinedCampus: initialValues.joinedCampus
    },
    selectedStatus: selectedStatus
  });

  return (
    <div className={styles.Application_Status_Form_main_app_status_container}>
      <div className={styles.Application_Status_Form_main_app_status_header}>
        <div className={styles.Application_Status_Form_main_app_status_header_back_btn}>
          <div className={styles.Application_Status_Form_main_back_btn} onClick={handleBack}>
            <img src={backButton} alt="back" />
          </div>
        </div>
        <div className={styles.Application_Status_Form_main_app_status_header_status_header}>
          {!showSuccess && (
            <StatusHeader
              applicationNo={applicationData?.applicationNo || initialValues.applicationNo || applicationNo || ""}
              campusName={headerCampus}
              zoneName={headerZone}
            />
          )}
        </div>
      </div>
      <div className={styles.Application_Status_Form_main_layout_wrapper}>
        <StatusSelector
          selectedStatus={selectedStatus}
          onStatusSelect={(newStatus) => {
            if (showSuccess) return;
            setSelectedStatus(newStatus);
            const pathSegment = newStatus.toLowerCase();
            const appNo = initialValues.applicationNo || applicationNo || "";
            if (appNo) {
              // Pass current application data through navigation state to ensure StatusHeader visibility
              // Use current resolved values and persistent data as fallback to preserve data
              const currentData = {
                applicationNo: applicationData?.applicationNo || initialValues.applicationNo || applicationNo || "",
                zoneName: initialValues.zoneName || initialValues.zone || initialValues.district || headerZone || persistentData.zone || "",
                zone: initialValues.zoneName || initialValues.zone || initialValues.district || headerZone || persistentData.zone || "",
                zoneEmpId: initialValues.zoneEmpId || "",
                campusName: initialValues.campusName || initialValues.campus || initialValues.joinedCampus || headerCampus || persistentData.campus || "",
                campus: initialValues.campusName || initialValues.campus || initialValues.joinedCampus || headerCampus || persistentData.campus || "",
                campusId: initialValues.campusId || "",
                proName: initialValues.proName || "",
                proId: initialValues.proId || "",
                dgmName: initialValues.dgmName || "",
                dgmEmpId: initialValues.dgmEmpId || "",
                status: initialValues.status || "",
                statusId: initialValues.statusId || "",
                reason: initialValues.reason || "",
              };
              console.log("🚀 StatusSelector Navigation Data:", {
                newStatus,
                appNo,
                currentData,
                initialValues: {
                  campusName: initialValues.campusName,
                  zoneName: initialValues.zoneName,
                  campus: initialValues.campus,
                  zone: initialValues.zone,
                  district: initialValues.district,
                  joinedCampus: initialValues.joinedCampus
                }
              });
              
              navigate(`/application/${appNo}/${pathSegment}`, {
                state: {
                  initialValues: currentData,
                },
              });
            }
          }}
          showOnlyTitle={showSuccess}
          currentStatus={showSuccess ? "Confirmation" : ""}
          applicationNo={initialValues.applicationNo || applicationNo || ""}
        />
        {!showSuccess && selectedStatus === "Sale" && <ProgressHeader step={activeStep} totalSteps={steps.length} />}
        {!showSuccess && selectedStatus === "Confirmation" && <ProgressHeader step={activeConfirmationStep} totalSteps={2} />}
      </div>
      {showSuccess ? (
        <SuccessPage
          applicationNo={initialValues.applicationNo}
          studentName={initialValues.studentName}
          amount={initialValues.amount}
          campus={initialValues.campusName || initialValues.joinedCampus || initialValues.campus || ""}
          zone={initialValues.zoneName || initialValues.district || initialValues.zone || ""}
          onBack={() => navigate("/application")}
          statusType={successStatusType}
        />
      ) : selectedStatus === "Confirmation" ? (
        <ConfirmationHeader
          onSuccess={handleConfirmationSuccess}
          applicationData={getApplicationData()}
          onStepChange={(step) => setActiveConfirmationStep(step)}
          saleData={saleData}
        />
      ) : selectedStatus === "Sale" ? (
        <Formik
          initialValues={initialValues}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, handleChange, handleSubmit, validateForm, setTouched }) => (
            <Form className={styles.Application_Status_Form_main_application_form}>
              <div className={styles.Application_Status_Form_main_form_wrapper}>
                <StepperTabs steps={steps} activeStep={activeStep} onStepChange={handleStepChange} />
                {activeStep === 0 && (
                  <GeneralInfoSection
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setTouched}
                    validateForm={validateForm}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                    handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
                    handleBack={handleBack}
                  />
                )}
                {activeStep === 1 && (
                  <ConcessionInfoSection
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setTouched}
                    validateForm={validateForm}
                    showCouponModal={showCouponModal}
                    setShowCouponModal={setShowCouponModal}
                    couponDetails={couponDetails}
                    setCouponDetails={setCouponDetails}
                    onCouponSubmit={() => handleCouponSubmit(setFieldValue)}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                    handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
                    handleBack={handleBack}
                  />
                )}
                {activeStep === 2 && (
                  <AddressInfoSection
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setTouched}
                    validateForm={validateForm}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                    handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
                    handleBack={handleBack}
                  />
                )}
                {activeStep === 3 && (
                  <PaymentInfoSection
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setTouched}
                    validateForm={validateForm}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                    handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
                    handleBack={handleBack}
                    handleSubmit={handleSubmit}
                    finishDisabled={isSubmitting}
                    onContinue={() => {
                      setSaleData(values);
                      setSelectedStatus("Confirmation");
                      const pathSegment = "confirmation";
                      const appNo = initialValues.applicationNo || applicationNo || "";
                      if (appNo) navigate(`/application/${appNo}/${pathSegment}`);
                    }}
                  />
                )}
              </div>
            </Form>
          )}
        </Formik>
      ) : selectedStatus === "Damaged" ? (
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, handleChange, validateForm, setTouched }) => (
            <Damaged />
          )}
        </Formik>
      ) : null}
    </div>
  );
};

export default ApplicationStatusForm;
