import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
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
import backButton from "../../../Asserts/ApplicationStatus/backArrow.png";
import styles from "./ApplicationStatusForm.module.css";
const StatusDetails = ({ status }) => {
  const details = {
    Confirmation: [],
    Damaged: [],
  };
  return (
    <div className={styles.Application_Status_Form_status_details}>
      <h3>{status} Details</h3>
      <ul>
        {details[status]?.map((item, index) => (
          <li key={index}>
            <strong>{item.label}:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};
const ApplicationStatusForm = ({ onBack, initialData = {} }) => {
  const navigate = useNavigate();
  const { applicationNo, status } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [activeConfirmationStep, setActiveConfirmationStep] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [couponDetails, setCouponDetails] = useState({ mobile: "", code: "" });
  const [saleData, setSaleData] = useState(null);
  const steps = [
    "General Information",
    "Concession Information",
    "Address Information",
    "Payment Information",
  ];
  const defaultInitialValues = {
    status: "",
    additionalCourseFee: "",
    scoreAppNo: "",
    marks: "",
    camp: "",
    admissionReferredBy: "",
    siblingInformation: [{ fullName: "", relationType: "", class: "", schoolName: "", gender: "" }],
    category: "SSC",
    htNo: "",
    aadhaar: "",
    appType: "Camp",
    appFee: "",
    surname: "",
    studentName: "",
    fatherName: "",
    occupation: "",
    phoneNumber: "",
    studentType: "",
    dob: "",
    gender: "Male",
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
    description: "",
    authorizedBy: "",
    reason: "",
    concessionWritten: "",
    couponMobile: "",
    couponCode: "",
    doorNo: "",
    street: "",
    landmark: "",
    area: "",
    pincode: "",
    district: "",
    mandal: "",
    payMode: "Cash",
    paymentDate: "",
    amount: "",
    prePrintedReceiptNo: "",
    appFeeReceived: false,
    appFeePayMode: "Cash",
    appFeePayDate: "",
    appFeeAmount: "",
    appFeeReceiptNo: "",
    applicationNo: initialData.applicationNo || applicationNo || "257000006",
    zoneName: "",
    campusName: "",
    proName: "",
    dgmName: "",
    quota: "",
    foodprefrence: "",
    mobileNumber: "",
    coupon: "",
    receiptNumber: "",
    mainDdPayDate: "",
    mainDdAmount: "",
    mainDdReceiptNumber: "",
    mainDdOrganisationName: "",
    mainDdNumber: "",
    mainDdCityName: "",
    mainDdBankName: "",
    mainDdBranchName: "",
    mainDdIfscCode: "",
    mainDdDate: "",
    mainChequePayDate: "",
    mainChequeAmount: "",
    mainChequeReceiptNumber: "",
    mainChequeOrganisationName: "",
    mainChequeNumber: "",
    mainChequeCityName: "",
    mainChequeBankName: "",
    mainChequeBranchName: "",
    mainChequeIfscCode: "",
    mainChequeDate: "",
    feeDdPayDate: "",
    feeDdAmount: "",
    feeDdReceiptNumber: "",
    feeDdOrganisationName: "",
    feeDdNumber: "",
    feeDdCityName: "",
    feeDdBankName: "",
    feeDdBranchName: "",
    feeDdIfscCode: "",
    feeDdDate: "",
    feeChequePayDate: "",
    feeChequeAmount: "",
    feeChequeReceiptNumber: "",
    feeChequeOrganisationName: "",
    feeChequeNumber: "",
    feeChequeCityName: "",
    feeChequeBankName: "",
    feeChequeBranchName: "",
    feeChequeIfscCode: "",
    feeChequeDate: "",
 
  };
  const initialValues = useMemo(() => ({
    ...defaultInitialValues,
    ...initialData,
    htNo: initialData.applicationNo || initialData.htNo || "",
    joinedCampus: initialData.campus || initialData.joinedCampus || "",
    district: initialData.zone || initialData.district || "",
  }), [initialData]);
  useEffect(() => {
    if (status) {
      const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      if (["Sale", "Confirmation", "Damaged"].includes(normalized)) {
        setSelectedStatus(normalized);
      }
    }
    console.log("Initial Values:", initialValues);
    console.log("Application No:", applicationNo);
    console.log("Status:", status);
  }, [status, initialValues, applicationNo]);
  const validate = (values) => {
    const errors = {};
    if (activeStep === 0 && selectedStatus === "Sale") {
      if (!values.htNo) errors.htNo = "HT No is required";
      if (!values.studentName) errors.studentName = "Student Name is required";
      if (!values.phoneNumber) {
        errors.phoneNumber = "Phone Number is required";
      } else if (!/^\d{10}$/.test(String(values.phoneNumber))) {
        errors.phoneNumber = "Phone number must be exactly 10 digits";
      }
      if (!values.category) errors.category = "Category is required";
      if (!values.appType) errors.appType = "App Type is required";
      if (!values.studentType) errors.studentType = "Student Type is required";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.aadhaar) {
        errors.aadhaar = "Aadhaar Card No is required";
      } else if (!/^\d{12}$/.test(String(values.aadhaar))) {
        errors.aadhaar = "Aadhaar Card No must be exactly 12 digits";
      }
      if (!values.dob) {
        errors.dob = "Date of Birth is required";
      } else {
        const today = new Date();
        const dobDate = new Date(values.dob);
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(today.getFullYear() - 3);
        if (dobDate > today) {
          errors.dob = "DOB cannot be a future date";
        } else if (dobDate > threeYearsAgo) {
          errors.dob = "Student must be at least 3 years old";
        }
      }
      if (!values.joinedCampus) errors.joinedCampus = "Joined Campus is required";
      if (!values.joinInto) errors.joinInto = "Join Into is required";
      if (!values.course) errors.course = "Course is required";
      if (!values.courseBatch) errors.courseBatch = "Course Batch is required";
      if (!values.courseDates) errors.courseDates = "Course Dates is required";
      if (!values.schoolState) errors.schoolState = "School State is required";
      if (!values.schoolDistrict) errors.schoolDistrict = "School District is required";
      if (!values.schoolType) errors.schoolType = "School Type is required";
      if (values.studentName && !/^[a-zA-Z\s\.\-]+$/.test(values.studentName)) {
        errors.studentName = "Student Name can only contain letters, spaces, dots, and hyphens";
      }
      if (values.schoolName && !/^[a-zA-Z\s\.\-]+$/.test(values.schoolName)) {
        errors.schoolName = "School Name can only contain letters, spaces, dots, and hyphens";
      }
      if (values.surname && !/^[a-zA-Z\s\.\-]+$/.test(values.surname)) {
        errors.surname = "Surname can only contain letters, spaces, dots, and hyphens";
      }
      if (values.fatherName && !/^[a-zA-Z\s\.\-]+$/.test(values.fatherName)) {
        errors.fatherName = "Father Name can only contain letters, spaces, dots, and hyphens";
      }
      if (values.occupation && !/^[a-zA-Z\s\.\-]+$/.test(values.occupation)) {
        errors.occupation = "Occupation can only contain letters, spaces, dots, and hyphens";
      }
      if (values.admissionReferredBy && !/^[a-zA-Z\s\.\-]+$/.test(values.admissionReferredBy)) {
        errors.admissionReferredBy = "Admission Referred By can only contain letters, spaces, dots, and hyphens";
      }
    }
    if (activeStep === 1 && selectedStatus === "Sale") {
      const c1 = values.yearConcession1st;
      const c2 = values.yearConcession2nd;
      const c3 = values.yearConcession3rd;
      const isProvided = (v) => v !== undefined && String(v).trim() !== "";
      const isNumeric = (v) => !isNaN(Number(v));
      const anyConcession = [c1, c2, c3].some((v) => isProvided(v) && Number(v) > 0);
      [
        { key: "yearConcession1st", label: "1st Year Concession" },
        { key: "yearConcession2nd", label: "2nd Year Concession" },
        { key: "yearConcession3rd", label: "3rd Year Concession" },
      ].forEach((f) => {
        const val = values[f.key];
        if (isProvided(val) && !isNumeric(val)) {
          errors[f.key] = "Amount must be numeric";
        }
      });
      if (anyConcession) {
        if (isProvided(c1) && !isNumeric(c1)) errors.yearConcession1st = "Amount must be numeric";
        if (isProvided(c2) && !isNumeric(c2)) errors.yearConcession2nd = "Amount must be numeric";
        if (isProvided(c3) && !isNumeric(c3)) errors.yearConcession3rd = "Amount must be numeric";
        if (!values.givenBy) errors.givenBy = "Given By is required when concession is applied";
        if (!values.authorizedBy) errors.authorizedBy = "Authorized By is required when concession is applied";
        if (!values.reason) errors.reason = "Reason is required when concession is applied";
        if (!values.concessionWritten || (values.concessionWritten !== "yes" && values.concessionWritten !== "no")) {
          errors.concessionWritten = "Please select Yes or No";
        }
        const totalApplicable = Number(values.totalFee || 0);
        const totalConcession = Number(c1 || 0) + Number(c2 || 0) + Number(c3 || 0);
        if (totalApplicable > 0 && totalConcession > totalApplicable) {
          const msg = "Total concession cannot exceed total fee";
          errors.yearConcession1st = errors.yearConcession1st || msg;
          errors.yearConcession2nd = errors.yearConcession2nd || msg;
          errors.yearConcession3rd = errors.yearConcession3rd || msg;
        }
      }
    }
    if (activeStep === 2 && selectedStatus === "Sale") {
      if (!values.doorNo) errors.doorNo = "Door No is required";
      if (!values.street) errors.street = "Street is required";
      if (!values.area) errors.area = "Area is required";
      if (!values.pincode) {
        errors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(String(values.pincode))) {
        errors.pincode = "Pincode must be exactly 6 digits";
      }
      if (!values.district) errors.district = "District is required";
      if (!values.mandal) errors.mandal = "Mandal is required";
      if (!values.city) errors.city = "City is required";
    }
    if (activeStep === 3 && selectedStatus === "Sale") {
      if (!values.payMode) errors.payMode = "Payment Mode is required";
      if (!values.paymentDate) {
        errors.paymentDate = "Payment Date is required";
      } else {
        const payDate = new Date(values.paymentDate);
        const today = new Date();
        if (payDate > today) {
          errors.paymentDate = "Payment date cannot be in the future";
        }
      }
      if (values.amount === undefined || values.amount === "") {
        errors.amount = "Amount is required";
      } else if (isNaN(Number(values.amount))) {
        errors.amount = "Amount must be numeric";
      }
      if (values.appFeeReceived) {
        if (!values.appFeePayMode) errors.appFeePayMode = "Application Fee Pay Mode is required";
        if (!values.appFeePayDate) errors.appFeePayDate = "Application Fee Pay Date is required";
        if (!values.appFeeAmount) errors.appFeeAmount = "Application Fee Amount is required";
      }
    }
    if (selectedStatus === "Damaged") {
      if (!values.zoneName) errors.zoneName = "Zone Name is required";
      if (!values.campusName) errors.campusName = "Campus Name is required";
      if (!values.proName) errors.proName = "Pro Name is required";
      if (!values.dgmName) errors.dgmName = "DGM Name is required";
      if (!values.status) errors.status = "Status is required";
      if (!values.reason) errors.reason = "Reason is required";
    }
    return errors;
  };
  const isPaymentStepReady = (values) => {
    if (selectedStatus !== "Sale") return false;
    if (!values.payMode) return false;
    if (!values.paymentDate) return false;
    const payDate = new Date(values.paymentDate);
    if (payDate > new Date()) return false;
    if (values.amount === undefined || values.amount === "") return false;
    if (isNaN(Number(values.amount))) return false;
    return true;
  };
  const handleNext = (values, setFieldValue, validateForm, setTouched) => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (activeStep === 1) {
          setFieldValue("couponMobile", couponDetails.mobile);
          setFieldValue("couponCode", couponDetails.code);
        }
        if (activeStep < steps.length - 1) {
          setActiveStep((prev) => prev + 1);
        }
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
    navigate('/application');
  };
  const handleSubmit = (values) => {
    console.log("Sale Form Submitted:", values);
    setSaleData(values);
    setSelectedStatus("Confirmation");
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
    console.log("Applied Coupon:", couponDetails);
    setShowCouponModal(false);
  };
  const handleStepChange = (step) => {
    if (step <= activeStep) {
      setActiveStep(step);
    }
  };
  const handleConfirmationSuccess = (confirmationValues) => {
    console.log(confirmationValues);
    setShowSuccess(true);
  };
  const getApplicationData = () => {
    return {
      applicationNo: initialValues.applicationNo,
      studentName: initialValues.studentName,
      amount: initialValues.amount,
      campus: initialValues.joinedCampus,
    };
  };
  return (
    <div className={styles.Application_Status_Form_main_app_status_container}>
      <div className={styles.Application_Status_Form_main_app_status_header}>
        <div className={styles.Application_Status_Form_main_app_status_header_back_btn}>
          <div className={styles.Application_Status_Form_main_back_btn} onClick={handleBack} sx={{ mb: 2 }}>
            <img src={backButton} alt="back" />
          </div>
        </div>
        <div className={styles.Application_Status_Form_main_app_status_header_status_header}>
          {!showSuccess && <StatusHeader />}
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
            if (appNo) navigate(`/application/${appNo}/${pathSegment}`);
          }}
          showOnlyTitle={showSuccess}
          currentStatus={showSuccess ? "Confirmation" : ""}
          applicationNo={initialValues.applicationNo || applicationNo || ""}
        />
        {!showSuccess && selectedStatus === "Sale" && (
          <ProgressHeader step={activeStep} totalSteps={steps.length} />
        )}
        {!showSuccess && selectedStatus === "Confirmation" && <ProgressHeader step={activeConfirmationStep} totalSteps={2} />}
      </div>
      {showSuccess ? (
        <SuccessPage
          applicationNo={initialValues.applicationNo}
          studentName={initialValues.studentName}
          amount={initialValues.amount}
          campus={initialValues.joinedCampus}
          onBack={() => navigate('/application')}
          statusType={selectedStatus === "Confirmation" ? "confirmation" : "sale"}
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
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, handleChange, validateForm, setTouched }) => (
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
                    setTouched={setTouched}
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
                    setTouched={setTouched}
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
                    setTouched={setTouched}
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
                    setTouched={setTouched}
                    validateForm={validateForm}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                    handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
                    handleBack={handleBack}
                    finishDisabled={false}
                    onFinish={async () => {
                      const saleDataObject = {
                        generalInformation: {
                          studentName: values.studentName,
                          surname: values.surname,
                          fatherName: values.fatherName,
                          gender: values.gender,
                          applicationNo: values.applicationNo,
                          joinedCampus: values.joinedCampus,
                          joinedZone: values.joinedZone,
                          joinedDgm: values.joinedDgm,
                          joinedPro: values.joinedPro,
                          category: values.category,
                          htNo: values.htNo,
                          aadhaar: values.aadhaar,
                          appType: values.appType,
                          appFee: values.appFee,
                          occupation: values.occupation,
                          phoneNumber: values.phoneNumber,
                          studentType: values.studentType,
                          dob: values.dob,
                          city: values.city,
                          joinInto: values.joinInto,
                          course: values.course,
                          courseBatch: values.courseBatch,
                          courseDates: values.courseDates,
                          fee: values.fee,
                          schoolState: values.schoolState,
                          schoolDistrict: values.schoolDistrict,
                          schoolType: values.schoolType,
                          schoolName: values.schoolName,
                          totalFee: values.totalFee,
                          additionalCourseFee: values.additionalCourseFee,
                          scoreAppNo: values.scoreAppNo,
                          marks: values.marks,
                          admissionReferredBy: values.admissionReferredBy,
                          camp: values.camp
                        },
                        concessionInformation: {
                          yearConcession1st: values.yearConcession1st,
                          yearConcession2nd: values.yearConcession2nd,
                          yearConcession3rd: values.yearConcession3rd,
                          givenBy: values.givenBy,
                          description: values.description,
                          authorizedBy: values.authorizedBy,
                          concessionWritten: values.concessionWritten,
                          reason: values.reason
                        },
                        addressInformation: {
                          doorNo: values.doorNo,
                          street: values.street,
                          landmark: values.landmark,
                          area: values.area,
                          city: values.city,
                          district: values.district,
                          mandal: values.mandal,
                          pincode: values.pincode
                        },
                        paymentInformation: {
                          payMode: values.payMode,
                          paymentDate: values.paymentDate,
                          amount: values.amount,
                          prePrintedReceiptNo: values.prePrintedReceiptNo,
                          appFeeReceived: values.appFeeReceived,
                          appFeePayMode: values.appFeePayMode,
                          appFeePayDate: values.appFeePayDate,
                          appFeeAmount: values.appFeeAmount,
                          appFeeReceiptNo: values.appFeeReceiptNo
                        },
                        timestamp: new Date().toISOString(),
                        flow: "Sale Flow Complete"
                      };
                      console.log(saleDataObject);
                      setSaleData(saleDataObject);
                      setShowSuccess(true);
                    }}
                    onContinue={() => {
                      console.log("Continuing to Confirmation with Sale Data:", values);
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
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, handleChange, validateForm, setTouched }) => (
            <Form>
              <Damaged />
            </Form>
          )}
        </Formik>
      ) : null}
    </div>
  );
};
export default ApplicationStatusForm;
 
 