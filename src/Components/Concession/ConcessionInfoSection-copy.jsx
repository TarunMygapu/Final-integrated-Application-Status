import React from "react";
import InputBox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import { Button as MUIButton } from "@mui/material"; // MUI Button
import Button from "../../Widgets/Button/Button";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import styles from "./ConcessionInfoSection.module.css";
import {ReactComponent as TrendingUpIcon} from "../../Asserts/ApplicationStatus/Trending up.svg";
const ConcessionInfoSection = ({
  handleNext,
  setCouponDetails,
  onCouponSubmit,
  handleChange,
  setFieldValue,
  values,
  errors,
  touched,
  validateForm,
  setTouched,
}) => {
  const reasonOptions = ["MLA", "Merit", "Employee", "Other"];
  const flatfields = [
    { label: "Mobile Number", name: "mobileNumber", placeholder: "Enter Mobile Number", required: true },
    { label: "1st Year Concession", name: "yearConcession1st", placeholder: "Enter 1st Year Concession" },
    { label: "2nd Year Concession", name: "yearConcession2nd", placeholder: "Enter 2nd Year Concession" },
    { label: "3rd Year Concession", name: "yearConcession3rd", placeholder: "Enter 3rd Year Concession" },
    { label: "Given By", name: "givenBy", placeholder: "Enter Given By ", required: true },
    { label: "Description", name: "description", placeholder: "Enter Description " },
    { label: "Authorized By", name: "authorizedBy", placeholder: "Enter Authorized By ", required: true },
    { label: "Concession Written on Application", name: "concessionWritten", type: "radio", options: ["Yes", "No"], required: true },
    { label: "Reason", name: "reason", type: "select", options: ["", "MLA", "Merit", "Employee", "Other"], required: true },
  ];
  const mobileNumberField = flatfields.find((field) => field.name === "mobileNumber");
  const otherFields = flatfields.filter((field) => field.name !== "mobileNumber" && field.name !== "concessionWritten" && field.name !== "reason");
  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(name)) {
      finalValue = value.replace(/\D/g, '');
    } else if (["givenBy", "authorizedBy", "description"].includes(name)) {
      finalValue = value.replace(/[^a-zA-Z\s\.\-]/g, '');
    } else if (name === "mobileNumber") {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFieldValue(name, finalValue);
  };
  const handleApplyCoupon = () => {
    setCouponDetails({ mobile: values.mobileNumber, code: values.coupon });
    onCouponSubmit();
  };
  return (
    <div className={styles.Concession_Info_Section_concessionsContainer}>
      <div className={styles.Concession_Info_Section_applyCoupon}>
        <div>
          <div className={styles.Concession_Info_Section_applyCouponLabel}>
            <span className={styles.Concession_Info_Section_applyCouponLabelName}>Apply Coupon</span>
            <div className={styles.Concession_Info_Section_line}></div>
          </div>
          <div className={styles.Concession_Info_Section_couponSection}>
            <InputBox
              name="coupon"
              placeholder="Enter Coupon"
              className={styles.Concession_Info_Section_couponInput}
              onChange={handleSectionChange}
              value={values.coupon || ""}
            />
            <MUIButton
              variant="contained"
              className={styles.Concession_Info_Section_applyBtn}
              onClick={handleApplyCoupon}
            >
              Apply Coupon
            </MUIButton>
          </div>
        </div>
      </div>
      {/* Other Fields in Grid System */}
      <div className={styles.Concession_Info_Section_concessionsFields}>
             {/* Mobile Number Field in First Row */}
      {mobileNumberField && (
        <div className={styles.Concession_Info_Section_mobileNumberRow}>
          <div className={styles.Concession_Info_Section_concessionInput}>
            <InputBox
              label={mobileNumberField.label}
              name={mobileNumberField.name}
              placeholder={mobileNumberField.placeholder}
              value={values[mobileNumberField.name] || ""}
              required={mobileNumberField.required}
              onChange={handleSectionChange}
            />
            {touched[mobileNumberField.name] && errors[mobileNumberField.name] && (
              <div className={styles.Concession_Info_Section_concessionError}>
                {errors[mobileNumberField.name]}
              </div>
            )}
          </div>
        </div>
      )}
        {otherFields.map((field, index) => {
          const isYearField = ["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(field.name);
          const isConcessionWrittenField = field.name === "concessionWritten";
          const isReasonField = field.name === "reason";
          if (isYearField) {
            return (
              <div className={styles.Concession_Info_Section_concessionInput} key={index}>
                <InputBox
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] || ""}
                  required={field.required}
                  onChange={handleSectionChange}
                />
                {touched[field.name] && errors[field.name] && (
                  <div className={styles.Concession_Info_Section_concessionError}>{errors[field.name]}</div>
                )}
              </div>
            );
          }
          if (isConcessionWrittenField || isReasonField) {
            return null;
          }
          return (
            <div className={styles.Concession_Info_Section_concessionInput} key={index}>
              <InputBox
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                required={field.required}
                onChange={handleSectionChange}
              />
              {touched[field.name] && errors[field.name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[field.name]}</div>
              )}
            </div>
          );
        })}
        <div className={styles.Concession_Info_Section_yesnoSection}>
          <label>
            Concession Written on Application
            <Asterisk style={{ marginLeft: "4px" }} />
          </label>
          <div className={styles.Concession_Info_Section_yesnoButtons}>
            <MUIButton
              variant={values.concessionWritten === "yes" ? "contained" : "outlined"}
              className={styles.Concession_Info_Section_yes}
              onClick={() => setFieldValue("concessionWritten", "yes")}
            >
              Yes
            </MUIButton>
            <MUIButton
              variant={values.concessionWritten === "no" ? "contained" : "outlined"}
              className={styles.Concession_Info_Section_no}
              onClick={() => setFieldValue("concessionWritten", "no")}
            >
              No
            </MUIButton>
          </div>
          {touched.concessionWritten && errors.concessionWritten && (
            <div className={styles.Concession_Info_Section_concessionError}>{errors.concessionWritten}</div>
          )}
        </div>
        <div className={styles.Concession_Info_Section_dropdownSection}>
          <Dropdown
            dropdownname="Reason"
            name="reason"
            results={reasonOptions}
            value={values.reason || ""}
            onChange={(e) => setFieldValue("reason", e.target.value)}
            required={true}
          />
          {touched.reason && errors.reason && (
            <div className={styles.Concession_Info_Section_concessionError}>{errors.reason}</div>
          )}
        </div>
      </div>
      <div className={styles.Concession_Info_Section_proceedBtn}>
      <Button
            type="submit"
            variant="primary"
            onClick={handleNext}
            buttonname="Proceed to Add Address"
            righticon={<TrendingUpIcon/>}
       
          >
          </Button>
      </div>
    </div>
  );
};
export default ConcessionInfoSection;
 