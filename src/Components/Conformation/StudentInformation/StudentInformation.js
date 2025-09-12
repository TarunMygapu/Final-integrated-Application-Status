import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Inputbox from "../../../Widgets/Inputbox/Input_box";
import Dropdown from "../../../Widgets/Dropdown/Dropdown";
import Button from "../../../Widgets/Button/Button";
import { ReactComponent as TrendingUpIcon } from "../../../Asserts/ApplicationStatus/Trending up.svg";
import styles from "./StudentInformation.module.css";
import StudentInfoHeader from "./StudentInfoHeader";
import { getConcessionReasons } from "../../../Bakend/apis"; // ✅ adjust path
 
const StudentInformation = ({ onNext, saleData = null }) => {
  const [reasonOptions, setReasonOptions] = useState([]);
  const [reasonMap, setReasonMap] = useState({});
 
  const initialValues = {
    admissionNo: saleData?.applicationNo || "",
    studentName: saleData?.studentName || "",
    surname: saleData?.surname || "",
    parentName: saleData?.fatherName || "",
    gender: saleData?.gender || "Male",
    applicationFee:
      saleData?.amount || saleData?.appFeeAmount || saleData?.appFee || "",
    confirmationAmount: "",
    firstYearConcession: saleData?.yearConcession1st || "",
    secondYearConcession: saleData?.yearConcession2nd || "",
    thirdYearConcession: saleData?.yearConcession3rd || "",
    reasonForConcession: saleData?.reason || "",
    firstLanguage: "",
    secondLanguage: "",
    thirdLanguage: "",
  };
 
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const data = await getConcessionReasons();
        const labels = [];
        const map = {};
        data.forEach((r) => {
          if (r.conc_reason) {
            labels.push(r.conc_reason);
            map[r.conc_reason] = r.conc_reason_id;
          }
        });
        setReasonOptions(labels);
        setReasonMap(map);
      } catch (err) {
        console.error("Failed to fetch reasons:", err);
      }
    };
    fetchReasons();
  }, []);
 
  const fields = [
    { label: "Admission No.", name: "admissionNo", disabled: true },
    { label: "Student Name", name: "studentName", disabled: true },
    { label: "Surname", name: "surname", disabled: true },
    { label: "Parent Name", name: "parentName", disabled: true },
    { label: "Application Fee", name: "applicationFee", disabled: true },
    { label: "Confirmation Amount", name: "confirmationAmount", required: true },
    { label: "1st Year Concession", name: "firstYearConcession" },
    { label: "2nd Year Concession", name: "secondYearConcession" },
    { label: "3rd Year Concession", name: "thirdYearConcession" },
  ];
 
  const headerItems = [
    { label: "Application No", value: "MPC" },
    { label: "PRO Name", value: "Direct Walkin" },
    { label: "PRO Mobile No", value: "Inter with NPL" },
    { label: "PRO Campus", value: "Residential" },
  ];
 
  const validationSchema = Yup.object().shape({
    confirmationAmount: Yup.number()
      .typeError("Amount must be a valid number.")
      .positive("Amount must be a valid number.")
      .required("This field is required."),
    firstYearConcession: Yup.number()
      .typeError("Amount must be a valid number.")
      .min(0, "Amount must be a valid number.")
      .nullable(true),
    secondYearConcession: Yup.number()
      .typeError("Amount must be a valid number.")
      .min(0, "Amount must be a valid number.")
      .nullable(true),
    thirdYearConcession: Yup.number()
      .typeError("Amount must be a valid number.")
      .min(0, "Amount must be a valid number.")
      .nullable(true),
    reasonForConcession: Yup.string().when(
      ["firstYearConcession", "secondYearConcession", "thirdYearConcession"],
      {
        is: (f1, f2, f3) =>
          !!(parseFloat(f1) > 0 || parseFloat(f2) > 0 || parseFloat(f3) > 0),
        then: (schema) => schema.required("This field is required."),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
    firstLanguage: Yup.string().required("First Language is required"),
    secondLanguage: Yup.string().nullable(true),
    thirdLanguage: Yup.string().nullable(true),
  });
 
  return (
    <div className={styles.Student_Information_studentInfoContainer}>
      <StudentInfoHeader items={headerItems} />
 
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const concessions =
            Number(values.firstYearConcession || 0) +
            Number(values.secondYearConcession || 0) +
            Number(values.thirdYearConcession || 0);
 
          const totalFee =
            Number(values.applicationFee || 0) +
            Number(values.confirmationAmount || 0);
 
          if (concessions > totalFee) {
            alert("Concession exceeds allowed maximum.");
            setSubmitting(false);
            return;
          }
 
          console.log("StudentInformation submitted:", values);
          onNext(values);
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
          <Form
            className={styles.Student_Information_studentFormContainer}
            onSubmit={handleSubmit}
          >
            <div className={styles.Student_Information_studentFormGrid}>
              {fields.map((f) =>
                f.name === "parentName" ? (
                  <React.Fragment key={f.name}>
                    <Inputbox
                      label={f.label}
                      name={f.name}
                      value={values[f.name]}
                      onChange={(e) => setFieldValue(f.name, e.target.value)}
                      disabled={f.disabled || false}
                      required={f.required || false}
                    />
                    <div
                      className={styles.Student_Information_studentFormGroup}
                    >
                      <label
                        className={styles.Student_Information_studentFormLabel}
                      >
                        Gender
                      </label>
                      <div
                        className={
                          styles.Student_Information_studentGenderButtons
                        }
                      >
                        {["Male", "Female"].map((g) => (
                          <div
                            key={g}
                            type="button"
                            className={`${styles.Student_Information_studentGenderBtn} ${
                              values.gender === g
                                ? styles.Student_Information_studentGenderBtnActive
                                : ""
                            }`}
                            onClick={() => setFieldValue("gender", g)}
                          >
                            {g}
                          </div>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <div key={f.name}>
                    <Inputbox
                      label={f.label}
                      name={f.name}
                      value={values[f.name]}
                      onChange={(e) => setFieldValue(f.name, e.target.value)}
                      disabled={f.disabled || false}
                      required={f.required || false}
                    />
                    <ErrorMessage
                      name={f.name}
                      component="div"
                      style={{ color: "red", fontSize: "12px" }}
                    />
                  </div>
                )
              )}
 
              {/* Dropdown loaded from API */}
              <div>
                <Dropdown
                  dropdownname="Reason For Concession"
                  name="reasonForConcession"
                  results={reasonOptions}
                  value={values.reasonForConcession}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setFieldValue("reasonForConcession", selected);
                    setFieldValue("reasonId", reasonMap[selected] || "");
                  }}
                />
                <ErrorMessage
                  name="reasonForConcession"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
 
              {/* ✅ Language Information Row */}
              <div className={styles.Student_Information_languageRow}>
                <div className={styles.Student_Information_languageHeader}>
                  <span>Language Information</span>
                  <div className={styles.Student_Information_languageLine}></div>
                </div>
                <div className={styles.Student_Information_languageGrid}>
                  <Dropdown
                    dropdownname="First Language"
                    name="firstLanguage"
                    results={["English", "Hindi", "Telugu", "Tamil", "Kannada"]}
                    value={values.firstLanguage}
                    onChange={(e) =>
                      setFieldValue("firstLanguage", e.target.value)
                    }
                  />
                  <Dropdown
                    dropdownname="Second Language"
                    name="secondLanguage"
                    results={["English", "Hindi", "Telugu", "Tamil", "Kannada"]}
                    value={values.secondLanguage}
                    onChange={(e) =>
                      setFieldValue("secondLanguage", e.target.value)
                    }
                  />
                  <Dropdown
                    dropdownname="Third Language"
                    name="thirdLanguage"
                    results={["English", "Hindi", "Telugu", "Tamil", "Kannada"]}
                    value={values.thirdLanguage}
                    onChange={(e) =>
                      setFieldValue("thirdLanguage", e.target.value)
                    }
                  />
                </div>
                <div className={styles.Student_Information_languageErrors}>
                  <ErrorMessage
                    name="firstLanguage"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />
                  <ErrorMessage
                    name="secondLanguage"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />
                  <ErrorMessage
                    name="thirdLanguage"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />
                </div>
              </div>
            </div>
 
            <div className={styles.Student_Information_studentFormFooter}>
              <Button
                type="submit"
                variant="primary"
                buttonname="Proceed to Add Payment Info"
                righticon={<TrendingUpIcon />}
                className={styles.Damaged_damaged_Submit_Button}
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
 
export default StudentInformation;