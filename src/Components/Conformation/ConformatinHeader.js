import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import styles from "./ConformationHeader.module.css";
import PaymentInformation from "../Conformation/PaymentInformation/PaymentInformation";
import StudentInformation from "../Conformation/StudentInformation/StudentInformation";
import ProgressHeader from "../../Widgets/ProgressHeader/ProgressHeader";
import SuccessPage from "../ConformationPage/SuccessPage";

const ConformationHeader = ({ onStepChange, onSuccess, applicationData = {}, saleData = null }) => {
  const [step, setStep] = useState(0);
  const [isStudentInfoCompleted, setIsStudentInfoCompleted] = useState(false);
  const [studentInfoValues, setStudentInfoValues] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const totalSteps = 2;

  const updateStep = (newStep) => {
    setStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  const handleChange = (_e, newValue) => {
    if (newValue === 0) {
      setStep(0);
      return;
    }
    if (newValue === 1) return;
  };

  const handlePaymentSubmit = (paymentValues) => {
    const combinedConfirmation = {
      studentInformation: studentInfoValues || {},
      paymentInformation: paymentValues || {},
    };
    console.log("Confirmation Data (Student + Payment):", combinedConfirmation);
    setShowSuccess(true);
    if (onSuccess) {
      onSuccess(combinedConfirmation);
    }
  };

  if (showSuccess) {
    return (
      <SuccessPage
        applicationNo={applicationData.applicationNo || "N/A"}
        studentName={applicationData.studentName || "N/A"}
        amount={applicationData.amount || "N/A"}
        campus={applicationData.campus || "N/A"}
        onBack={() => setShowSuccess(false)}
        statusType="confirmation"
      />
    );
  }

  return (
    <div className={styles.Conformation_Header_stepper_container}>
      <Tabs
        value={step}
        onChange={handleChange}
        variant="fullWidth"
        className={styles.Conformation_Header_tabs_root}
      >
        <Tab
          component="div"   // ⬅️ render as <div> instead of <button>
          onClick={() => updateStep(0)}
          TabIndicatorProps={{ style: { display: "none" } }} 
          label={
            <div
              className={`${styles.Conformation_Header_tab_label} ${
                step === 0 ? styles.Conformation_Header_active : step > 0 ? styles.Conformation_Header_completed : ""
              }`}
            >
              <div
                className={`${styles.Conformation_Header_tab_circle} ${
                  step === 0 ? styles.Conformation_Header_active : step > 0 ? styles.Conformation_Header_completed : ""
                }`}
              >
                1
              </div>
              Student Information
            </div>
          }
          className={`${styles.Conformation_Header_tab_item} ${styles.Conformation_Header_left} ${
            step === 0 ? styles.Conformation_Header_active : step > 0 ? styles.Conformation_Header_completed : ""
          }`}
        />

        <Tab
          component="div"  // ⬅️ same fix here
          TabIndicatorProps={{ style: { display: "none" } }} 
          label={
            <div
              className={`${styles.Conformation_Header_tab_label} ${
                step === 1 ? styles.Conformation_Header_active : ""
              } ${!isStudentInfoCompleted ? styles.Conformation_Header_disabled : ""}`}
            >
              <div
                className={`${styles.Conformation_Header_tab_circle} ${
                  step === 1 ? styles.Conformation_Header_active : ""
                }`}
              >
                2
              </div>
              Payment Information
            </div>
          }
          className={`${styles.Conformation_Header_tab_item} ${styles.Conformation_Header_right} ${
            step === 1 ? styles.Conformation_Header_active : ""
          } ${!isStudentInfoCompleted ? styles.Conformation_Header_disabled : ""}`}
        />
      </Tabs>

      <div>
        {step === 0 && (
          <StudentInformation
            saleData={saleData}
            onNext={(vals) => {
              setStudentInfoValues(vals);
              setIsStudentInfoCompleted(true);
              setStep(1);
              updateStep(1);
            }}
          />
        )}
        {step === 1 && isStudentInfoCompleted && (
          <PaymentInformation
            onSubmit={handlePaymentSubmit}
            saleData={saleData}
            handleBack={() => {
              setStep(0);
              updateStep(0);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConformationHeader;
