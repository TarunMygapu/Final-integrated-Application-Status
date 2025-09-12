import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import Inputbox from "../../../Widgets/Inputbox/Input_box";
import Dropdown from "../../../Widgets/Dropdown/Dropdown";
import Button from "../../../Widgets/Button/Button";
import { ReactComponent as TrendingUpIcon } from "../../../Asserts/ApplicationStatus/Trending up.svg";
// import VegIcon from "../../../Asserts/ApplicationStatus/Frame 1410092363.png"
// import NonVegIcon from "../../../Asserts/ApplicationStatus/Frame 1410092364.png"
import SkipIcon from "../../../Asserts/ApplicationStatus/SkipIcon.svg";
import { ReactComponent as BackArrow } from "../../../Asserts/ApplicationStatus/Backarrow.svg";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import styles from "./PaymentInformation.module.css";
import StudentInfoHeader from "../StudentInformation/StudentInfoHeader";
import {
  getJoinYears,
  getStreams,
  getCourses,
  getProgramsByStream,
  getBatchesByCourse,
  getExamPrograms,
  getSections,
  getCourseFee,
} from "../../../Bakend/apis";

/**
 * CourseFeeWatcher (adapted to orientation naming)
 * - watches campusId, orientationTrackId (previously courseTrackId) and batchId
 * - sets orientationFee when API returns a value
 */
const CourseFeeWatcher = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const fetchCourseFee = async () => {
      // use orientationTrackId in place of courseTrackId
      if (values?.campusId && values?.orientationTrackId && values?.batchId) {
        try {
          const fee = await getCourseFee(values.campusId, values.orientationTrackId, values.batchId);
          if (fee !== undefined && fee !== null) {
            // set orientationFee in the form
            setFieldValue("orientationFee", fee);
          }
        } catch (err) {
          console.error("Failed to fetch orientation fee:", err);
        }
      }
    };

    fetchCourseFee();
  }, [values?.campusId, values?.orientationTrackId, values?.batchId, setFieldValue]);

  return null;
};

const inputFields = [
  { label: "Orientation Batch Start Date", name: "startDate", type: "date", required: true },
  { label: "Orientation Batch End Date", name: "endDate", type: "date", required: true },
];

const headerItems = [
  { label: "Application No", value: "MPC" },
  { label: "PRO Name", value: "Direct Walkin" },
  { label: "PRO Mobile No", value: "Inter with NPL" },
  { label: "PRO Campus", value: "Residential" },
];

const validationSchema = Yup.object().shape({
  joinYear: Yup.string().required("This field is required"),
  orientationName: Yup.string().required("This field is required"),
  stream: Yup.string().required("This field is required"),
  program: Yup.string().required("This field is required"),
  examProgram: Yup.string().required("This field is required"),
  batchName: Yup.string().required("This field is required"),
  section: Yup.string().required("This field is required"),
  startDate: Yup.date().required("This field is required"),
  endDate: Yup.date()
    .required("This field is required")
    .min(Yup.ref("startDate"), "End date must be after start date."),
  orientationFee: Yup.number()
    .typeError("Amount must be a number")
    .required("Orientation Fee is required"),
  foodPreference: Yup.string().required("Food preference is required"),
});

