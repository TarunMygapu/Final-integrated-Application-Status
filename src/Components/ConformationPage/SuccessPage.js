import React from "react";
import styles from "./SuccessPage.module.css";
import pageicon from "../../../src/Asserts/image (1).jpeg";
import Statusbar from "../../Widgets/StatusBar/Statusbar";

const SuccessPage = ({ applicationNo, studentName, amount, campus, onBack, statusType = "sale" }) => {
  const isSold = statusType === "sale" || statusType === "confirmation";
  const isConfirmed = statusType === "confirmation";

  return (
    <div className={styles.Success_Page_root}>
      <div className={styles.Success_Page_paper}>
        <Statusbar isSold={isSold} isConfirmed={isConfirmed} showLabels={true} reducedGap={true} labelWidth="36%" />
        
        <div className={styles.Success_Page_iconContainer}>
          <img src={pageicon} alt="Success Icon" className={styles.Success_Page_iconImage} />
        </div>

        <h5 className={styles.Success_Page_title}>
          Application No: {applicationNo || "N/A"}
        </h5>

        <h6 className={styles.Success_Page_subtitle}>Update Successful</h6>
        <p className={styles.Success_Page_description}>
          Application Details Added Successfully
        </p>

        {studentName && <p className={styles.Success_Page_detail}>Student: {studentName}</p>}
        {amount && <p className={styles.Success_Page_detail}>Amount Paid: {amount}</p>}
        {campus && <p className={styles.Success_Page_detail}>Campus: {campus}</p>}

        <button
          className={styles.Success_Page_button}
          onClick={onBack || (() => console.log("Redirect to Application Status"))}
        >
          Back To Application Status
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;