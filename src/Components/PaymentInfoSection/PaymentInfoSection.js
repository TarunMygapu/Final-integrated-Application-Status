import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import { Button as MUIButton } from "@mui/material";
import Button from "../../Widgets/Button/Button";
import { ReactComponent as TrendingUpIcon } from "../../Asserts/ApplicationStatus/Trending up.svg";
import Cash from "../../Asserts/ApplicationStatus/Cash (1).svg";
import DD from "../../Asserts/ApplicationStatus/DD (1).svg";
import Debit from "../../Asserts/ApplicationStatus/Debit Card.svg";
import Cheque from "../../Asserts/ApplicationStatus/Cheque (1).svg";
import SkipIcon from "../../Asserts/ApplicationStatus/SkipIcon.svg";
import * as Yup from "yup";
import styles from "./PaymentInfoSection.module.css";
import { ReactComponent as BackArrow } from "../../Asserts/ApplicationStatus/Backarrow.svg";
import apiService from "../../Bakend/SaleFormapis";

// Validation schema for PaymentInfoSection
const validationSchema = Yup.object().shape({
  payMode: Yup.number().required("Application Fee Pay Mode is required"),
  appFeeReceived: Yup.boolean(),
  // Cash fields for payMode
  paymentDate: Yup.date().when("payMode", {
    is: 1,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  amount: Yup.string().when("payMode", {
    is: 1,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiptNumber: Yup.string().when("payMode", {
    is: 1,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  // DD fields for payMode
  mainDdPayDate: Yup.date().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdAmount: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdReceiptNumber: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdOrganisationName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdNumber: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("DD Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdCityName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdBankName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdBranchName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdIfscCode: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdDate: Yup.date().when("payMode", {
    is: 2,
    then: (schema) => schema.required("DD Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Cheque fields for payMode
  mainChequePayDate: Yup.date().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeAmount: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeReceiptNumber: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeOrganisationName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeNumber: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Cheque Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeCityName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeBankName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeBranchName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeIfscCode: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeDate: Yup.date().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Cheque Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Credit/Debit Card fields for payMode
  cardPayDate: Yup.date().when("payMode", {
    is: 4,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardAmount: Yup.string().when("payMode", {
    is: 4,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardReceiptNumber: Yup.string().when("payMode", {
    is: 4,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  // App Fee (conditional) — depend on main payMode
  appFeePayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 1,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  appFeeAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 1,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  appFeeReceiptNo: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 1,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdPayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdReceiptNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdOrganisationName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("DD Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdCityName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdBankName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdBranchName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdIfscCode: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("DD Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequePayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeReceiptNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeOrganisationName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Cheque Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeCityName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeBankName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeBranchName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeIfscCode: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Cheque Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardFeePayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 4,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardFeeAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 4,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardFeeReceiptNo: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 4,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

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
  validateForm,
  onFinish,
  onContinue,
  finishDisabled,
}) => {
  const { setErrors, setTouched } = useFormikContext();
  const navigate = useNavigate();
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Cash");
  const [selectedAppFeePayMode, setSelectedAppFeePayMode] = useState("Cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    organizations: [],
    cities: [],
    banks: [],
    branches: [],
  });

  // Define modes at component level
  const modes = [
    { label: "Cash", value: 1, icon: Cash },
    { label: "DD", value: 2, icon: DD },
    { label: "Cheque", value: 3, icon: Cheque },
    { label: "Credit/Debit Card", value: 4, icon: Debit },
  ];

  // Fetch initial data (organizations and cities)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("Fetching initial payment data...");
        const [organizations, cities] = await Promise.all([
          apiService.fetchOrganizations(),
          apiService.fetchCities(),
        ]);

        console.log("Organizations response:", organizations);
        console.log("Cities response:", cities);

        // Process organizations
        let organizationsArray = [];
        if (Array.isArray(organizations)) {
          organizationsArray = organizations;
        } else if (organizations && typeof organizations === 'object') {
          organizationsArray = [organizations];
        }

        const processedOrganizations = organizationsArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: item.name || "",
          }));

        // Process cities
        let citiesArray = [];
        if (Array.isArray(cities)) {
          citiesArray = cities;
        } else if (cities && typeof cities === 'object') {
          citiesArray = [cities];
        }

        const processedCities = citiesArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: item.name || "",
          }));

        setDropdownOptions((prev) => ({
          ...prev,
          organizations: processedOrganizations,
          cities: processedCities,
        }));

        console.log("Processed organizations:", processedOrganizations);
        console.log("Processed cities:", processedCities);
      } catch (error) {
        console.error("Error fetching initial payment data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch banks when organization changes
  useEffect(() => {
    const fetchBanks = async () => {
      if (values.mainDdOrganisationName || values.mainChequeOrganisationName || 
          values.feeDdOrganisationName || values.feeChequeOrganisationName) {
        const organizationId = values.mainDdOrganisationName || values.mainChequeOrganisationName || 
                              values.feeDdOrganisationName || values.feeChequeOrganisationName;
        
        try {
          console.log("Fetching banks for organization:", organizationId);
          const banks = await apiService.fetchBanksByOrganization(organizationId);
          console.log("Banks response:", banks);

          let banksArray = [];
          if (Array.isArray(banks)) {
            banksArray = banks;
          } else if (banks && typeof banks === 'object') {
            banksArray = [banks];
          }

          const processedBanks = banksArray
            .filter((item) => item && item.id != null && item.name)
            .map((item) => ({
              value: item.id?.toString() || "",
              label: item.name || "",
            }));

          setDropdownOptions((prev) => ({
            ...prev,
            banks: processedBanks,
            branches: [], // Reset branches when organization changes
          }));

          console.log("Processed banks:", processedBanks);
        } catch (error) {
          console.error("Error fetching banks:", error);
        }
      }
    };

    fetchBanks();
  }, [values.mainDdOrganisationName, values.mainChequeOrganisationName, 
      values.feeDdOrganisationName, values.feeChequeOrganisationName]);

  // Fetch branches when bank changes
  useEffect(() => {
    const fetchBranches = async () => {
      const organizationId = values.mainDdOrganisationName || values.mainChequeOrganisationName || 
                            values.feeDdOrganisationName || values.feeChequeOrganisationName;
      const bankId = values.mainDdBankName || values.mainChequeBankName || 
                     values.feeDdBankName || values.feeChequeBankName;

      if (organizationId && bankId) {
        try {
          console.log("Fetching branches for organization:", organizationId, "and bank:", bankId);
          const branches = await apiService.fetchBranchesByOrganizationAndBank(organizationId, bankId);
          console.log("Branches response:", branches);

          let branchesArray = [];
          if (Array.isArray(branches)) {
            branchesArray = branches;
          } else if (branches && typeof branches === 'object') {
            branchesArray = [branches];
          }

          const processedBranches = branchesArray
            .filter((item) => item && item.id != null && item.name)
            .map((item) => ({
              value: item.id?.toString() || "",
              label: item.name || "",
            }));

          setDropdownOptions((prev) => ({
            ...prev,
            branches: processedBranches,
          }));

          console.log("Processed branches:", processedBranches);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      }
    };

    fetchBranches();
  }, [values.mainDdBankName, values.mainChequeBankName, values.feeDdBankName, values.feeChequeBankName]);

  useEffect(() => {
    const payMode = values?.payMode ?? 1;
    const appFeeReceived = !!values?.appFeeReceived;

    const modeLabel = modes.find(mode => mode.value === payMode)?.label ?? "Cash";

    setSelectedPaymentMode(modeLabel);
    setSelectedAppFeePayMode(modeLabel);
    setFieldValue && setFieldValue("appFeePayMode", payMode, false);

    setErrors({});
    setTouched({});
  }, [
    values?.payMode,
    values?.appFeeReceived,
    setFieldValue, // Added to dependency array to avoid missing dependency warning
  ]);

  const getPaymentModeFields = () => {
    switch (selectedPaymentMode) {
      case "Cash":
        return [
          { label: "Application Fee Pay Date", name: "paymentDate", placeholder: "Select Payment Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "amount", placeholder: "Enter Amount (numbers only)", required: true },
          { label: "Application Sale Date", name: "mainDdSaleDate", placeholder: "Select Sale Date", type: "date", required: true },
          { label: "Receipt Number", name: "receiptNumber", placeholder: "Enter Receipt Number", required: true },
        ];
      case "DD":
        return [
          { label: "Application Fee Pay Date", name: "mainDdPayDate", placeholder: "Select Pay Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "mainDdAmount", placeholder: "Enter Amount (numbers only)", required: true },
          {label:"Applicattion Sale Date", name: "mainDdSaleDate", placeholder: "Select Sale Date", type: "date", required: true },
          { label: "Receipt Number", name: "mainDdReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          { label: "Organisation Name", name: "mainDdOrganisationName", type: "select", options: dropdownOptions.organizations.map(opt => opt.label), required: true },
          { label: "DD Number", name: "mainDdNumber", placeholder: "Enter DD Number", required: true },
          { label: "City Name", name: "mainDdCityName", type: "select", options: dropdownOptions.cities.map(opt => opt.label), required: true },
          { label: "Bank Name", name: "mainDdBankName", type: "select", options: dropdownOptions.banks.map(opt => opt.label), required: true },
          { label: "Branch Name", name: "mainDdBranchName", type: "select", options: dropdownOptions.branches.map(opt => opt.label), required: true },
          { label: "IFSC Code", name: "mainDdIfscCode", placeholder: "Enter IFSC Code", required: true },
          { label: "DD Date", name: "mainDdDate", placeholder: "Select DD Date", type: "date", required: true },
        ];
      case "Cheque":
        return [
          { label: "Application Fee Pay Date", name: "mainChequePayDate", placeholder: "Select Pay Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "mainChequeAmount", placeholder: "Enter Amount (numbers only)", required: true },
          { label: "Application Sale Date", name: "mainChequeSaleDate", placeholder: "Select Sale Date", type: "date", required: true },
          { label: "Receipt Number", name: "mainChequeReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          { label: "Organisation Name", name: "mainChequeOrganisationName", type: "select", options: dropdownOptions.organizations.map(opt => opt.label), required: true },
          { label: "Cheque Number", name: "mainChequeNumber", placeholder: "Enter Cheque Number", required: true },
          { label: "City Name", name: "mainChequeCityName", type: "select", options: dropdownOptions.cities.map(opt => opt.label), required: true },
          { label: "Bank Name", name: "mainChequeBankName", type: "select", options: dropdownOptions.banks.map(opt => opt.label), required: true },
          { label: "Branch Name", name: "mainChequeBranchName", type: "select", options: dropdownOptions.branches.map(opt => opt.label), required: true },
          { label: "IFSC Code", name: "mainChequeIfscCode", placeholder: "Enter IFSC Code", required: true },
          { label: "Cheque Date", name: "mainChequeDate", placeholder: "Select Cheque Date", type: "date", required: true },
        ];
      case "Credit/Debit Card":
        return [
          { label: "Application Fee Pay Date", name: "cardPayDate", placeholder: "Select Payment Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "cardAmount", placeholder: "Enter Amount (numbers only)", required: true },
          { label: "Receipt Number", name: "cardReceiptNumber", placeholder: "Enter Receipt Number", required: true },
        ];
      default:
        return [];
    }
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if ([
      "amount", "appFeeAmount", "appFeeReceiptNo", "receiptNumber", "mainDdAmount", "feeDdAmount",
      "mainChequeAmount", "feeChequeAmount", "mainDdReceiptNumber", "feeDdReceiptNumber",
      "mainChequeReceiptNumber", "feeChequeReceiptNumber", "mainDdNumber", "feeDdNumber",
      "mainChequeNumber", "cardAmount", "cardReceiptNumber", "cardFeeAmount", "cardFeeReceiptNo"
    ].includes(name)) {
      finalValue = value.replace(/\D/g, '');
    }
    if (["mainDdIfscCode", "mainChequeIfscCode", "feeDdIfscCode", "feeChequeIfscCode"].includes(name)) {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    }
    setFieldValue(name, finalValue);
    console.log(`Field ${name} changed to:`, finalValue);
  };

  const renderPaymentModes = (name) => {
    const selected = values[name] ?? 1;
    return (
      <nav className={styles.Payment_Info_Section_payment_category_options}>
        <ul className={styles.Payment_Info_Section_payment_nav_list}>
          {modes.map((mode) => (
            <li key={mode.label} className={styles.Payment_Info_Section_payment_nav_item}>
              <MUIButton
                type="button"
                className={`${styles.Payment_Info_Section_payment_category_label} ${selected === mode.value ? styles.Payment_Info_Section_active : ""}`}
                onClick={() => {
                  setFieldValue(name, mode.value);
                  if (name === "payMode") {
                    setSelectedPaymentMode(mode.label);
                    setSelectedAppFeePayMode(mode.label);
                    setFieldValue("appFeePayMode", mode.value);
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
            </label>
            <div className={styles.Payment_Info_Section_payment_line}></div>
          </div>
          {renderPaymentModes(field.name)}
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
    } else if (field.type === "select") {
      // Get the appropriate dropdown options based on field name
      let dropdownData = [];
      if (field.name.includes('OrganisationName')) {
        dropdownData = dropdownOptions.organizations;
      } else if (field.name.includes('CityName')) {
        dropdownData = dropdownOptions.cities;
      } else if (field.name.includes('BankName')) {
        dropdownData = dropdownOptions.banks;
      } else if (field.name.includes('BranchName')) {
        dropdownData = dropdownOptions.branches;
      } else {
        dropdownData = field.options ? field.options.map(opt => ({ value: opt, label: opt })) : [];
      }

      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_dropdown_wrapper}>
          <Dropdown
            dropdownname={field.label}
            name={field.name}
            results={dropdownData.length > 0 ? dropdownData.map(opt => opt.label) : ["No record found"]}
            value={
              dropdownData.find((opt) => opt.value === values[field.name])?.label || ""
            }
            onChange={(e) => {
              const selected = dropdownData.find((opt) => opt.label === e.target.value);
              setFieldValue(field.name, selected ? selected.value : "");
              console.log(`Selected ${field.name}:`, selected ? selected.value : "None");
            }}
            error={touched[field.name] && errors[field.name]}
            required={field.required}
            loading={
              (field.name.includes('OrganisationName') && dropdownOptions.organizations.length === 0) ||
              (field.name.includes('CityName') && dropdownOptions.cities.length === 0) ||
              (field.name.includes('BankName') && dropdownOptions.banks.length === 0) ||
              (field.name.includes('BranchName') && dropdownOptions.branches.length === 0)
            }
          />
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    } else {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_inputbox_wrapper}>
          <Inputbox
            id={field.name}
            name={field.name}
            label={field.label}
            type={field.type || "text"}
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={values[field.name] || ""}
            onChange={handleSectionChange}
            error={touched[field.name] && errors[field.name]}
            required={field.required}
          />
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    }
  };

  // Handle proceed to confirmation
  const handleProceedToConfirmation = async () => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Proceeding to confirmation with form data:", values);
      
      // Validate the form before submitting
      const validationErrors = await validateForm();
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        console.error("❌ Form validation failed:", validationErrors);
        setErrors(validationErrors);
        setTouched(Object.keys(validationErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        setIsSubmitting(false);
        return;
      }

      // Submit the form data to the database
      console.log("📤 Submitting application sale data to database...");
      const response = await apiService.submitAdmissionForm(values);
      console.log("✅ Application sale data submitted successfully:", response);
      
      // Navigate to confirmation page with the submitted data
      navigate('/confirmation', { 
        state: { 
          applicationData: values,
          submissionResponse: response,
          fromPayment: true 
        } 
      });
      
    } catch (error) {
      console.error("❌ Error submitting application sale data:", error);
      // You might want to show an error message to the user here
      alert("Failed to submit application data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.Payment_Info_Section_payment_info_section}>
      <div className={styles.Payment_Info_Section_payment_section_header}>
        <div className={styles.Payment_Info_Section_payment_header_content}>
          <div className={styles.Payment_Info_Section_payment_header_left}>
            {renderInput({ label: "Application Fee Pay Mode", name: "payMode", type: "custom", required: true })}
          </div>
          {selectedPaymentMode === "Credit/Debit Card" && (
            <div className={styles.Payment_Info_Section_payment_header_middle}>
              <div className={styles.Payment_Info_Section_payment_checkbox_group}>
                <label className={styles.squareCheckbox}>
                  <input
                    type="checkbox"
                    name="proCreditCard"
                    checked={values.proCreditCard}
                    onChange={handleChange}
                  />
                  <span className={styles.checkmark}></span>
                </label>
                <label
                  className={`${styles.Payment_Info_Section_payment_form_label} ${styles.Payment_Info_Section_payment_small_label}`}
                  htmlFor="proCreditCard"
                >
                  PRO Credit Card
                </label>
                {touched.proCreditCard && errors.proCreditCard && (
                  <span className={styles.Payment_Info_Section_payment_error_message}>
                    {errors.proCreditCard}
                  </span>
                )}
              </div>
              <div className={styles.Payment_Info_Section_payment_special_concession_block}>
                <h6 className={styles.Payment_Info_Section_payment_concession_value}>0</h6>
                <span className={styles.Payment_Info_Section_payment_concession_label}>Application Special Concession Value</span>
              </div>
            </div>
          )}
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
      <div className={styles.Payment_Info_Section_payment_form_actions} style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Button
          type="button"
          variant="secondary"
          buttonname="Back"
          lefticon={<BackArrow />}
          onClick={handleBack}
        />
        <Button
          type="submit"
          variant="primary"
          buttonname="Finish"
          righticon={<TrendingUpIcon />}
          disabled={finishDisabled}
        />
      </div>
      <a 
        href="#"
        className={styles.paymentLinkButton}
        onClick={(e) => {
          e.preventDefault(); // Prevent default link navigation
          if (!isSubmitting) {
            handleProceedToConfirmation();
          }
        }}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
        </figure>
        {isSubmitting ? "Submitting..." : "Proceed to Confirmation"}
      </a>
    </div>
  );
};

PaymentInfoSection.validationSchema = validationSchema;

export default PaymentInfoSection;