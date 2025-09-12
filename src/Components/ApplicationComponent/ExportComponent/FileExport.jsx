import React, { useState } from "react";
import styles from "./FileExport.module.css"; // ✅ use CSS module
 
const FileExport = ({ onExport }) => {
  const [selectedType, setSelectedType] = useState("Pdf");
 
  const fileTypes = ["Pdf", ".xls", "doc"];
 
  const handleSelect = (type) => {
    setSelectedType(type);
    if (onExport) {
      onExport(type);
    }
  };
 
  return (
    <div className={styles.exportContainer}>
      <div className={styles.fileTypeWrapper}>
        <span className={styles.fileTypeLabel}>File Type</span>
        <div className={styles.fileTypeOptions}>
          {fileTypes.map((type) => (
            <button
              key={type}
              className={`${styles.fileTypeBtn} ${
                selectedType === type ? styles.active : ""
              }`}
              onClick={() => handleSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default FileExport;
 