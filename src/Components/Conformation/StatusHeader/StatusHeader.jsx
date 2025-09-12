import React from "react";
import styles from "./StatusHeader.module.css"; 

const StatusHeader = ({ applicationNo, campusName, zoneName }) => {
  console.log("StatusHeader received props:", { applicationNo, campusName, zoneName });
  const headerItems = [
    { label: "Application No", value: applicationNo || "-" },
    { label: "Campus", value: campusName || "-" },
    { label: "Zone", value: zoneName || "-" },
  ];

  return (
    <div className={styles.status_info_header}>
      <div className={styles.status_text_header}>
        {headerItems.map((item) => (
          <div key={item.label} className={styles.status_info_item}>
            <div className={styles.status_label}>{item.label}</div>
            <div className={styles.status_value}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusHeader;