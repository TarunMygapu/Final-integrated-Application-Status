import React, { useState, useEffect } from "react";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import { Button as MUIButton } from "@mui/material";
import Button from "../../Widgets/Button/Button";
import {ReactComponent as TrendingUpIcon} from "../../Asserts/ApplicationStatus/Trending up.svg";
import Cash from "../../Asserts/ApplicationStatus/Cash (1).svg";
import DD from "../../Asserts/ApplicationStatus/DD (1).svg";
import Debit from "../../Asserts/ApplicationStatus/Debit Card.svg";
import Cheque from "../../Asserts/ApplicationStatus/Cheque (1).svg";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import styles from "./PaymentInfoSection.module.css";
const PaymentInfoSection = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  activeStep,
  setActiveStep,
  steps,
  handleNext,
  handleBack,
  onFinish,
  onContinue,
  finishDisabled,
}) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(values.payMode || "Cash");
  const [selectedAppFeePayMode, setSelectedAppFeePayMode] = useState(values.appFeePayMode || "Cash");
  // Update selected payment mode when values change
  useEffect(() => {
    setSelectedPaymentMode(values.payMode || "Cash");
    setSelectedAppFeePayMode(values.appFeePayMode || "Cash");
  }, [values.payMode, values.appFeePayMode]);
    // Define payment mode specific fields for Application Fee Pay Mode
  const getPaymentModeFields = () => {
    switch (selectedPaymentMode) {
      case "Cash":
        return [
          { label: "Application Fee Pay Date", name: "paymentDate", placeholder: "Select Payment Date", type: "date", required: true },
        { label: "Application Fee Amount", name: "amount", placeholder: "Enter Amount (numbers only)", required: true },
        { label: "Receipt Number", name: "receiptNumber", placeholder: "Enter Receipt Number", required: true },
        ];
      case "DD":
        return [
          { label: "Application Fee Pay Date", name: "mainDdPayDate", placeholder: "Select Pay Date", type: "date", required: true },
        { label: "Application Fee Amount", name: "mainDdAmount", placeholder: "Enter Amount (numbers only)", required: true },
        { label: "Receipt Number", name: "mainDdReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          {label:"Organisation Name", name: "mainDdOrganisationName", type: "select", options: ["Option 1", "Option 2", "Option 3"], required: true },
          {label:"DD Number", name: "mainDdNumber", placeholder: "Enter DD Number", required: true },
          {label:"City Name", name: "mainDdCityName", type: "select", options: ["Option 1", "Option 2", "Option 3"], required: true },
          {label:"Bank Name", name: "mainDdBankName", type: "select", options: ["Option 1", "Option 2", "Option 3"], required: true },
          {label:"Branch Name", name: "mainDdBranchName", type: "select", options: ["Option 1", "Option 2", "Option 3"], required: true },
          // {label:"IFSC Code", name: "mainDdIfscCode", placeholder: "Enter IFSC Code", required: true },
          {label:"DD Date", name: "mainDdDate", placeholder: "Select DD Date", type: "date", required: true },
         ];
      case "Cheque":
        return [
          { label: "Application Fee Pay Date", name: "mainChequePayDate", placeholder: "Select Pay Date", type: "date", required: true },
        { label: "Application Fee Amount", name: "mainChequeAmount", placeholder: "Enter Amount (numbers only)", required: true },
        { label: "Receipt Number", name: "mainChequeReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          {label:"Organisation Name", name: "mainChequeOrganisationName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"Cheque Number", name: "mainChequeNumber", placeholder: "Enter Cheque Number", required: true },
          {label:"City Name", name: "mainChequeCityName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"Bank Name", name: "mainChequeBankName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"Branch Name", name: "mainChequeBranchName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"IFSC Code", name: "mainChequeIfscCode", placeholder: "Enter IFSC Code", required: true },
          {label:"Cheque Date", name: "mainChequeDate", placeholder: "Select Cheque Date", type: "date", required: true },
        ];
      case "Credit/Debit Card":
        return [
     
        ];
 
    }
  };
  // Define payment mode specific fields for App Fee Pay Mode
  const getAppFeePaymentModeFields = () => {
 
    switch (selectedAppFeePayMode) {
      case "Cash":
        return [
         { label: "Application Fee Pay Date", name: "appFeePayDate", placeholder: "Select Pay Date", type: "date", required: true },
        { label: "Application Fee Amount", name: "appFeeAmount", placeholder: "Enter Amount (numbers only)", required: true },
        { label: "Receipt Number", name: "appFeeReceiptNo", placeholder: "Enter Receipt No (numbers only)", required: true },
        ];
      case "DD":
        return [
           { label: "Application Fee Pay Date", name: "feeDdPayDate", placeholder: "Select Pay Date", type: "date", required: true },
        { label: "Application Fee Amount", name: "feeDdAmount", placeholder: "Enter Amount (numbers only)", required: true },
        { label: "Receipt Number", name: "feeDdReceiptNumber", placeholder: "Enter Receipt Number", required: true },
         {label:"Organisation Name", name: "feeDdOrganisationName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
         {label:"DD Number", name: "feeDdNumber", placeholder: "Enter DD Number", required: true },
         {label:"City Name", name: "feeDdCityName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
         {label:"Bank Name", name: "feeDdBankName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
         {label:"Branch Name", name: "feeDdBranchName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
         {label:"IFSC Code", name: "feeDdIfscCode", placeholder: "Enter IFSC Code", required: true },
         {label:"DD Date", name: "feeDdDate", placeholder: "Select DD Date", type: "date", required: true },
        ];
      case "Cheque":
        return [
          { label: "Application Fee Pay Date", name: "feeChequePayDate", placeholder: "Select Pay Date", type: "date", required: true },
        { label: "Application Fee Amount", name: "feeChequeAmount", placeholder: "Enter Amount (numbers only)", required: true },
        { label: "Receipt Number", name: "feeChequeReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          {label:"Organisation Name", name: "feeChequeOrganisationName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"Cheque Number", name: "feeChequeNumber", placeholder: "Enter Cheque Number", required: true },
          {label:"City Name", name: "feeChequeCityName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"Bank Name", name: "feeChequeBankName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"Branch Name", name: "feeChequeBranchName", type: "select", options: ["Option 1", "Option 2", "Option 3"] },
          {label:"IFSC Code", name: "feeChequeIfscCode", placeholder: "Enter IFSC Code", required: true },
          {label:"Cheque Date", name: "feeChequeDate", placeholder: "Select Cheque Date", type: "date", required: true },
        ];
      case "Credit/Debit Card":
        return [
     
        ];
   
    }
  };
  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (["amount", "appFeeAmount", "prePrintedReceiptNo", "appFeeReceiptNo", "receiptNumber", "mainDdAmount", "feeDdAmount", "mainChequeAmount", "feeChequeAmount", "mainDdReceiptNumber", "feeDdReceiptNumber", "mainChequeReceiptNumber", "feeChequeReceiptNumber", "mainDdNumber", "feeDdNumber", "mainChequeNumber", "feeChequeNumber"].includes(name)) {
      finalValue = value.replace(/\D/g, '');
    }
    if (["mainDdIfscCode", "mainChequeIfscCode", "feeDdIfscCode", "feeChequeIfscCode"].includes(name)) {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    }
    setFieldValue(name, finalValue);
  };
  const renderPaymentModes = (name, setFieldValue) => {
    const selected = values[name] || "Cash";
    const modes = [
      { label: "Cash", icon: Cash },
      { label: "DD", icon: DD },
      { label: "Cheque", icon: Cheque },
      { label: "Credit/Debit Card", icon: Debit },
    ];
    return (
      <nav className={styles.Payment_Info_Section_payment_category_options}>
        <ul className={styles.Payment_Info_Section_payment_nav_list}>
          {modes.map((mode) => (
            <li key={mode.label} className={styles.Payment_Info_Section_payment_nav_item}>
              <MUIButton
                type="button"
                className={`${styles.Payment_Info_Section_payment_category_label} ${selected === mode.label ? styles.Payment_Info_Section_active : ""}`}
                onClick={() => {
                  setFieldValue(name, mode.label);
                  if (name === "payMode") {
                    setSelectedPaymentMode(mode.label);
                  } else if (name === "appFeePayMode") {
                    setSelectedAppFeePayMode(mode.label);
                  }
                }}
              >
                <img src={mode.icon} alt={mode.label} className={styles.paymentIcon} />
                <span className={styles.Payment_Info_Section_payment_category_text}>{mode.label}</span>
              </MUIButton>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  const renderInput = (field) => {
    if (field.type === "custom") {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_input_group}>
          <div className={styles.Payment_Info_Section_payment_field_label_wrapper}>
            <label className={`${styles.Payment_Info_Section_payment_form_label} ${styles.Payment_Info_Section_payment_fw_semibold} ${styles.Payment_Info_Section_payment_small_label}`} htmlFor={field.name}>
              {field.label}
              {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
            </label>
            <div className={styles.Payment_Info_Section_payment_line}></div>
          </div>
          {renderPaymentModes(field.name, setFieldValue)}
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    } else if (field.type === "checkbox") {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_checkbox_group}>
  <label
    className={`${styles.Payment_Info_Section_payment_form_label} ${styles.Payment_Info_Section_payment_small_label}`}
    htmlFor={field.name}
  >
    {field.label}
  </label>
  <label className={styles.squareCheckbox}>
  <input
    type="checkbox"
    name={field.name}
    checked={values[field.name]}
    onChange={handleChange}
  />
  <span className={styles.checkmark}></span>
</label>
  {touched[field.name] && errors[field.name] && (
    <span className={styles.Payment_Info_Section_payment_error_message}>
      {errors[field.name]}
    </span>
  )}
</div>
      );
    } else {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_inputbox_wrapper}>
          <label className={styles.Payment_Info_Section_payment_form_label} htmlFor={field.name}>
            {field.label}
            {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
          </label>
          <Inputbox
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={values[field.name] || ""}
            onChange={handleSectionChange}
            error={touched[field.name] && errors[field.name]}
          />
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    }
  };
  return (
    <div className={styles.Payment_Info_Section_payment_info_section}>
      <div className={styles.Payment_Info_Section_payment_section_header}>
        <div className={styles.Payment_Info_Section_payment_header_content}>
          {renderInput({ label: "Application Fee Pay Mode", name: "payMode", type: "custom", required: true })}
        </div>
      </div>
      <div className={styles.Payment_Info_Section_payment_form_grid}>
        {getPaymentModeFields()
          .map((field) => renderInput(field))
          .reduce((rows, item, index) => {
            if (index % 3 === 0) rows.push([]);
            rows[rows.length - 1].push(item);
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <div key={rowIndex} className={styles.Payment_Info_Section_payment_form_row}>
              {row}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, padIndex) => (
                  <div key={`pad-${rowIndex}-${padIndex}`} className={styles.Payment_Info_Section_payment_empty_field}></div>
                ))}
            </div>
          ))}
      </div>
      {renderInput({ label: "Application Fee Received", name: "appFeeReceived", type: "checkbox" })}
      {values.appFeeReceived && (
        <>
          <div className={styles.Payment_Info_Section_payment_app_fee_section}>
            <div className={styles.Payment_Info_Section_payment_header_content}>
              {renderInput({ label: "Pay Mode", name: "appFeePayMode", type: "custom", required: true })}
              <div className={styles.Payment_Info_Section_payment_special_concession_block}>
                <h6 className={styles.Payment_Info_Section_payment_concession_value}>0</h6>
                <span className={styles.Payment_Info_Section_payment_concession_label}>Application Special Concession Value</span>
              </div>
            </div>
          </div>
          <div className={styles.Payment_Info_Section_payment_form_grid}>
            {getAppFeePaymentModeFields()
              .map((field) => renderInput(field))
              .reduce((rows, item, index) => {
                if (index % 3 === 0) rows.push([]);
                rows[rows.length - 1].push(item);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <div key={rowIndex} className={styles.Payment_Info_Section_payment_form_row}>
                  {row}
                  {row.length < 3 &&
                    Array.from({ length: 3 - row.length }).map((_, padIndex) => (
                      <div key={`pad-${rowIndex}-${padIndex}`} className={styles.Payment_Info_Section_payment_empty_field}></div>
                    ))}
                </div>
              ))}
          </div>
        </>
      )}
      <div className={styles.Payment_Info_Section_payment_form_actions}>
        <Button
          variant="secondary"
          type="button"
          buttonname="Continue to Confirmation"
          onClick={() => (onContinue ? onContinue() : handleBack())}
          disabled={activeStep === 0}
        >
         
        </Button>
        <Button
            type="submit"
            variant="primary"
            onClick={handleNext}
            buttonname="Finish"
            righticon={<TrendingUpIcon/>}
       
          >
          </Button>
      </div>
    </div>
  );
};
export default PaymentInfoSection;
 
 