import React, { useState } from "react";
import { FieldArray } from "formik";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import { Button as MuiButton } from "@mui/material";
// import Button from "@mui/material";
import Button from "../../Widgets/Button/Button"
import {ReactComponent as Add} from "../../Asserts/ApplicationStatus/si_add-fill.svg";
import {ReactComponent as TrendingUpIcon} from "../../Asserts/ApplicationStatus/Trending up.svg";
import CashIcon from "../../Asserts/ApplicationStatus/Cash (1).svg";
import DDIcon from "../../Asserts/ApplicationStatus/DD (1).svg";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import * as Yup from "yup";
import styles from "./GeneralInfoSection.module.css";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
const siblingValidationSchema = Yup.object().shape({
  siblingInformation: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string()
        .required("Full Name is required")
        .matches(/^[a-zA-Z\s]*$/, "Full Name can only contain letters and spaces"),
      relationType: Yup.string().required("Relation Type is required"),
      class: Yup.string().required("Class is required"),
      schoolName: Yup.string().required("School Name is required"),
      gender: Yup.string().required("Gender is required"),
    })
  ),
});
const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  siblingInformation: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string()
        .required("Full Name is required")
        .matches(/^[a-zA-Z\s]*$/, "Full Name can only contain letters and spaces"),
      relationType: Yup.string().required("Relation Type is required"),
      class: Yup.string().required("Class is required"),
      schoolName: Yup.string().required("School Name is required"),
      gender: Yup.string().required("Gender is required"),
    })
  ),
});
const GeneralInfoSection = ({
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
}) => {
  const [showSiblings, setShowSiblings] = useState(false);
  const flatfields = [
    { label: "Category", name: "category", type: "radio", options: ["SSC", "Other"], required: true },
    { label: "HT No", name: "htNo", placeholder: "Enter HT No", required: true },
    { label: "Aadhaar Card No", name: "aadhaar", placeholder: "Enter 12 digits only", required: true },
    { label: "App Type", name: "appType", type: "select", options: ["Camp"], required: true },
    { label: "App Fee", name: "appFee", placeholder: "Enter Fee Details" },
    { label: "Surname", name: "surname", placeholder: "Enter Surname" ,required: true },
    { label: "Student Name", name: "studentName", placeholder: "Enter Name", required: true },
    { label: "Father Name", name: "fatherName", placeholder: "Enter Father Name" ,required: true },
    { label: "Occupation", name: "occupation", placeholder: "Enter Occupation" },
    { label: "Phone Number", name: "phoneNumber", placeholder: "Enter Phone (10 digits only)", required: true },
    { label: "Student Type", name: "studentType", type: "select", options: ["Regular", "Private", "Distance"], required: true },
    { label: "Date of Birth", name: "dob", type: "date", required: true },
    { label: "Gender", name: "gender", type: "radio", options: ["Male", "Female"], required: true },
    { label: "Joined Campus", name: "joinedCampus", type: "select", options: ["Hyderabad", "Bangalore", "Chennai"], required: true },
    { label: "City", name: "city", type: "select", options: ["Hyderabad", "Bangalore", "Chennai"], required: true },
    { label: "Join Into", name: "joinInto", type: "select", options: ["10th", "Intermediate", "Degree"], required: true },
    { label: "Course", name: "course", type: "select", options: ["Maths", "Science", "Commerce"], required: true },
    { label: "Course Batch", name: "courseBatch", type: "select", options: ["Morning", "Evening"], required: true },
    { label: "Course Dates", name: "courseDates", type: "date", required: true },
    { label: "Fee", name: "fee", placeholder: "Enter Fee Details" },
    { label: "School State", name: "schoolState", type: "select", options: ["Telangana", "AP", "Karnataka"], required: true },
    { label: "School District", name: "schoolDistrict", type: "select", options: ["Hyderabad", "Vizag", "Bangalore"], required: true },
    { label: "School Type", name: "schoolType", type: "select", options: ["SSC", "CBSE", "ICSE"], required: true },
    { label: "School Name", name: "schoolName", placeholder: "Enter School Name" },
    { label: "Total Fee", name: "totalFee", placeholder: "Total Fee", disabled: true },
    { label: "Additional Course Fee", name: "additionalCourseFee", placeholder: "Enter Fee Details" },
    { label: "Score App No", name: "scoreAppNo", placeholder: "Enter Score App No" },
    { label: "Marks", name: "marks", placeholder: "Enter Marks Details" ,required: true },
    { label: "Admission Referred By", name: "admissionReferredBy", placeholder: "Enter Name" },
    { label: "Quota", name: "quota", type: "select", options: ["", "SC", "ST", "BC", "OC"] },
    { label: "Food Prefrence", name: "foodprefrence", type: "select", options: [ "Veg", "Non Veg","Other"] },
    { label: "Sibling Information", name: "siblingInformation", type: "custom" },
  ];
  const categoryField = flatfields.find((field) => field.name === "category");
  const nonCategoryFields = flatfields.filter((field) => field.name !== "category" && field.name !== "siblingInformation");
  const siblingField = flatfields.find((field) => field.name === "siblingInformation");
  const groupedRows = [];
  for (let i = 0; i < nonCategoryFields.length; i += 3) {
    groupedRows.push(nonCategoryFields.slice(i, i + 3));
  }
  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (["htNo", "appFee", "fee", "additionalCourseFee", "scoreAppNo", "marks", "aadhaar", "phoneNumber"].includes(name)) {
      finalValue = value.replace(/\D/g, '');
      if (name === "aadhaar" && finalValue.length > 12) {
        finalValue = finalValue.slice(0, 12);
      } else if (name === "phoneNumber" && finalValue.length > 10) {
        finalValue = finalValue.slice(0, 10);
      }
    } else if (["studentName", "schoolName", "surname", "fatherName", "occupation", "admissionReferredBy"].includes(name) ||
      name.endsWith('.fullName') || name.endsWith('.schoolName')) {
      finalValue = value.replace(/[^a-zA-Z\s\.\-]/g, '');
    }
    setFieldValue(name, finalValue);
    if (["appFee", "fee", "additionalCourseFee"].includes(name)) {
      const fees = {
        appFee: name === "appFee" ? Number(finalValue) : Number(values.appFee || 0),
        fee: name === "fee" ? Number(finalValue) : Number(values.fee || 0),
        additionalCourseFee: name === "additionalCourseFee" ? Number(finalValue) : Number(values.additionalCourseFee || 0),
      };
      const total = fees.appFee + fees.fee + fees.additionalCourseFee;
      setFieldValue("totalFee", total.toString());
    }
  };
  const addSibling = (push) => {
    push({
      fullName: "",
      relationType: "",
      class: "",
      schoolName: "",
      gender: "",
    });
  };
  return (
    <div className={styles.General_Info_Section_general_form_section}>
      <div className={styles.General_Info_Section_general_section_box}>
        <div className={styles.General_Info_Section_general_form_grid}>
          {/* Category */}
          <div className={styles.General_Info_Section_general_form_row}>
            {categoryField ? (
              <div className={styles.General_Info_Section_general_category_container}>
                <div className={styles.General_Info_Section_general_field_label_wrapper}>
                  <span className={styles.General_Info_Section_general_field_label}>
                    {categoryField.label}
                    {categoryField.required && <Asterisk style={{ marginLeft: "4px" }} />}
                  </span>
                  <div className={styles.General_Info_Section_general_line}></div>
                </div>
                <div className={styles.General_Info_Section_general_category_options}>
                  {categoryField.options.map((option, i) => (
                    <label
                      key={i}
                      className={
                        styles.General_Info_Section_general_category_label_wrapper
                      }
                    >
                      <input
                        type="radio"
                        name={categoryField.name}
                        value={option}
                        checked={values[categoryField.name] === option}
                        onChange={() => setFieldValue(categoryField.name, option)}
                        className={
                          styles.General_Info_Section_general_category_radio
                        }
                      />
                      <span
                        className={`${styles.General_Info_Section_general_category_label} ${
                          values[categoryField.name] === option
                            ? styles.General_Info_Section_general_category_active
                            : ""
                        }`}
                        onClick={() => setFieldValue(categoryField.name, option)}
                      >
                        <span
                          className={
                            styles.General_Info_Section_general_category_text_with_icon
                          }
                        >
                          {option === "SSC" && (
                            <figure
                              className={
                                styles.General_Info_Section_general_category_icon
                              }
                            >
                              <img
                                src={CashIcon}
                                alt="cash-icon"
                                style={{ width: "18px", height: "18px" }}
                              />
                            </figure>
                          )}
                          {option === "Other" && (
                            <figure
                              className={
                                styles.General_Info_Section_general_category_icon
                              }
                            >
                              <img
                                src={DDIcon}
                                alt="dd-icon"
                                style={{ width: "18px", height: "18px" }}
                              />
                            </figure>
                          )}
                          {option}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {touched[categoryField.name] && errors[categoryField.name] && (
                  <div className={styles.General_Info_Section_general_error}>
                    {errors[categoryField.name]}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={styles.General_Info_Section_general_empty_field}
              ></div>
            )}
            <div className={styles.General_Info_Section_general_empty_field}></div>
            <div className={styles.General_Info_Section_general_empty_field}></div>
          </div>
          {/* Other Fields */}
          {groupedRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.General_Info_Section_general_form_row}
            >
              {row.map((field, index) => {
                if (field.name === "foodprefrence" && !showSiblings) {
                  // Render camp field and Add Sibling button in sequence
                  return [
                    <div
                      key={index}
                      className={styles.General_Info_Section_general_form_field}
                    >
                      <Dropdown
                        dropdownname={field.label}
                        name={field.name}
                        results={field.options}
                        value={values[field.name] || ""}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                        error={touched[field.name] && errors[field.name]}
                        required={field.required}
                      />
                      {touched[field.name] && errors[field.name] && (
                        <div className={styles.General_Info_Section_general_error}>
                          {errors[field.name]}
                        </div>
                      )}
                    </div>,
                    <div key="add-sibling-btn" className={styles.General_Info_Section_general_form_field}>
                      <Button
                        type="button"
                        variant="secondary"
                        buttonname="Add Sibling"
                        righticon={<Add />}
                        width={"50%"}
                        className={styles.addSiblingBtn}
                        onClick={() => {
                          setShowSiblings(true);
                          if (!values.siblingInformation?.length) {
                            setFieldValue("siblingInformation", [
                              {
                                fullName: "",
                                relationType: "",
                                class: "",
                                schoolName: "",
                                gender: "",
                              },
                            ]);
                          }
                        }}
                      />
                    </div>
                  ];
                }
                // Default rendering for all other fields
                if (field.type === "select") {
                  return (
                    <div
                      key={index}
                      className={styles.General_Info_Section_general_form_field}
                    >
                      <Dropdown
                        dropdownname={field.label}
                        name={field.name}
                        results={field.options}
                        value={values[field.name] || ""}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                        error={touched[field.name] && errors[field.name]}
                        required={field.required}
                      />
                      {touched[field.name] && errors[field.name] && (
                        <div className={styles.General_Info_Section_general_error}>
                          {errors[field.name]}
                        </div>
                      )}
                    </div>
                  );
                } else if (field.type === "radio" && field.name === "gender") {
                  return (
                    <div
                      key={index}
                      className={styles.General_Info_Section_general_gender_container}
                    >
                      <div className={styles.General_Info_Section_general_field_label_wrapper}>
                        <span className={styles.General_Info_Section_general_field_label}>
                          {field.label}
                          {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
                        </span>
                      </div>
                      <div className={styles.General_Info_Section_general_gender_options}>
                        {field.options.map((option, i) => (
                          <label
                            key={i}
                            className={styles.General_Info_Section_general_gender_label_wrapper}
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={option}
                              checked={values[field.name] === option}
                              onChange={() => setFieldValue(field.name, option)}
                              className={styles.General_Info_Section_general_gender_radio}
                            />
                            <span
                              className={`${styles.General_Info_Section_general_gender_label} ${
                                values[field.name] === option
                                  ? styles.General_Info_Section_general_gender_active
                                  : ""
                              }`}
                              onClick={() => setFieldValue(field.name, option)}
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                      {touched[field.name] && errors[field.name] && (
                        <div className={styles.General_Info_Section_general_error}>
                          {errors[field.name]}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className={styles.General_Info_Section_general_form_field}
                    >
                      <Inputbox
                        label={field.label}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={values[field.name] || ""}
                        onChange={handleSectionChange}
                        type={field.type || "text"}
                        error={touched[field.name] && errors[field.name]}
                        required={field.required}
                        disabled={field.disabled || false}
                      />
                      {touched[field.name] && errors[field.name] && (
                        <div className={styles.General_Info_Section_general_error}>
                          {errors[field.name]}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }, (_, padIndex) => (
                  <div
                    key={`pad-${rowIndex}-${padIndex}`}
                    className={styles.General_Info_Section_general_empty_field}
                  ></div>
                ))}
            </div>
          ))}
          {/* Sibling Section */}
          {siblingField && (
            <div
              key="sibling"
              className={styles.General_Info_Section_general_form_row}
            >
              <div
                className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}
              >
                {/* Sibling Information - Only show when showSiblings is true */}
                {showSiblings && (
                  <div className={styles.siblingContainer}>
                    <div
                      className={styles.General_Info_Section_general_field_label_wrapper}
                    >
                      <span
                        className={styles.General_Info_Section_general_field_label}
                      >
                        Sibling Information
                      </span>
                      <div
                        className={styles.General_Info_Section_general_line}
                      ></div>
                    </div>
                    <FieldArray
                      name="siblingInformation"
                      render={({ push, remove }) => (
                        <div>
                          {values.siblingInformation && values.siblingInformation.length > 0 ? (
                            values.siblingInformation.map((sibling, i) => (
                              <div key={i} className={styles.siblingBox}>
                                <div className={styles.siblingHeader}>
                                  <span className={styles.siblingTag}>Sibling {i + 1}</span>
                                  <div className={styles.actionBtns}>
                                    <MuiButton
                                      type="button"
                                      className={styles.clearBtn}
                                      onClick={() =>
                                        setFieldValue(`siblingInformation.${i}`, {
                                          fullName: "",
                                          relationType: "",
                                          class: "",
                                          schoolName: "",
                                          gender: "",
                                        })
                                      }
                                    >
                                      Clear
                                    </MuiButton>
                                    <MuiButton
                                      type="button"
                                      className={styles.closeBtn}
                                      onClick={() => remove(i)}
                                    >
                                      ✕
                                    </MuiButton>
                                  </div>
                                </div>
                                <div className={styles.siblingFields}>
                                 
                                    <Inputbox
                                      label="Full Name"
                                      name={`siblingInformation.${i}.fullName`}
                                      placeholder="Enter Full Name"
                                      value={sibling.fullName}
                                      onChange={handleSectionChange}
                                      error={
                                        touched.siblingInformation?.[i]?.fullName &&
                                        errors.siblingInformation?.[i]?.fullName
                                      }
                                    />
                                    <Dropdown
                                      dropdownname="Relation Type"
                                      name={`siblingInformation.${i}.relationType`}
                                      results={["Brother", "Sister", "Other"]}
                                      value={sibling.relationType}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `siblingInformation.${i}.relationType`,
                                          e.target.value
                                        )
                                      }
                                      error={
                                        touched.siblingInformation?.[i]?.relationType &&
                                        errors.siblingInformation?.[i]?.relationType
                                      }
                                    />
                               
                                 
                                    <Dropdown
                                      dropdownname="Select Class"
                                      name={`siblingInformation.${i}.class`}
                                      results={["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]}
                                      value={sibling.class}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `siblingInformation.${i}.class`,
                                          e.target.value
                                        )
                                      }
                                      error={
                                        touched.siblingInformation?.[i]?.class &&
                                        errors.siblingInformation?.[i]?.class
                                      }
                                    />
                                    <Dropdown
                                      dropdownname="Gender"
                                      name={`siblingInformation.${i}.gender`}
                                      results={["Male", "Female"]}
                                      value={sibling.gender}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `siblingInformation.${i}.gender`,
                                          e.target.value
                                        )
                                      }
                                      error={
                                        touched.siblingInformation?.[i]?.gender &&
                                        errors.siblingInformation?.[i]?.gender
                                      }
                                    />
                               
                                  <div className={styles.siblingFieldRow}>
                                    <Inputbox
                                      label="School Name"
                                      name={`siblingInformation.${i}.schoolName`}
                                      placeholder="Enter School Name"
                                      value={sibling.schoolName}
                                      onChange={handleSectionChange}
                                      error={
                                        touched.siblingInformation?.[i]?.schoolName &&
                                        errors.siblingInformation?.[i]?.schoolName
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                         
                          {/* Action Buttons */}
                          <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                            <Button
                              type="button"
                              variant="secondary"
                              buttonname="Add Another Sibling"
                              righticon={<Add />}
                              className={styles.addSiblingBtn}
                              onClick={() => addSibling(push)}
                            />
                            {/* {values.siblingInformation?.length > 1 && (
                              <Button
                                type="button"
                                variant="secondary"
                                buttonname="Remove All"
                                onClick={() => {
                                  setFieldValue("siblingInformation", []);
                                  setShowSiblings(false);
                                }}
                                style={{ backgroundColor: "#ef4444", color: "white", border: "1px solid #ef4444" }}
                              />
                            )} */}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
              <div
                className={styles.General_Info_Section_general_empty_field}
              ></div>
              <div
                className={styles.General_Info_Section_general_empty_field}
              ></div>
            </div>
          )}
        </div>
        <div
          className={styles.General_Info_Section_general_form_actions}
          style={{ justifyContent: "center", marginTop: "20px" }}
        >
          <Button
            type="submit"
            variant="primary"
            onClick={handleNext}
            buttonname="Proceed to Add Concession"
            righticon={<TrendingUpIcon/>}
       
          >
          </Button>
        </div>
      </div>
    </div>
  );
};
export default GeneralInfoSection;