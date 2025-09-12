import React, { useState, useEffect, useRef } from "react";
import styles from "./FilterPanel.module.css";
import arrowDownIcon from "../../../Asserts/ApplicationStatus/arrow-down.svg";
 
const FilterPanel = ({
  activeTab,
  setActiveTab,
  selectedZone,
  setSelectedZone,
  selectedDgm,
  setSelectedDgm,
  selectedCampus,
  setSelectedCampus,
  studentCategory,
  setStudentCategory,
}) => {
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isDgmOpen, setIsDgmOpen] = useState(false);
  const [isCampusOpen, setIsCampusOpen] = useState(false);
  const [zoneSearch, setZoneSearch] = useState("");
  const [dgmSearch, setDgmSearch] = useState("");
  const [campusSearch, setCampusSearch] = useState("");
 
  const panelRef = useRef(null);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsZoneOpen(false);
        setIsDgmOpen(false);
        setIsCampusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const handleCategoryChange = (category) => {
    setStudentCategory((prev) => {
      if (category === "all") {
        return {
          all: !prev.all,
          sold: false,
          confirmed: false,
          unsold: false,
          withPro: false,
          damaged: false,
        };
      } else {
        const newState = { ...prev, [category]: !prev[category], all: false };
        const noOtherCategoriesSelected =
          !newState.sold &&
          !newState.confirmed &&
          !newState.unsold &&
          !newState.withPro &&
          !newState.damaged;
        if (noOtherCategoriesSelected) {
          newState.all = true;
        }
        return newState;
      }
    });
  };
 
  const handleResetFilters = () => {
    setSelectedZone("All Zones");
    setSelectedDgm("All DGMs");
    setSelectedCampus("All Campuses");
    setStudentCategory({
      all: true,
      sold: false,
      confirmed: false,
      unsold: false,
      withPro: false,
      damaged: false,
    });
    setActiveTab("zone");
  };
 
  const filteredZones = [
    "All Zones",
    "North Zone",
    "South Zone",
    "East Zone",
    "West Zone",
  ].filter((zone) => zone.toLowerCase().includes(zoneSearch.toLowerCase()));
 
  const filteredDgms = ["All DGMs", "DGM 1", "DGM 2", "DGM 3", "DGM 4"].filter(
    (dgm) => dgm.toLowerCase().includes(dgmSearch.toLowerCase())
  );
 
  const filteredCampuses = [
    "All Campuses",
    "Campus A",
    "Campus B",
    "Campus C",
    "Campus D",
  ].filter((campus) =>
    campus.toLowerCase().includes(campusSearch.toLowerCase())
  );
 
  return (
    <div className={styles.filter_panel} ref={panelRef}>
  
 
      {/* Student Category */}
      <div className={styles.filter_panel__student_category}>
        <label className={styles.filter_panel__student_category_label}>
          Application Category
        </label>
        <div className={styles.filter_panel__student_category_grid}>
          {[
            { key: "all", label: "All" },
            { key: "sold", label: "Sold" },
            { key: "confirmed", label: "Confirmed" },
            { key: "unsold", label: "Unsold" },
            { key: "withPro", label: "With PRO" },
            { key: "damaged", label: "Damaged" },
          ].map(({ key, label }) => (
            <div className={styles.filter_panel__category_item} key={key}>
              <input
                type="checkbox"
                className={styles.filter_panel__checkbox}
                id={key}
                checked={studentCategory[key]}
                onChange={() => handleCategoryChange(key)}
              />
              <label
                htmlFor={key}
                className={styles.filter_panel__checkbox_label}
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default FilterPanel;
 