import React from "react";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
// import { Button } from "@mui/material";
import Button from "../../Widgets/Button/Button";
import {ReactComponent as TrendingUpIcon} from "../../Asserts/ApplicationStatus/Trending up.svg";
import styles from "./AddressInfoSection.module.css";
const AddressInfoSection = ({
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
  const flatfields = [
    { label: "Door No", name: "doorNo", placeholder: "Enter Door No", required: true },
    { label: "Street", name: "street", placeholder: "Enter Street", required: true },
    { label: "Landmark", name: "landmark", placeholder: "Enter Landmark" },
    { label: "Area", name: "area", placeholder: "Enter Area", required: true },
    { label: "City", name: "city", type: "select", options: ["Hyderabad", "Vizag", "Bangalore"], required: true },
    { label: "District", name: "district", type: "select", options: ["Hyderabad", "Vizag", "Bangalore"], required: true },
    { label: "Mandal", name: "mandal", type: "select", options: ["Hyderabad", "Vizag", "Bangalore"], required: true },
    { label: "Pincode", name: "pincode", placeholder: "Enter Pincode", required: true },
  ];
  const groupedFields = [];
  for (let i = 0; i < flatfields.length; i += 3) {
    groupedFields.push(flatfields.slice(i, i + 3));
  }
  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "pincode") {
      finalValue = value.replace(/\D/g, '').slice(0, 6);
    }
    setFieldValue(name, finalValue);
  };
  return (
    <div className={styles.Address_Info_Section_address_form_section}>
      <div className={styles.Address_Info_Section_address_section_box}>
        <div className={styles.Address_Info_Section_address_form_grid}>
          {groupedFields.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.Address_Info_Section_address_form_row}>
              {row.map((field, index) => (
                <div key={index} className={styles.Address_Info_Section_address_form_field}>
                  {field.type === "select" ? (
                    <Dropdown
                      dropdownname={field.label}
                      name={field.name}
                      results={field.options}
                      value={values[field.name] || ""}
                      onChange={(e) => setFieldValue(field.name, e.target.value)}
                      error={touched[field.name] && errors[field.name]}
                      required={field.required}
                    />
                  ) : (
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
                    />
                  )}
                  {touched[field.name] && errors[field.name] && (
                    <div className={styles.Address_Info_Section_address_error}>{errors[field.name]}</div>
                  )}
                </div>
              ))}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, padIndex) => (
                  <div key={`pad-${rowIndex}-${padIndex}`} className={styles.Address_Info_Section_address_empty_field}></div>
                ))}
            </div>
          ))}
        </div>
        <div className={styles.Address_Info_Section_address_form_actions} style={{ display: "flex", justifyContent: "center" }}>
        <Button
            type="submit"
            variant="primary"
            onClick={handleNext}
            buttonname="Proceed to Add Payment Info"
            righticon={<TrendingUpIcon/>}
       
          >
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddressInfoSection;
 
 