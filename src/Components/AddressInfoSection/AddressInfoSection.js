import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import Button from "../../Widgets/Button/Button";
import SearchBox from "../../Widgets/SearchBox/SearchBox";
import { ReactComponent as TrendingUpIcon } from "../../Asserts/ApplicationStatus/Trending up.svg";
import { ReactComponent as BackArrow } from "../../Asserts/ApplicationStatus/Backarrow.svg";
import { ReactComponent as SearchIcon } from "../../Asserts/ApplicationStatus/Group.svg";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import apiService from "../../Bakend/SaleFormapis";
import * as Yup from "yup";
import styles from "./AddressInfoSection.module.css";

// Validation schema for AddressInfoSection
const validationSchema = Yup.object().shape({
  doorNo: Yup.string().required("Door No is required"),
  street: Yup.string().required("Street is required"),
  landmark: Yup.string().notRequired(),
  area: Yup.string().required("Area is required"),
  stateId: Yup.string().required("State is required"),
  addressCity: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  mandal: Yup.string().required("Mandal is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

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
  validateForm,
}) => {
  const { setErrors, setTouched } = useFormikContext();
  const [dropdownOptions, setDropdownOptions] = useState({
    states: [],
    cities: [],
    districts: [],
    mandals: [],
  });

  useEffect(() => {
    const fetchInitialStates = async () => {
      try {
        console.log("=== Starting to fetch states ===");
        console.log("API Service:", apiService);
        console.log("fetchDistributionStates function:", apiService.fetchDistributionStates);
        
        const states = await apiService.fetchDistributionStates();
        console.log("=== API Response received ===");
        console.log("Fetched initial states (raw):", states);
        console.log("Type of response:", typeof states);
        console.log("Is array:", Array.isArray(states));
        
        // Handle both single object and array responses
        let statesArray = [];
        if (Array.isArray(states)) {
          statesArray = states;
          console.log("Processing as array with", states.length, "items");
        } else if (states && typeof states === 'object') {
          // If it's a single state object, wrap it in an array
          statesArray = [states];
          console.log("Processing as single object, wrapped in array");
        } else {
          console.warn("Unexpected response type:", typeof states, states);
        }
        
        console.log("States array to process:", statesArray);
        
        const processedStates = statesArray
          .filter((item) => {
            const isValid = item && item.stateId != null && item.stateName;
            if (!isValid) {
              console.log("Filtered out invalid item:", item);
            }
            return isValid;
          })
          .map((item) => {
            const processed = {
              value: item.stateId?.toString() || "",
              label: item.stateName || "",
            };
            console.log("Processed item:", item, "->", processed);
            return processed;
          });
        
        console.log("=== Final processed states ===");
        console.log("Processed states:", processedStates);
        console.log("Number of valid states:", processedStates.length);
        
        setDropdownOptions((prev) => {
          const newOptions = {
            ...prev,
            states: processedStates,
          };
          console.log("Updated dropdown options:", newOptions);
          return newOptions;
        });
        
        if (processedStates.length === 0) {
          console.warn("No valid states data received. Raw response:", states);
          console.warn("States array:", statesArray);
          
          // Add fallback data for testing
          const fallbackStates = [
            { value: "1", label: "Test State 1" },
            { value: "2", label: "Test State 2" },
            { value: "3", label: "Test State 3" }
          ];
          console.log("Using fallback states for testing:", fallbackStates);
          setDropdownOptions((prev) => ({
            ...prev,
            states: fallbackStates,
          }));
        } else {
          console.log(`Successfully loaded ${processedStates.length} states`);
        }
      } catch (error) {
        console.error("=== Error fetching initial states ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        setDropdownOptions((prev) => ({ ...prev, states: [] }));
        alert(`Failed to load states: ${error.message || 'Please check the server or try again later.'}`);
      }
    };
    fetchInitialStates();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (values.stateId) {
        try {
          console.log("Fetching districts for stateId:", values.stateId);
          const districts = await apiService.fetchDistrictsByDistributionState(values.stateId);
          console.log("Fetched districts (raw):", districts);
          // Handle both single object and array responses for districts
          let districtsArray = [];
          if (Array.isArray(districts)) {
            districtsArray = districts;
          } else if (districts && typeof districts === 'object') {
            districtsArray = [districts];
          }
          
          setDropdownOptions((prev) => ({
            ...prev,
            districts: districtsArray
              .filter((item) => item && item.id != null && item.name)
              .map((item) => ({
                value: item.id?.toString() || "",
                label: item.name || "",
              })),
            cities: [], // Reset cities
            mandals: [], // Reset mandals
          }));
          setFieldValue("district", ""); // Reset district
          setFieldValue("addressCity", ""); // Reset city
          setFieldValue("mandal", ""); // Reset mandal
        } catch (error) {
          console.error("Error fetching districts:", error);
          setDropdownOptions((prev) => ({ ...prev, districts: [], cities: [], mandals: [] }));
        }
      }
    };
    fetchDistricts();
  }, [values.stateId, setFieldValue]);

  useEffect(() => {
    const fetchCitiesAndMandals = async () => {
      if (values.district) {
        try {
          console.log("Fetching cities and mandals for districtId:", values.district);
          const [cities, mandals] = await Promise.all([
            apiService.fetchCitiesByDistributionDistrict(values.district),
            apiService.fetchMandalsByDistributionDistrict(values.district),
          ]);
          console.log("Fetched cities (raw):", cities);
          console.log("Fetched mandals (raw):", mandals);
          // Handle both single object and array responses for cities and mandals
          let citiesArray = [];
          if (Array.isArray(cities)) {
            citiesArray = cities;
          } else if (cities && typeof cities === 'object') {
            citiesArray = [cities];
          }
          
          let mandalsArray = [];
          if (Array.isArray(mandals)) {
            mandalsArray = mandals;
          } else if (mandals && typeof mandals === 'object') {
            mandalsArray = [mandals];
          }
          
          setDropdownOptions((prev) => ({
            ...prev,
            cities: citiesArray
              .filter((item) => item && item.id != null && item.name)
              .map((item) => ({
                value: item.id?.toString() || "",
                label: item.name || "",
              })),
            mandals: mandalsArray
              .filter((item) => item && item.id != null && item.name)
              .map((item) => ({
                value: item.id?.toString() || "",
                label: item.name || "",
              })),
          }));
          setFieldValue("addressCity", ""); // Reset city
          setFieldValue("mandal", ""); // Reset mandal
        } catch (error) {
          console.error("Error fetching cities or mandals:", error);
          setDropdownOptions((prev) => ({ ...prev, cities: [], mandals: [] }));
        }
      }
    };
    fetchCitiesAndMandals();
  }, [values.district, setFieldValue]);

  const flatfields = [
    { label: "Door No", name: "doorNo", placeholder: "Enter Door No", required: true },
    { label: "Street", name: "street", placeholder: "Enter Street", required: true },
    { label: "Landmark", name: "landmark", placeholder: "Enter Landmark" },
    { label: "Area", name: "area", placeholder: "Enter Area", required: true },
    { label: "State", name: "stateId", type: "select", options: dropdownOptions.states, required: true },
    { label: "District", name: "district", type: "select", options: dropdownOptions.districts, required: true },
    { label: "City", name: "addressCity", type: "select", options: dropdownOptions.cities, required: true },
   { label: "Mandal", name: "mandal", type: "select", options: dropdownOptions.mandals, required: true },
    { label: "Pincode", name: "pincode", placeholder: "Enter Pincode", required: true },
    { label: "G-pin (latitude & longitude)", name: "gpin", placeholder: "Search address" },
  ];

  // Debug logging for dropdown options
  console.log("Current dropdown options:", {
    states: dropdownOptions.states,
    cities: dropdownOptions.cities,
    districts: dropdownOptions.districts,
    mandals: dropdownOptions.mandals
  });

  const groupedFields = [];
  for (let i = 0; i < flatfields.length; i += 3) {
    groupedFields.push(flatfields.slice(i, i + 3));
  }

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "pincode") {
      finalValue = value.replace(/\D/g, "").slice(0, 6);
    }
    setFieldValue(name, finalValue);
    console.log(`Field ${name} changed to:`, finalValue);
  };

  const handleProceed = async () => {
    const errors = await validateForm();
    console.log("AddressInfoSection - Validation errors:", errors);
    console.log("AddressInfoSection - Current form values:", values);
    
    // Log complete form data object
    console.log("🚀 ===== ADDRESS - FINAL SUBMITTING OBJECT =====");
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
    console.log("🚀 ===== END ADDRESS OBJECT =====");
    
    if (Object.keys(errors).length === 0) {
      console.log("Validation passed, moving to next step");
      handleNext();
    } else {
      console.log("Validation failed, marking fields as touched");
      setErrors(errors);
      setTouched(errors);
      alert(
        "Please correct the following errors:\n" +
        Object.entries(errors)
          .map(([field, error]) => `${field}: ${error}`)
          .join("\n")
      );
    }
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
                      results={field.options.length > 0 ? field.options.map((opt) => opt.label) : ["No record found"]}
                      value={
                        field.options.find((opt) => opt.value === values[field.name])?.label || ""
                      }
                      onChange={(e) => {
                        const selected = field.options.find((opt) => opt.label === e.target.value);
                        setFieldValue(field.name, selected ? selected.value : "");
                        console.log(`Selected ${field.name}:`, selected ? selected.value : "None");
                      }}
                      error={touched[field.name] && errors[field.name]}
                      required={field.required}
                      loading={
                        (field.name === "stateId" && dropdownOptions.states.length === 0) ||
                        (field.name === "district" && values.stateId && dropdownOptions.districts.length === 0) ||
                        (field.name === "addressCity" && values.district && dropdownOptions.cities.length === 0) ||
                        (field.name === "mandal" && values.district && dropdownOptions.mandals.length === 0)
                      }
                    />
                  ) : field.name === "gpin" ? (
                    <div>
                      <label className={styles.Address_Info_Section_searchbox_label}>
                        {field.label}
                        {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
                      </label>
                      <SearchBox
                        searchicon={<SearchIcon />}
                        placeholder={field.placeholder}
                        value={values[field.name] || ""}
                        onChange={handleSectionChange}
                        onValueChange={(value) => setFieldValue(field.name, value)}
                        error={touched[field.name] && errors[field.name]}
                      />
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
        <div className={styles.Address_Info_Section_address_form_actions}>
          <Button
            type="button"
            variant="secondary"
            buttonname="Back"
            lefticon={<BackArrow />}
            onClick={handleBack}
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleProceed}
            buttonname="Proceed to Add Payment Info"
            righticon={<TrendingUpIcon />}
          />
        </div>
      </div>
    </div>
  );
};

AddressInfoSection.validationSchema = validationSchema;
export default AddressInfoSection;