const CustomFoodDropdown = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const foodOptions = [
    { label: "Vegetarian", id: "1", icon: "✔", iconColor: "green" },
    { label: "Non-vegetarian", id: "2", icon: "▲", iconColor: "red" },
  ];

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    onChange(option.label, option.id);
    setIsOpen(false);
  };

  return (
    <div className={styles.custom_dropdown} ref={wrapperRef}>
      <div className={styles.dropdown_header} onClick={() => setIsOpen(!isOpen)}>
        {value || "Select Food Type"}
        <span className={styles.dropdown_arrow}>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.5335 1.59961L5.86686 6.26628L1.2002 1.59961" stroke="#98A2B3" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown_options}>
          {foodOptions.map((option) => (
            <div
              key={option.id}
              className={styles.dropdown_option}
              onClick={() => handleOptionSelect(option)}
            >
              <span
                className={styles.option_icon}
                style={{ color: option.iconColor ,border:"1px solid"}}
              >
                {option.icon}
              </span>
              {option.label}
            </div>
          ))}
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const PaymentInformation = ({ onBack, onSubmit, saleData = null , handleBack}) => {
  const [joinYearOptions, setJoinYearOptions] = useState([]);
  const [defaultJoinYear, setDefaultJoinYear] = useState("");
  const [yearIdMap, setYearIdMap] = useState({});

  const [orientationOptions, setOrientationOptions] = useState([]);
  const [orientationIdMap, setOrientationIdMap] = useState({});

  const [streamOptions, setStreamOptions] = useState([]);
  const [streamIdMap, setStreamIdMap] = useState({});

  const [programOptions, setProgramOptions] = useState([]);
  const [programIdMap, setProgramIdMap] = useState({});

  const [batchOptions, setBatchOptions] = useState([]);
  const [batchMap, setBatchMap] = useState({});

  const [examProgramOptions, setExamProgramOptions] = useState([]);
  const [examProgramIdMap, setExamProgramIdMap] = useState({});

  const [sectionOptions, setSectionOptions] = useState([]);
  const [sectionIdMap, setSectionIdMap] = useState({});

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join years
  useEffect(() => {
    const fetchJoinYears = async () => {
      try {
        const data = await getJoinYears();
        if (data?.options) {
          const options = data.options.map((o) => o.academicYear);
          const map = {};
          data.options.forEach((o) => {
            map[o.academicYear] = o.acdcYearId;
          });
          setJoinYearOptions(options);
          setYearIdMap(map);
          if (data.default?.academicYear) {
            setDefaultJoinYear(data.default.academicYear);
          }
        }
      } catch (err) {
        console.error("Failed to fetch join years:", err);
      }
    };
    fetchJoinYears();
  }, []);

  // Orientations (reusing getCourses API)
  useEffect(() => {
    const fetchOrientations = async () => {
      try {
        const data = await getCourses(); // API name unchanged
        if (Array.isArray(data)) {
          const options = data.map((c) => c.course_track_name);
          const map = {};
          data.forEach((c) => {
            map[c.course_track_name] = c.courseTrackId;
          });
          setOrientationOptions(options);
          setOrientationIdMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch orientations:", err);
      }
    };
    fetchOrientations();
  }, []);

  // Sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sections = await getSections();
        if (Array.isArray(sections)) {
          const options = sections.map((s) => s.sectionName);
          const map = {};
          sections.forEach((s) => {
            map[s.sectionName] = s.section_id;
          });
          setSectionOptions(options);
          setSectionIdMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch sections:", err);
      }
    };
    fetchSections();
  }, []);

  // mock payments load
  useEffect(() => {
    setTimeout(() => {
      const data = [
        { head: "Tuition", amount: 5000, receiptNo: "R123", mode: "Cash", status: "Paid", date: "2025-08-01" },
        { head: "Admission", amount: 2000, receiptNo: "R124", mode: "Card", status: "Pending", date: "2025-08-05" },
      ];
      setPayments(data);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);

    const confirmationDataObject = {
      paymentInformation: {
        joinYear: values.joinYear,
        joinYearId: yearIdMap[values.joinYear] || 0,
        orientationName: values.orientationName,
        orientationTrackId: orientationIdMap[values.orientationName] || 0,
        stream: values.stream,
        streamId: streamIdMap[values.stream] || 0,
        program: values.program,
        programId: programIdMap[values.program] || 0,
        examProgram: values.examProgram,
        examProgramId: examProgramIdMap[values.examProgram] || 0,
        batchName: values.batchName,
        batchId: batchMap[values.batchName]?.courseBatchId || 0,
        section: values.section,
        sectionId: sectionIdMap[values.section] || 0,
        startDate: values.startDate,
        endDate: values.endDate,
        orientationFee: values.orientationFee,
        foodPreference: values.foodPreference,
        foodPreferenceId: values.foodPreferenceId, // Added for backend
        paymentTableData: payments,
      },
      timestamp: new Date().toISOString(),
      flow: "Confirmation Flow Complete",
    };

    const completeFlowData = {
      saleData: saleData || {},
      confirmationData: confirmationDataObject,
      timestamp: new Date().toISOString(),
      flow: "Complete Sale to Confirmation Flow",
    };

    console.log("Submit Data:", completeFlowData);

    if (onSubmit) {
      onSubmit(completeFlowData);
    } else {
      alert("Confirmation Information Submitted!");
    }
  };

  const initialValues = {
    joinYear: defaultJoinYear,
    joinYearId: yearIdMap[defaultJoinYear] || "",
    orientationName: "",
    orientationTrackId: "",
    stream: "",
    streamId: "",
    program: "",
    programId: "",
    examProgram: "",
    examProgramId: "",
    batchName: "",
    batchId: "",
    section: "",
    sectionId: "",
    startDate: "",
    endDate: "",
    campusId: "",
    orientationFee: "",
    foodPreference: "",
    foodPreferenceId: "", // Added to initialValues
  };

  return (
    <div className={styles.Payment_Information_payment_information}>
      <StudentInfoHeader items={headerItems} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={styles.Payment_Information_form}>
            {Object.keys(errors).length > 0 && console.log("Validation errors:", errors)}

            <CourseFeeWatcher />

            <div className={styles.Payment_Information_form_grid}>
              {/* Join Year */}
              <div>
                <Dropdown
                  dropdownname="Join Year"
                  name="joinYear"
                  value={values.joinYear}
                  onChange={(e) => {
                    const selectedYear = e.target.value;
                    setFieldValue("joinYear", selectedYear);
                    setFieldValue("joinYearId", yearIdMap[selectedYear] || "");
                  }}
                  results={joinYearOptions}
                  required
                />
                <ErrorMessage name="joinYear" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Orientation Name (was Course Name) */}
              <div>
                <Dropdown
                  dropdownname="Orientation Name"
                  name="orientationName"
                  value={values.orientationName}
                  onChange={async (e) => {
                    const selectedOrientation = e.target.value;
                    setFieldValue("orientationName", selectedOrientation);
                    const orientationTrackId = orientationIdMap[selectedOrientation] || "";
                    setFieldValue("orientationTrackId", orientationTrackId);

                    // Reset dependent fields
                    setFieldValue("stream", "");
                    setFieldValue("streamId", "");
                    setFieldValue("program", "");
                    setFieldValue("programId", "");
                    setFieldValue("examProgram", "");
                    setFieldValue("examProgramId", "");
                    setFieldValue("batchName", "");
                    setFieldValue("batchId", "");
                    setStreamOptions([]);
                    setProgramOptions([]);
                    setExamProgramOptions([]);
                    setBatchOptions([]);

                    if (orientationTrackId) {
                      // fetch streams by orientationTrackId
                      try {
                        const data = await getStreams(orientationTrackId);
                        if (Array.isArray(data)) {
                          const options = data.map((s) => s.streamName);
                          const map = {};
                          data.forEach((s) => {
                            map[s.streamName] = s.streamId;
                          });
                          setStreamOptions(options);
                          setStreamIdMap(map);
                        }
                      } catch (err) {
                        console.error("Failed to fetch streams by orientation:", err);
                      }

                      // fetch batches by orientation/ course track
                      try {
                        const batches = await getBatchesByCourse(orientationTrackId);
                        if (Array.isArray(batches)) {
                          const options = batches.map((b) => b.courseBatchName);
                          const map = {};
                          batches.forEach((b) => {
                            map[b.courseBatchName] = b;
                          });
                          setBatchOptions(options);
                          setBatchMap(map);
                        }
                      } catch (err) {
                        console.error("Failed to fetch batches:", err);
                      }
                    }
                  }}
                  results={orientationOptions}
                  searchable={true}
                  required
                />
                <ErrorMessage name="orientationName" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Stream */}
              <div>
                <Dropdown
                  dropdownname="Stream"
                  name="stream"
                  value={values.stream}
                  onChange={async (e) => {
                    const selectedStream = e.target.value;
                    setFieldValue("stream", selectedStream);
                    setFieldValue("streamId", streamIdMap[selectedStream] || "");
                    setFieldValue("program", "");
                    setFieldValue("programId", "");
                    setFieldValue("examProgram", "");
                    setFieldValue("examProgramId", "");
                    setProgramOptions([]);
                    setExamProgramOptions([]);

                    const streamId = streamIdMap[selectedStream];
                    if (streamId) {
                      try {
                        const programs = await getProgramsByStream(streamId);
                        if (Array.isArray(programs)) {
                          const options = programs.map((p) => p.programName);
                          const map = {};
                          programs.forEach((p) => {
                            map[p.programName] = p.programId;
                          });
                          setProgramOptions(options);
                          setProgramIdMap(map);
                        }
                      } catch (err) {
                        console.error("Failed to fetch programs:", err);
                      }
                    }
                  }}
                  results={streamOptions}
                  required
                />
                <ErrorMessage name="stream" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Program */}
              <div>
                <Dropdown
                  dropdownname="Program"
                  name="program"
                  value={values.program}
                  onChange={async (e) => {
                    const selectedProgram = e.target.value;
                    setFieldValue("program", selectedProgram);
                    setFieldValue("programId", programIdMap[selectedProgram] || "");
                    setFieldValue("examProgram", "");
                    setFieldValue("examProgramId", "");
                    setExamProgramOptions([]);

                    try {
                      const examPrograms = await getExamPrograms();
                      if (Array.isArray(examPrograms)) {
                        const filtered = examPrograms.filter(
                          (ep) => ep.programName?.programId === programIdMap[selectedProgram]
                        );
                        const options = filtered.map((ep) => ep.examProgramName);
                        const map = {};
                        filtered.forEach((ep) => {
                          map[ep.examProgramName] = ep.exam_program_id;
                        });
                        setExamProgramOptions(options);
                        setExamProgramIdMap(map);
                      }
                    } catch (err) {
                      console.error("Failed to fetch exam programs:", err);
                    }
                  }}
                  results={programOptions}
                  required
                />
                <ErrorMessage name="program" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Exam Program */}
              <div>
                <Dropdown
                  dropdownname="Exam Program"
                  name="examProgram"
                  value={values.examProgram}
                  onChange={(e) => {
                    const selectedExamProgram = e.target.value;
                    setFieldValue("examProgram", selectedExamProgram);
                    setFieldValue("examProgramId", examProgramIdMap[selectedExamProgram] || "");
                  }}
                  results={examProgramOptions}
                  required
                />
                <ErrorMessage name="examProgram" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Batch Name */}
              <div>
                <Dropdown
                  dropdownname="Batch Name"
                  name="batchName"
                  value={values.batchName}
                  onChange={(e) => {
                    const selectedBatchName = e.target.value;
                    setFieldValue("batchName", selectedBatchName);
                    const batch = batchMap[selectedBatchName];
                    if (batch) {
                      setFieldValue("batchId", batch.courseBatchId || "");
                      setFieldValue("startDate", batch.start_date || "");
                      setFieldValue("endDate", batch.end_date || "");
                    }
                  }}
                  results={batchOptions}
                  searchable
                  required
                />
                <ErrorMessage name="batchName" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Start Date */}
              <div>
                <Inputbox
                  label="Orientation Batch Start Date"
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={(e) => setFieldValue("startDate", e.target.value)}
                  required
                />
                <ErrorMessage name="startDate" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* End Date */}
              <div>
                <Inputbox
                  label="Orientation Batch End Date"
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={(e) => setFieldValue("endDate", e.target.value)}
                  required
                />
                <ErrorMessage name="endDate" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Orientation Fee */}
              <div>
                <Inputbox
                  label="Orientation Fee"
                  name="orientationFee"
                  // type="number"
                  value={values.orientationFee}
                  onChange={(e) => setFieldValue("orientationFee", e.target.value)}
                  required
                />
                <ErrorMessage name="orientationFee" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Section */}
              <div>
                <Dropdown
                  dropdownname="Section"
                  name="section"
                  value={values.section}
                  onChange={(e) => {
                    const selectedSection = e.target.value;
                    setFieldValue("section", selectedSection);
                    setFieldValue("sectionId", sectionIdMap[selectedSection] || "");
                  }}
                  results={sectionOptions}
                  required
                />
                <ErrorMessage name="section" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Food Preference (Food Type) */}
              <div>
                <label className={styles.food_preference_lable}>Food Preference</label>
                <CustomFoodDropdown
                  value={values.foodPreference}
                  onChange={(label, id) => {
                    setFieldValue("foodPreference", label);
                    setFieldValue("foodPreferenceId", id);
                  }}
                  error={touched.foodPreference && errors.foodPreference ? errors.foodPreference : null}
                />
              </div>
            </div>

            {/* Payments table */}
            <div className={styles.Payment_Information_table_wrapper}>
              {loading ? (
                <Typography>Loading payments...</Typography>
              ) : payments.length === 0 ? (
                <Typography color="error">
                  No payments found. Please complete the fee transaction before confirming admission.
                </Typography>
              ) : (
                <Table className={styles.Payment_Information_table}>
                  <TableHead>
                    <TableRow>
                      {["HEADS", "FEE AMOUNT", "RECEIPT NO", "PAYMENT MODE", "PAYMENT STATUS", "PAYMENT DATE"].map(
                        (h) => (
                          <TableCell key={h}>{h}</TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{p.head}</TableCell>
                        <TableCell>{p.amount}</TableCell>
                        <TableCell>{p.receiptNo}</TableCell>
                        <TableCell>{p.mode}</TableCell>
                        <TableCell>{p.status}</TableCell>
                        <TableCell>{p.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className={styles.Payment_Information_submit_wrapper}>
            <Button
          type="button"
          variant="secondary"
          buttonname="Back"
          lefticon={<BackArrow />} // Use the imported React component
          onClick={handleBack}

        />
        <Button
          type="submit"
          variant="primary"
          buttonname="Submit"
          righticon={<TrendingUpIcon />}
          onClick={handleSubmit}

        />
      </div>

      <a href="#" className={styles.concessionLinkButton}>
            <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
            </figure>
           proceed to payments
          </a>
           
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentInformation;
