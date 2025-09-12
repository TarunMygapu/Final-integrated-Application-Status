
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import InputBox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import { Button as MUIButton } from "@mui/material";
import Button from "../../Widgets/Button/Button";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import { ReactComponent as TrendingUpIcon } from "../../Asserts/ApplicationStatus/Trending up.svg";
import { ReactComponent as BackArrow } from "../../Asserts/ApplicationStatus/Backarrow.svg";
import { ReactComponent as PhoneIcon } from "../../Asserts/ApplicationStatus/PhoneIcon.svg";
import apiService from "../../Bakend/SaleFormapis";
import styles from "./ConcessionInfoSection.module.css";
import SkipIcon from "../../Asserts/ApplicationStatus/SkipIcon.svg";

// Validation schema for ConcessionInfoSection (base schema without mobileNumber validation)
const baseValidationSchema = Yup.object().shape({
  yearConcession1st: Yup.string()
    .matches(/^\d*$/, "Amount must be numeric")
    .notRequired(),
  yearConcession2nd: Yup.string()
    .matches(/^\d*$/, "Amount must be numeric")
    .notRequired(),
  yearConcession3rd: Yup.string()
    .matches(/^\d*$/, "Amount must be numeric")
    .notRequired(),
  givenBy: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
    is: (c1, c2, c3) => {
      const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      console.log("GivenBy validation check:", { c1, c2, c3, hasConcession });
      return hasConcession;
    },
    then: (schema) => schema.required("Given By is required when concession is applied"),
    otherwise: (schema) => schema.notRequired(),
  }),
  givenById: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
    is: (c1, c2, c3) => {
      const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      return hasConcession;
    },
    then: (schema) => schema.required("Given By is required when concession is applied"),
    otherwise: (schema) => schema.notRequired(),
  }),
  authorizedBy: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
    is: (c1, c2, c3) => {
      const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      console.log("AuthorizedBy validation check:", { c1, c2, c3, hasConcession });
      return hasConcession;
    },
    then: (schema) => schema.required("Authorized By is required when concession is applied"),
    otherwise: (schema) => schema.notRequired(),
  }),
  authorizedById: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
    is: (c1, c2, c3) => {
      const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      return hasConcession;
    },
    then: (schema) => schema.required("Authorized By is required when concession is applied"),
    otherwise: (schema) => schema.notRequired(),
  }),
  reason: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
    is: (c1, c2, c3) => {
      const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      console.log("Reason validation check:", { c1, c2, c3, hasConcession });
      return hasConcession;
    },
    then: (schema) => schema.required("Reason is required when concession is applied"),
    otherwise: (schema) => schema.notRequired(),
  }),
  concessionReasonId: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
    is: (c1, c2, c3) => {
      const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      return hasConcession;
    },
    then: (schema) => schema.required("Reason is required when concession is applied"),
    otherwise: (schema) => schema.notRequired(),
  }),
  additionalConcession: Yup.boolean(),
  concessionAmount: Yup.string()
    .matches(/^\d*$/, "Amount must be numeric")
    .when("additionalConcession", {
      is: true,
      then: (schema) => schema.required("Concession Amount is required when additional concession is selected"),
    }),
  concessionWrittenBy: Yup.string().when("additionalConcession", {
    is: true,
    then: (schema) => schema.required("Concession Written By is required when additional concession is selected"),
  }),
  concessionWrittenById: Yup.string().when("additionalConcession", {
    is: true,
    then: (schema) => schema.required("Concession Written By is required when additional concession is selected"),
  }),
  additionalReason: Yup.string().when("additionalConcession", {
    is: true,
    then: (schema) => schema.required("Reason is required when additional concession is selected"),
  }),
});

// Custom validation function to handle mobileNumber conditionally
const customValidate = (values, showMobileNumber) => {
  const errors = {};
  if (showMobileNumber) {
    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(values.mobileNumber)) {
      errors.mobileNumber = "Mobile Number must be exactly 10 digits";
    }
  }
  return errors;
};

const ConcessionInfoSection = ({
  handleNext,
  handleBack,
  setCouponDetails,
  onCouponSubmit,
  handleChange,
  setFieldValue,
  setFieldTouched,
  setActiveStep,
  values,
  errors,
  touched,
  validateForm,
}) => {
  const [reasonOptions, setReasonOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    reasons: true,
    employees: true,
  });
  const [error, setError] = useState(null);
  const [showMobileNumber, setShowMobileNumber] = useState(false);
  const [persistentErrors, setPersistentErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 Starting to fetch concession dropdown options from API...");
      
      try {
        // Fetch both APIs in parallel
        const [authorizedByData, concessionReasonData] = await Promise.all([
          apiService.fetchAuthorizedByAll(),
          apiService.fetchConcessionReasonAll(),
        ]);

        console.log("Authorized by data:", authorizedByData);
        console.log("Concession reason data:", concessionReasonData);

        // Process authorized by data (for givenBy, authorizedBy, concessionWrittenBy)
        let authorizedByArray = [];
        if (Array.isArray(authorizedByData)) {
          authorizedByArray = authorizedByData;
        } else if (authorizedByData && typeof authorizedByData === 'object') {
          authorizedByArray = [authorizedByData];
        }

        const processedAuthorizedBy = authorizedByArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: item.name || "",
          }));

        // Process concession reason data
        let concessionReasonArray = [];
        if (Array.isArray(concessionReasonData)) {
          concessionReasonArray = concessionReasonData;
        } else if (concessionReasonData && typeof concessionReasonData === 'object') {
          concessionReasonArray = [concessionReasonData];
        }

        const processedConcessionReasons = concessionReasonArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: item.name || "",
          }));

        // Set the options
        setEmployeeOptions(processedAuthorizedBy);
        setReasonOptions(processedConcessionReasons);

        // Update loading states
        setLoadingStates({
          reasons: false,
          employees: false,
        });

        console.log("✅ Loaded authorized by:", processedAuthorizedBy);
        console.log("✅ Loaded concession reasons:", processedConcessionReasons);
      } catch (error) {
        console.error("❌ Error fetching concession data:", error);
        setLoadingStates({
          reasons: false,
          employees: false,
        });
      }
    };
    
    fetchData();
  }, []);

  // Trigger validation when concession amounts change
  useEffect(() => {
    const hasConcession = [values.yearConcession1st, values.yearConcession2nd, values.yearConcession3rd]
      .some((v) => v && v.toString().trim() !== "" && Number(v) > 0);

    if (hasConcession) {
      // Set persistent errors for all required fields when concession is entered
      setPersistentErrors({
        givenBy: "Given By is required when concession is applied",
        givenById: "Given By is required when concession is applied",
        authorizedBy: "Authorized By is required when concession is applied",
        authorizedById: "Authorized By is required when concession is applied",
        reason: "Reason is required when concession is applied",
        concessionReasonId: "Reason is required when concession is applied"
      });
      
      // Mark all concession-related fields as touched to show validation errors
      setFieldTouched("givenBy", true);
      setFieldTouched("givenById", true);
      setFieldTouched("authorizedBy", true);
      setFieldTouched("authorizedById", true);
      setFieldTouched("reason", true);
      setFieldTouched("concessionReasonId", true);
    } else {
      // Clear all concession-related fields when no concession amount is entered
      console.log("🧹 useEffect: Clearing all concession fields as no concession amount is entered");
      setFieldValue("givenBy", "");
      setFieldValue("givenById", "");
      setFieldValue("authorizedBy", "");
      setFieldValue("authorizedById", "");
      setFieldValue("reason", "");
      setFieldValue("concessionReasonId", "");
      setFieldValue("concessionWrittenBy", "");
      setFieldValue("concessionWrittenById", "");
      setFieldValue("additionalReason", "");
      setFieldValue("concessionAmount", "");
      setFieldValue("additionalConcession", false);
      
      // Clear touched state and persistent errors for these fields
      setFieldTouched("givenBy", false);
      setFieldTouched("givenById", false);
      setFieldTouched("authorizedBy", false);
      setFieldTouched("authorizedById", false);
      setFieldTouched("reason", false);
      setFieldTouched("concessionReasonId", false);
      setFieldTouched("concessionWrittenBy", false);
      setFieldTouched("concessionWrittenById", false);
      setFieldTouched("additionalReason", false);
      setFieldTouched("concessionAmount", false);
      setFieldTouched("additionalConcession", false);
      
      // Clear persistent errors
      setPersistentErrors({});
    }
  }, [values.yearConcession1st, values.yearConcession2nd, values.yearConcession3rd, setFieldTouched, setFieldValue]);

  const flatfields = [
    { label: "Mobile Number", name: "mobileNumber", placeholder: "Enter Mobile Number", required: true },
    { label: "1st Year Concession", name: "yearConcession1st", placeholder: "Enter 1st Year Concession" },
    { label: "2nd Year Concession", name: "yearConcession2nd", placeholder: "Enter 2nd Year Concession" },
    { label: "3rd Year Concession", name: "yearConcession3rd", placeholder: "Enter 3rd Year Concession" },
    { label: "Given By", name: "givenBy", type: "select", options: employeeOptions, required: true },
    { label: "Description", name: "description", placeholder: "Enter Description" },
    { label: "Authorized By", name: "authorizedBy", type: "select", options: employeeOptions, required: true },
    { label: "Reason", name: "reason", type: "select", options: reasonOptions, required: true },
    { label: "Concession Amount", name: "concessionAmount", placeholder: "Enter Concession amount" },
    { label: "Concession Written By", name: "concessionWrittenBy", type: "select", options: employeeOptions },
    { label: "Reason", name: "additionalReason", placeholder: "Enter Reason" },
  ];

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd", "concessionAmount"].includes(name)) {
      finalValue = value.replace(/\D/g, '');
    } else if (["description", "additionalReason"].includes(name)) {
      finalValue = value.replace(/[^a-zA-Z\s\.\-]/g, '');
    } else if (name === "mobileNumber") {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFieldValue(name, finalValue);
    setFieldTouched(name, true);
    
    // Handle concession amount changes
    if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(name)) {
      // Get all concession amounts including the current change
      const allConcessionAmounts = [
        name === "yearConcession1st" ? finalValue : values.yearConcession1st,
        name === "yearConcession2nd" ? finalValue : values.yearConcession2nd,
        name === "yearConcession3rd" ? finalValue : values.yearConcession3rd
      ];
      
      const hasConcession = allConcessionAmounts.some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
      
      if (hasConcession) {
        // Only mark fields as touched to show validation errors, don't clear them
        setFieldTouched("givenBy", true);
        setFieldTouched("givenById", true);
        setFieldTouched("authorizedBy", true);
        setFieldTouched("authorizedById", true);
        setFieldTouched("reason", true);
        setFieldTouched("concessionReasonId", true);
      } else {
        // Clear all concession-related fields when no concession amount is entered
        console.log("🧹 Clearing all concession fields as no concession amount is entered");
        setFieldValue("givenBy", "");
        setFieldValue("givenById", "");
        setFieldValue("authorizedBy", "");
        setFieldValue("authorizedById", "");
        setFieldValue("reason", "");
        setFieldValue("concessionReasonId", "");
        setFieldValue("concessionWrittenBy", "");
        setFieldValue("concessionWrittenById", "");
        setFieldValue("additionalReason", "");
        setFieldValue("concessionAmount", "");
        setFieldValue("additionalConcession", false);
        
        // Clear touched state for these fields
        setFieldTouched("givenBy", false);
        setFieldTouched("givenById", false);
        setFieldTouched("authorizedBy", false);
        setFieldTouched("authorizedById", false);
        setFieldTouched("reason", false);
        setFieldTouched("concessionReasonId", false);
        setFieldTouched("concessionWrittenBy", false);
        setFieldTouched("concessionWrittenById", false);
        setFieldTouched("additionalReason", false);
        setFieldTouched("concessionAmount", false);
        setFieldTouched("additionalConcession", false);
      }
    }
    
    // Show mobileNumber row when typing in coupon field
    if (name === "coupon" && finalValue.trim() !== "") {
      setShowMobileNumber(true);
    }
  };

  const handleEmployeeChange = (name) => (e) => {
    const selectedLabel = e.target.value;
    const selectedEmployee = employeeOptions.find((opt) => opt.label === selectedLabel);
    console.log(`🎯 handleEmployeeChange for ${name}:`, { selectedLabel, selectedEmployee });
    
    setFieldValue(name, selectedLabel || '');
    setFieldValue(`${name}Id`, selectedEmployee ? String(selectedEmployee.value) : '');
    setFieldTouched(name, true);
    setFieldTouched(`${name}Id`, true);
    
    // Clear persistent error only for this specific field
    if (selectedLabel && selectedLabel.trim() !== '') {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors[`${name}Id`];
        console.log(`✅ Cleared persistent errors for ${name} and ${name}Id`);
        return newErrors;
      });
    }
  };

  const handleReasonChange = (e) => {
    const selectedLabel = e.target.value;
    const selectedReason = reasonOptions.find((opt) => opt.label === selectedLabel);
    console.log(`🎯 handleReasonChange:`, { selectedLabel, selectedReason });
    
    setFieldValue("reason", selectedLabel || '');
    setFieldValue("concessionReasonId", selectedReason ? String(selectedReason.value) : '');
    setFieldTouched("reason", true);
    setFieldTouched("concessionReasonId", true);
    
    // Clear persistent error only for this specific field
    if (selectedLabel && selectedLabel.trim() !== '') {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors["reason"];
        delete newErrors["concessionReasonId"];
        console.log(`✅ Cleared persistent errors for reason and concessionReasonId`);
        return newErrors;
      });
    }
  };

  const handleApplyCoupon = () => {
    setCouponDetails({ mobile: values.mobileNumber || "", code: values.coupon || "" });
    onCouponSubmit();
  };

  const handleSubmit = async () => {
    console.log("=== Validation Debug ===");
    console.log("Current values:", values);
    console.log("Concession amounts:", {
      yearConcession1st: values.yearConcession1st,
      yearConcession2nd: values.yearConcession2nd,
      yearConcession3rd: values.yearConcession3rd
    });
    console.log("Dropdown values:", {
      givenBy: values.givenBy,
      givenById: values.givenById,
      authorizedBy: values.authorizedBy,
      authorizedById: values.authorizedById,
      reason: values.reason,
      concessionReasonId: values.concessionReasonId
    });
    
    // Log complete form data object
    console.log("🚀 ===== CONCESSION - FINAL SUBMITTING OBJECT =====");
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
    console.log("🚀 ===== END CONCESSION OBJECT =====");
    
    const errors = await validateForm();
    console.log("Validation errors:", errors);
    
    const touchedFields = Object.keys(errors).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setFieldTouched(touchedFields);
    
    if (Object.keys(errors).length === 0) {
      handleNext();
    } else {
      console.log("Validation failed, errors:", errors);
    }
  };

  // Form is now always rendered, dropdowns load in background
  if (error) {
    return <div className={styles.Concession_Info_Section_error}>{error}</div>;
  }

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
      <div className={styles.Concession_Info_Section_concessionsFields}>
        {showMobileNumber && (
          <>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <div className={styles.ConcessioninputWithIconWrapper}>
                <InputBox
                  label={flatfields[0].label}
                  name={flatfields[0].name}
                  placeholder={flatfields[0].placeholder}
                  value={values[flatfields[0].name] || ""}
                  required={flatfields[0].required}
                  onChange={handleSectionChange}
                />
                <PhoneIcon className={styles.ConcessioninputWithIcon} />
              </div>
              {touched[flatfields[0].name] && errors[flatfields[0].name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[0].name]}</div>
              )}
            </div>
            <div className={styles.Concession_Info_Section_emptyField}></div>
            <div className={styles.Concession_Info_Section_emptyField}></div>
          </>
        )}
        {flatfields.slice(1, 8).map((field, index) => (
          <div
            key={index + 1}
            className={styles.Concession_Info_Section_concessionInput}
          >
            {field.type === "select" ? (
              <Dropdown
                dropdownname={field.label}
                name={field.name}
                results={field.options?.map((opt) => opt.label) || []}
                value={values[field.name] || ""}
                onChange={field.name.includes("givenBy") || field.name.includes("authorizedBy")
                  ? handleEmployeeChange(field.name)
                  : field.name === "reason"
                  ? handleReasonChange
                  : handleSectionChange}
                required={field.required}
                disabled={field.name === "reason" ? loadingStates.reasons : loadingStates.employees}
                loading={field.name === "reason" ? loadingStates.reasons : loadingStates.employees}
              />
            ) : (
              <InputBox
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                required={field.required}
                onChange={handleSectionChange}
              />
            )}
            {(touched[field.name] && (errors[field.name] || errors[`${field.name}Id`])) || persistentErrors[field.name] || persistentErrors[`${field.name}Id`] ? (
              <div className={styles.Concession_Info_Section_concessionError}>
                {errors[field.name] || errors[`${field.name}Id`] || persistentErrors[field.name] || persistentErrors[`${field.name}Id`]}
              </div>
            ) : null}
          </div>
        ))}
        <div className={styles.Concession_Info_Section_emptyField}></div>
        <div className={styles.Concession_Info_Section_emptyField}></div>
        <div className={styles.Concession_Info_Section_extraConcession}>
          <label className={styles.ConcessionInfoSection_squareCheckbox}>
            <input
              type="checkbox"
              name="additionalConcession"
              checked={values.additionalConcession || false}
              onChange={(e) => setFieldValue("additionalConcession", e.target.checked)}
            />
            <span className={styles.ConcessionInfoSection_checkmark}></span>
            Additional Concession Written on Application
          </label>
          <div className={styles.line}></div>
        </div>
        {values.additionalConcession && (
          <>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <InputBox
                label={flatfields[8].label}
                name={flatfields[8].name}
                placeholder={flatfields[8].placeholder}
                value={values[flatfields[8].name] || ""}
                required={true}
                onChange={handleSectionChange}
              />
              {touched[flatfields[8].name] && errors[flatfields[8].name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[8].name]}</div>
              )}
            </div>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <Dropdown
                dropdownname={flatfields[9].label}
                name={flatfields[9].name}
                results={flatfields[9].options?.map((opt) => opt.label) || []}
                value={values[flatfields[9].name] || ""}
                onChange={handleEmployeeChange(flatfields[9].name)}
                required={true}
                disabled={loadingStates.employees}
                loading={loadingStates.employees}
              />
              {(touched[flatfields[9].name] && (errors[flatfields[9].name] || errors[`${flatfields[9].name}Id`])) || persistentErrors[flatfields[9].name] || persistentErrors[`${flatfields[9].name}Id`] ? (
                <div className={styles.Concession_Info_Section_concessionError}>
                  {errors[flatfields[9].name] || errors[`${flatfields[9].name}Id`] || persistentErrors[flatfields[9].name] || persistentErrors[`${flatfields[9].name}Id`]}
                </div>
              ) : null}
            </div>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <InputBox
                label={flatfields[10].label}
                name={flatfields[10].name}
                placeholder={flatfields[10].placeholder}
                value={values[flatfields[10].name] || ""}
                required={true}
                onChange={handleSectionChange}
              />
              {touched[flatfields[10].name] && errors[flatfields[10].name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[10].name]}</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className={styles.Concession_Info_Section_buttonRow}>
        <Button
          type="button"
          variant="secondary"
          buttonname="Back"
          lefticon={<BackArrow />}
          onClick={handleBack}
          width={"100%"}
        />
        <Button
          type="button"
          variant="primary"
          buttonname="Proceed To Add Address"
          righticon={<TrendingUpIcon />}
          onClick={handleSubmit}
        />
      </div>
      <a
        href="#"
        className={styles.concessionLinkButton}
        onClick={async (e) => {
          e.preventDefault();
          
          // Log complete form data object for skip to payments
          console.log("🚀 ===== CONCESSION SKIP TO PAYMENTS - FINAL SUBMITTING OBJECT =====");
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
          console.log("🚀 ===== END CONCESSION SKIP TO PAYMENTS OBJECT =====");
          
          const errors = await validateForm();
          const touchedFields = Object.keys(errors).reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {});
          setFieldTouched(touchedFields);
          if (Object.keys(errors).length === 0) {
            setActiveStep && setActiveStep(3);
          } else {
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
  );
};

// Create the final validation schema that combines base schema with custom validation
const concessionValidationSchema = baseValidationSchema;

ConcessionInfoSection.validationSchema = concessionValidationSchema;

export default ConcessionInfoSection;
