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

  // Field mapping from current names to Swagger API response names
  const fieldMapping = {
    // Basic student information
    'studentName': 'studentName',
    'surname': 'surname', 
    'htNo': 'htNo',
    'aadhaar': 'aadharCardNo',
    'applicationNo': 'studAdmsNo',
    'dob': 'dob',
    'gender': 'genderId',
    'appType': 'appTypeId',
    'studentType': 'studentTypeId',
    'admissionReferredBy': 'admissionReferredBy',
    'scoreAppNo': 'scoreAppNo',
    'marks': 'marks',
    'orientationDate': 'orientationDate',
    'appSaleDate': 'appSaleDate',
    'orientationFee': 'orientationFee',
    'joinedCampus': 'campusId',
    'course': 'orientationId',
    'courseBatch': 'orientationBatchId',
    'courseDates': 'orientationDate',
    'fee': 'orientationFee',
    'schoolType': 'preschoolTypeId',
    'schoolName': 'schoolName',
    'schoolState': 'preSchoolStateId',
    'schoolDistrict': 'preSchoolDistrictId',
    'schoolTypeId': 'schoolTypeId',
    'preschoolTypeId': 'preschoolTypeId',
    'religion': 'religionId',
    'caste': 'casteId',
    'bloodGroup': 'bloodGroupId',
    'section': 'sectionId',
    'quota': 'quotaId',
    'status': 'statusId',
    'classId': 'classId',
    'proId': 'proId',
    'createdBy': 'createdBy',
    'dateOfJoin': 'dateOfJoin',
    
    // Parent information
    'fatherName': 'parents[0].name',
    'fatherOccupation': 'parents[0].occupation',
    'fatherPhoneNumber': 'parents[0].mobileNo',
    'fatherEmail': 'parents[0].email',
    'motherName': 'parents[1].name',
    'motherOccupation': 'parents[1].occupation',
    'motherPhoneNumber': 'parents[1].mobileNo',
    'motherEmail': 'parents[1].email',
    'relationType': 'parents[0].relationTypeId', // Father relation type
    
    // Address information
    'doorNo': 'addressDetails.doorNo',
    'street': 'addressDetails.street',
    'landmark': 'addressDetails.landmark',
    'area': 'addressDetails.area',
    'addressCity': 'addressDetails.cityId',
    'mandal': 'addressDetails.mandalId',
    'district': 'addressDetails.districtId',
    'pincode': 'addressDetails.pincode',
    'state': 'addressDetails.stateId',
    
    // Sibling information
    'siblingInformation': 'siblings',
    'fullName': 'siblings[].fullName',
    'schoolName': 'siblings[].schoolName',
    'classId': 'siblings[].classId',
    'relationTypeId': 'siblings[].relationTypeId',
    'genderId': 'siblings[].genderId',
    
    // Payment information
    'appFeeAmount': 'paymentDetails.applicationFeeAmount',
    'appFeeReceiptNo': 'paymentDetails.prePrintedReceiptNo',
    'appFeePayDate': 'paymentDetails.applicationFeeDate',
    'concessionAmount': 'paymentDetails.concessionAmount',
    'payMode': 'paymentDetails.paymentModeId',
    'chequeDdNo': 'paymentDetails.chequeDdNo',
    'ifscCode': 'paymentDetails.ifscCode',
    'chequeDdDate': 'paymentDetails.chequeDdDate',
    'organizationId': 'paymentDetails.organizationId',
    'orgBankId': 'paymentDetails.orgBankId',
    'orgBankBranchId': 'paymentDetails.orgBankBranchId',
    
    // Concession information
    'concessionIssuedBy': 'studentConcessionDetails.concessionIssuedBy',
    'concessionAuthorisedBy': 'studentConcessionDetails.concessionAuthorisedBy',
    'description': 'studentConcessionDetails.description',
    'concessionReasonId': 'studentConcessionDetails.concessionReasonId',
    'yearConcession1st': 'studentConcessionDetails.concessions[0].amount',
    'yearConcession2nd': 'studentConcessionDetails.concessions[1].amount',
    'yearConcession3rd': 'studentConcessionDetails.concessions[2].amount',
    'concessions': 'studentConcessionDetails.concessions',
    
    // PRO concession
    'proConcessionAmount': 'proConcessionDetails.concessionAmount',
    'proReason': 'proConcessionDetails.reason',
    'proEmployeeId': 'proConcessionDetails.proEmployeeId'
  };

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

  // Function to transform form data to Swagger API response structure
  const transformFormDataToApiFormat = (formData) => {
    // Helper function to safely parse integers with fallback
    const safeParseInt = (value, fallback = 0) => {
      if (!value || value === "" || value === null || value === undefined) return fallback;
      const parsed = parseInt(value);
      return isNaN(parsed) ? fallback : parsed;
    };

    // Helper function to safely parse floats with fallback
    const safeParseFloat = (value, fallback = 0) => {
      if (!value || value === "" || value === null || value === undefined) return fallback;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    };

    const apiData = {
      studAdmsNo: formData.applicationNo || formData.htNo || "",
      studentName: formData.studentName || formData.firstName || "",
      surname: formData.surname || "",
      htNo: formData.htNo || "",
      apaarNo: formData.aapar || "",
      dateOfJoin: formData.dateOfJoin || new Date().toISOString().split('T')[0],
      createdBy: formData.createdBy || 2,
      aadharCardNo: safeParseInt(formData.aadhaar),
      dob: formData.dob || "",
      religionId: safeParseInt(formData.religion) || 1,
      casteId: safeParseInt(formData.caste) || 1,
      schoolTypeId: safeParseInt(formData.schoolTypeId) || 1,
      schoolName: formData.schoolName || "",
      preSchoolStateId: safeParseInt(formData.schoolState) || 1,
      preSchoolDistrictId: safeParseInt(formData.schoolDistrict) || 1,
      preschoolTypeId: safeParseInt(formData.schoolType) || safeParseInt(formData.preschoolTypeId) || safeParseInt(formData.preschoolType) || 1,
      admissionReferredBy: formData.admissionReferredBy || "",
      scoreAppNo: formData.scoreAppNo || "",
      marks: safeParseInt(formData.marks),
      orientationDate: formData.orientationDates || formData.courseDates || "",
      appSaleDate: formData.appSaleDate || new Date().toISOString(),
      orientationFee: safeParseFloat(formData.OrientationFee) || safeParseFloat(formData.orientationFee) || safeParseFloat(formData.fee),
      genderId: safeParseInt(formData.gender) || 1,
      appTypeId: safeParseInt(formData.admissionType) || safeParseInt(formData.appType) || 1,
      studentTypeId: safeParseInt(formData.studentType) || 1,
      studyTypeId: safeParseInt(formData.batchType) || safeParseInt(formData.studyType) || 1,
      orientationId: safeParseInt(formData.orientationName) || safeParseInt(formData.course) || 1,
      sectionId: safeParseInt(formData.section) || 1,
      quotaId: safeParseInt(formData.quota) || 1,
      statusId: safeParseInt(formData.status) || 2,
      classId: safeParseInt(formData.joiningClassName) || safeParseInt(formData.classId) || 1,
      campusId: safeParseInt(formData.joinedCampus) || 1,
      proId: safeParseInt(formData.proId) || 4095,
      orientationBatchId: safeParseInt(formData.orientationBatch) || safeParseInt(formData.courseBatch) || 1,
      bloodGroupId: safeParseInt(formData.bloodGroup) || 1,
      parents: [
        {
          name: formData.fatherName || "",
          relationTypeId: 1, // Father relation type ID
          occupation: formData.fatherOccupation || "",
          mobileNo: safeParseInt(formData.fatherPhoneNumber),
          email: formData.fatherEmail || ""
        },
        {
          name: formData.motherName || "",
          relationTypeId: 2, // Mother relation type ID
          occupation: formData.motherOccupation || "",
          mobileNo: safeParseInt(formData.motherPhoneNumber),
          email: formData.motherEmail || ""
        }
      ],
      addressDetails: {
        doorNo: formData.doorNo || "",
        street: formData.street || "",
        landmark: formData.landmark || "",
        area: formData.area || "",
        cityId: safeParseInt(formData.addressCity) || safeParseInt(formData.city) || 1,
        mandalId: safeParseInt(formData.mandal) || 1,
        districtId: safeParseInt(formData.district) || 1,
        pincode: safeParseInt(formData.pincode) || 500001,
        stateId: safeParseInt(formData.state) || safeParseInt(formData.stateId) || 1,
        createdBy: formData.createdBy || 2
      },
      siblings: formData.siblingInformation || [],
      studentConcessionDetails: {
        concessionIssuedBy: safeParseInt(formData.givenById) || safeParseInt(formData.concessionIssuedBy) || 1,
        concessionAuthorisedBy: safeParseInt(formData.authorizedById) || safeParseInt(formData.concessionAuthorisedBy) || 1,
        description: formData.reason || formData.description || "",
        concessionReasonId: safeParseInt(formData.concessionReasonId) || 1,
        created_by: formData.createdBy || 2,
        concessions: [
          ...(formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 ? [{
            concTypeId: 1, // Year 1 concession
            amount: safeParseFloat(formData.yearConcession1st)
          }] : []),
          ...(formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 ? [{
            concTypeId: 2, // Year 2 concession
            amount: safeParseFloat(formData.yearConcession2nd)
          }] : []),
          ...(formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 ? [{
            concTypeId: 3, // Year 3 concession
            amount: safeParseFloat(formData.yearConcession3rd)
          }] : [])
        ]
      },
      proConcessionDetails: {
        concessionAmount: safeParseFloat(formData.proConcessionAmount),
        reason: formData.proReason || formData.reason || "",
        proEmployeeId: safeParseInt(formData.proEmployeeId) || safeParseInt(formData.authorizedById) || 1,
        created_by: formData.createdBy || 2
      },
      paymentDetails: {
        applicationFeeAmount: safeParseFloat(formData.applicationFee) || safeParseFloat(formData.amount) || safeParseFloat(formData.appFeeAmount),
        prePrintedReceiptNo: formData.receiptNumber || formData.appFeeReceiptNo || "",
        applicationFeeDate: formData.paymentDate || formData.appFeePayDate || new Date().toISOString(),
        concessionAmount: safeParseFloat(formData.yearConcession1st) + safeParseFloat(formData.yearConcession2nd) + safeParseFloat(formData.yearConcession3rd),
        paymentModeId: safeParseInt(formData.payMode) || 1,
        chequeDdNo: formData.mainDdNumber || formData.mainChequeNumber || "",
        ifscCode: formData.mainDdIfscCode || formData.mainChequeIfscCode || "",
        chequeDdDate: formData.paymentDate || formData.mainDdDate || formData.mainChequeDate || "",
        cityId: safeParseInt(formData.mainDdCityName) || safeParseInt(formData.mainChequeCityName) || safeParseInt(formData.addressCity) || 1,
        orgBankId: safeParseInt(formData.mainDdBankName) || safeParseInt(formData.mainChequeBankName) || 1,
        orgBankBranchId: safeParseInt(formData.mainDdBranchName) || safeParseInt(formData.mainChequeBranchName) || 1,
        organizationId: safeParseInt(formData.mainDdOrganisationName) || safeParseInt(formData.mainChequeOrganisationName) || 1,
        created_by: formData.createdBy || 2
      }
    };

    console.log("🔄 Transformed form data to API format:", apiData);
    
    // Display formatted object in console UI
    console.log("📋 ===== API OBJECT STRUCTURE =====");
    console.log(JSON.stringify(apiData, null, 2));
    console.log("📋 ===== END API OBJECT =====");
    
    // Display detailed object structure
    console.log("🔍 ===== DETAILED API OBJECT =====");
    console.log("📝 Basic Information:");
    console.log(`  studAdmsNo: "${apiData.studAdmsNo}"`);
    console.log(`  studentName: "${apiData.studentName}"`);
    console.log(`  surname: "${apiData.surname}"`);
    console.log(`  htNo: "${apiData.htNo}"`);
    console.log(`  apaarNo: "${apiData.apaarNo}"`);
    console.log(`  dateOfJoin: "${apiData.dateOfJoin}"`);
    console.log(`  createdBy: ${apiData.createdBy}`);
    console.log(`  aadharCardNo: ${apiData.aadharCardNo}`);
    console.log(`  dob: "${apiData.dob}"`);
    
    console.log("📝 Academic Information:");
    console.log(`  religionId: ${apiData.religionId}`);
    console.log(`  casteId: ${apiData.casteId}`);
    console.log(`  schoolTypeId: ${apiData.schoolTypeId}`);
    console.log(`  schoolName: "${apiData.schoolName}"`);
    console.log(`  preSchoolStateId: ${apiData.preSchoolStateId}`);
    console.log(`  preSchoolDistrictId: ${apiData.preSchoolDistrictId}`);
    console.log(`  preschoolTypeId: ${apiData.preschoolTypeId} (from schoolType dropdown)`);
    console.log(`  admissionReferredBy: "${apiData.admissionReferredBy}"`);
    console.log(`  scoreAppNo: "${apiData.scoreAppNo}"`);
    console.log(`  marks: ${apiData.marks}`);
    
    console.log("📝 Orientation Information:");
    console.log(`  orientationDate: "${apiData.orientationDate}"`);
    console.log(`  appSaleDate: "${apiData.appSaleDate}"`);
    console.log(`  orientationFee: ${apiData.orientationFee}`);
    console.log(`  genderId: ${apiData.genderId}`);
    console.log(`  appTypeId: ${apiData.appTypeId}`);
    console.log(`  studentTypeId: ${apiData.studentTypeId}`);
    console.log(`  studyTypeId: ${apiData.studyTypeId}`);
    console.log(`  orientationId: ${apiData.orientationId}`);
    console.log(`  sectionId: ${apiData.sectionId}`);
    console.log(`  quotaId: ${apiData.quotaId}`);
    console.log(`  statusId: ${apiData.statusId}`);
    console.log(`  classId: ${apiData.classId}`);
    console.log(`  campusId: ${apiData.campusId}`);
    console.log(`  proId: ${apiData.proId}`);
    console.log(`  orientationBatchId: ${apiData.orientationBatchId}`);
    console.log(`  bloodGroupId: ${apiData.bloodGroupId}`);
    
    console.log("👨‍👩‍👧‍👦 Parents Information:");
    apiData.parents.forEach((parent, index) => {
      console.log(`  Parent ${index + 1}:`);
      console.log(`    name: "${parent.name}"`);
      console.log(`    relationTypeId: ${parent.relationTypeId}`);
      console.log(`    occupation: "${parent.occupation}"`);
      console.log(`    mobileNo: ${parent.mobileNo}`);
      console.log(`    email: "${parent.email}"`);
    });
    
    console.log("🏠 Address Details:");
    console.log(`  doorNo: "${apiData.addressDetails.doorNo}"`);
    console.log(`  street: "${apiData.addressDetails.street}"`);
    console.log(`  landmark: "${apiData.addressDetails.landmark}"`);
    console.log(`  area: "${apiData.addressDetails.area}"`);
    console.log(`  cityId: ${apiData.addressDetails.cityId}`);
    console.log(`  mandalId: ${apiData.addressDetails.mandalId}`);
    console.log(`  districtId: ${apiData.addressDetails.districtId}`);
    console.log(`  pincode: ${apiData.addressDetails.pincode}`);
    console.log(`  stateId: ${apiData.addressDetails.stateId}`);
    console.log(`  createdBy: ${apiData.addressDetails.createdBy}`);
    
    console.log("👶 Siblings Information:");
    apiData.siblings.forEach((sibling, index) => {
      console.log(`  Sibling ${index + 1}:`);
      console.log(`    fullName: "${sibling.fullName}"`);
      console.log(`    schoolName: "${sibling.schoolName}"`);
      console.log(`    classId: ${sibling.classId}`);
      console.log(`    relationTypeId: ${sibling.relationTypeId}`);
      console.log(`    genderId: ${sibling.genderId}`);
      console.log(`    createdBy: ${sibling.createdBy}`);
    });
    
    console.log("💰 Student Concession Details:");
    console.log(`  concessionIssuedBy: ${apiData.studentConcessionDetails.concessionIssuedBy}`);
    console.log(`  concessionAuthorisedBy: ${apiData.studentConcessionDetails.concessionAuthorisedBy}`);
    console.log(`  description: "${apiData.studentConcessionDetails.description}"`);
    console.log(`  concessionReasonId: ${apiData.studentConcessionDetails.concessionReasonId}`);
    console.log(`  created_by: ${apiData.studentConcessionDetails.created_by}`);
    console.log("  concessions:");
    apiData.studentConcessionDetails.concessions.forEach((concession, index) => {
      console.log(`    Concession ${index + 1}:`);
      console.log(`      concTypeId: ${concession.concTypeId}`);
      console.log(`      amount: ${concession.amount}`);
    });
    
    console.log("💼 PRO Concession Details:");
    console.log(`  concessionAmount: ${apiData.proConcessionDetails.concessionAmount}`);
    console.log(`  reason: "${apiData.proConcessionDetails.reason}"`);
    console.log(`  proEmployeeId: ${apiData.proConcessionDetails.proEmployeeId}`);
    console.log(`  created_by: ${apiData.proConcessionDetails.created_by}`);
    
    console.log("💳 Payment Details:");
    console.log(`  applicationFeeAmount: ${apiData.paymentDetails.applicationFeeAmount}`);
    console.log(`  prePrintedReceiptNo: "${apiData.paymentDetails.prePrintedReceiptNo}"`);
    console.log(`  applicationFeeDate: "${apiData.paymentDetails.applicationFeeDate}"`);
    console.log(`  concessionAmount: ${apiData.paymentDetails.concessionAmount}`);
    console.log(`  paymentModeId: ${apiData.paymentDetails.paymentModeId}`);
    console.log(`  chequeDdNo: "${apiData.paymentDetails.chequeDdNo}"`);
    console.log(`  ifscCode: "${apiData.paymentDetails.ifscCode}"`);
    console.log(`  chequeDdDate: "${apiData.paymentDetails.chequeDdDate}"`);
    console.log(`  cityId: ${apiData.paymentDetails.cityId}`);
    console.log(`  orgBankId: ${apiData.paymentDetails.orgBankId}`);
    console.log(`  orgBankBranchId: ${apiData.paymentDetails.orgBankBranchId}`);
    console.log(`  organizationId: ${apiData.paymentDetails.organizationId}`);
    console.log(`  created_by: ${apiData.paymentDetails.created_by}`);
    
    console.log("🔍 ===== END DETAILED API OBJECT =====");
    
    return apiData;
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

      // Transform form data to match Swagger API response structure
      const formData = transformFormDataToApiFormat(values);

      console.log("Submitting form data:", formData);
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
