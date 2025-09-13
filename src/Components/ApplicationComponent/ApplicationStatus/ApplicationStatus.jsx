import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getApplicationStatus } from "../../../Bakend/apis";
import styles from "./ApplicationStatus.module.css";
import searchIcon from "../../../Asserts/ApplicationStatus/Group.svg";
import filterIcon from "../../../Asserts/ApplicationStatus/Filter.svg";
import appliedFilterIcon from "../../../Asserts/ApplicationStatus/Vector.svg";
import exportIcon from "../../../Asserts/ApplicationStatus/Arrow up.svg";
import FilterPanel from "../FilterComponent/FilterPanel";
import FileExport from "../ExportComponent/FileExport";
import ApplicationStatusTable from "../ApplicationStatusTable/ApplicationStatusTable";
import SearchCards from "../SearchComponent/SearchCards";
 
const ApplicationStatus = () => {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("zone");
  const [selectedCampus, setSelectedCampus] = useState(1);
  const [studentCategory, setStudentCategory] = useState({
    all: true,
    sold: false,
    confirmed: false,
    unsold: false,
    withPro: false,
    damaged: false,
  });

  // Baseline refs to detect if user has applied any filter changes
  const initialCampusRef = useRef(38);
  const initialStudentCategoryRef = useRef({
    all: true,
    sold: false,
    confirmed: false,
    unsold: false,
    withPro: false,
    damaged: false,
  });
 
  // Map backend status to frontend display status
  const reverseStatusMap = {
    damaged: "DAMAGED",
    withpro: "AVAILABLE",
    "not confirmed": "UNSOLD",
    confirmed: "CONFIRMED",
    "with pro": "AVAILABLE",
    with_pro: "AVAILABLE",
    available: "AVAILABLE",
    unsold: "UNSOLD",
    "not sold": "UNSOLD",
    notsold: "UNSOLD",
    "un sold": "UNSOLD",
    approved: "CONFIRMED",
    broken: "DAMAGED",
    "": "UNKNOWN",
  };
 
  // Normalize API response fields
  const normalizeApiResponse = (data) => {
    const getFullName = (emp) =>
      emp && emp.first_name && emp.last_name
        ? `${emp.first_name} ${emp.last_name}`
        : emp?.name || "";
    return data.map((item) => ({
      ...item,
      applicationNo: item.num || item.applicationNo || item.application_no || "",
      zone: item.zone_name || item.zonal_name || item.zone || item.zoneName || "",
      zoneEmpId: item.zoneEmpId || item.zone_emp_id || null,
      campus: item.cmps_name || item.campus || item.campusName || "",
      campusId: item.cmps_id || item.campusId || item.campus_id || null,
      pro:
        item.pro_name ||
        item.pro ||
        item.proName ||
        getFullName(item.pro_employee) ||
        "",
      proId: item.proId || item.pro_id || null,
      dgm:
        item.dgm_name ||
        item.dgm ||
        item.dgmName ||
        getFullName(item.dgm_employee) ||
        "",
      dgmEmpId: item.dgmEmpId || item.dgm_emp_id || null,
      status: item.status || "",
      statusId: item.statusId || item.status_id || null,
      reason: item.reason || "",
      isSelected: !!item.isSelected,
    }));
  };
 
  useEffect(() => {
    const fetchData = async () => {
      // Skip fetching if selectedCampus is invalid
      if (!selectedCampus || selectedCampus === "All Campuses") {
        setData([]);
        setError("Please select a valid campus to view application status.");
        setLoading(false);
        return;
      }
 
      setLoading(true);
      setError(null);
      try {
        // Use selectedCampus as campusId (set to 1 initially)
        const campusId = selectedCampus;
        const result = await getApplicationStatus(campusId);
        console.log("API Result:", result);
        const uniqueStatuses = [...new Set(result.map((item) => item.status ?? "Unknown"))];
        console.log("Unique Status Values:", uniqueStatuses);
        const normalized = normalizeApiResponse(Array.isArray(result) ? result : []);
        setData(normalized);
      } catch (err) {
        console.error("Error fetching application status:", err);
        setError(err.message || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCampus]);
 
  const filteredDataMemo = useMemo(() => {
    let filtered = data;
 
    filtered = filtered.map((item) => {
      const backendStatus = (item.status ?? "").toLowerCase().trim();
      let displayStatus = reverseStatusMap[backendStatus] || backendStatus.toUpperCase() || "UNKNOWN";
      switch (backendStatus) {
        case "not confirmed":
          displayStatus = "Sold";
          break;
        case "available":
        case "withpro":
        case "with pro":
        case "with_pro":
          displayStatus = "With PRO";
          break;
        case "confirmed":
        case "approved":
          displayStatus = "Confirmed";
          break;
        case "unsold":
        case "not sold":
        case "notsold":
        case "un sold":
          displayStatus = "Unsold";
          break;
        case "damaged":
        case "broken":
          displayStatus = "Damaged";
          break;
        default:
          displayStatus = backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1).toLowerCase();
      }
      return { ...item, displayStatus };
    });
 
    if (search) {
      filtered = filtered.filter((item) =>
        String(item.applicationNo ?? "")
          .toLowerCase()
          .includes(String(search).toLowerCase())
      );
    }
 
    if (selectedCampus !== "All Campuses") {
      filtered = filtered.filter(
        (item) => (item.campusId ?? item.cmps_id ?? item.campus_id ?? "") === selectedCampus
      );
    }
 
    const isAllSelected =
      studentCategory.all &&
      !studentCategory.sold &&
      !studentCategory.confirmed &&
      !studentCategory.unsold &&
      !studentCategory.withPro &&
      !studentCategory.damaged;
    if (!isAllSelected) {
      filtered = filtered.filter((item) => {
        const status = item.displayStatus;
        return (
          studentCategory.all ||
          (studentCategory.sold && status === "Sold") ||
          (studentCategory.confirmed && status === "Confirmed") ||
          (studentCategory.unsold && status === "Unsold") ||
          (studentCategory.withPro && status === "With PRO") ||
          (studentCategory.damaged && status === "Damaged")
        );
      });
    }
 
    console.log("Computed filteredData:", filtered);
    return filtered;
  }, [data, search, selectedCampus, studentCategory]);
 
  useEffect(() => {
    setFilteredData(filteredDataMemo);
    if (filteredDataMemo.length <= pageIndex * 10) {
      setPageIndex(0);
    }
  }, [filteredDataMemo]);
 
  useEffect(() => {
    const isCategoryChanged = (a, b) =>
      a.all !== b.all ||
      a.sold !== b.sold ||
      a.confirmed !== b.confirmed ||
      a.unsold !== b.unsold ||
      a.withPro !== b.withPro ||
      a.damaged !== b.damaged;

    const applied =
      selectedCampus !== initialCampusRef.current ||
      isCategoryChanged(studentCategory, initialStudentCategoryRef.current);

    setIsFilterApplied(applied);
  }, [selectedCampus, studentCategory]);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      const exportPanel = document.querySelector(`[class*="exportContainer"]`);
      const filterPanel = document.querySelector(`[class*="filter_panel"]`);
      const filterButton = event.target.closest(
        `.${styles["application-status__filter-btn"]}`
      );
      const exportButton = event.target.closest(
        `.${styles["application-status__export-btn"]}`
      );
      if (
        showExport &&
        exportPanel &&
        !exportPanel.contains(event.target) &&
        !exportButton
      ) {
        setShowExport(false);
      }
      if (
        showFilter &&
        filterPanel &&
        !filterPanel.contains(event.target) &&
        !filterButton
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExport, showFilter]);
 
  const handleCardClick = (item) => {
    const applicationNo = item?.applicationNo;
    const displayStatus = item?.displayStatus;
    
    // Debug logging for the item data
    console.log("🖱️ Card clicked - Item data:", {
      applicationNo,
      displayStatus,
      campus: item.campus,
      cmps_name: item.cmps_name,
      campusName: item.campusName,
      zone: item.zone,
      zonal_name: item.zonal_name,
      zoneName: item.zoneName,
      fullItem: item
    });
    
    if (applicationNo) {
      const route = displayStatus === "Damaged" ? "damaged" : "sale";
      const initialValues = {
        applicationNo: item.applicationNo || "",
        zoneName: item.zonal_name || item.zone || item.zoneName || "",
        zone: item.zonal_name || item.zone || item.zoneName || "",
        zoneEmpId: item.zoneEmpId || item.zone_emp_id || "",
        campusName: item.cmps_name || item.campus || item.campusName || "",
        campus: item.cmps_name || item.campus || item.campusName || "",
        campusId: item.campusId || item.campus_id || "",
        proName:
          item.pro ||
          item.proName ||
          item.pro_name ||
          (item.pro_employee ? `${item.pro_employee.first_name} ${item.pro_employee.last_name}` : "") ||
          "",
        proId: item.proId || item.pro_id || "",
        dgmName:
          item.dgm ||
          item.dgmName ||
          item.dgm_name ||
          (item.dgm_employee ? `${item.dgm_employee.first_name} ${item.dgm_employee.last_name}` : "") ||
          "",
        dgmEmpId: item.dgmEmpId || item.dgm_emp_id || "",
        status: reverseStatusMap[(item.status || "").toLowerCase()] || item.status?.toUpperCase() || "UNKNOWN",
        statusId: item.statusId || item.status_id || "",
        reason: item.reason || "",
      };
      
      console.log("🚀 Navigating with initialValues:", initialValues);
      
      navigate(`/application/${applicationNo}/${route}`, {
        state: {
          initialValues: initialValues,
        },
      });
    }
  };
 
  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>{error}</div>;
 
  return (
    <div className={styles["application-status"]}>
      {(showFilter || showExport) && (
        <div
          className={styles["application-status__overlay"]}
          onClick={() => {
            setShowFilter(false);
            setShowExport(false);
          }}
        />
      )}
      <div className={styles["application-status__card"]}>
        <h2 className={styles["application-status__title"]}>Application Status</h2>
        <p className={styles["application-status__subtitle"]}>
          Access and manage comprehensive student details seamlessly. View
          personalized profiles tailored to your campus.
        </p>
        <div className={styles["application-status__actions"]}>
          <div className={styles["application-status__search"]}>
            <figure className={styles["application-status__search-icon"]}>
              <img src={searchIcon} alt="Search" />
            </figure>
            <input
              type="text"
              placeholder="Search with application no"
              value={search}
              onChange={(e) => setSearch(e.target.value.trim())}
            />
          </div>
          {!search && (
            <div className={styles["application-status__filter"]}>
              <button
                className={styles["application-status__filter-btn"]}
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <span className={styles["application-status__filter-icon-wrapper"]}>
                  <img
                    src={isFilterApplied ? appliedFilterIcon : filterIcon}
                    alt="Filter"
                  />
                  {isFilterApplied && (
                    <span className={styles["application-status__filter-dot"]}></span>
                  )}
                </span>
                Filter
              </button>
              {showFilter && (
                <FilterPanel
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedCampus={selectedCampus}
                  setSelectedCampus={setSelectedCampus}
                  studentCategory={studentCategory}
                  setStudentCategory={setStudentCategory}
                />
              )}
            </div>
          )}
          {!search && (
            <div className={styles["application-status__export"]}>
              <button
                className={styles["application-status__export-btn"]}
                onClick={() => setShowExport((prev) => !prev)}
              >
                <img src={exportIcon} alt="Export" /> Export
              </button>
              {showExport && (
                <FileExport onExport={(type) => console.log("Export:", type)} />
              )}
            </div>
          )}
        </div>
     
        {search ? (
          filteredData.length === 0 ? (
            <p className={styles["application-status__no-results"]}>
              No results found for "{search}"
            </p>
          ) : (
            <SearchCards
              data={filteredData}
              maxResults={5}
              onCardClick={handleCardClick}
            />
          )
        ) : filteredData.length === 0 ? (
          <p className={styles["application-status__no-results"]}>
            No results found
          </p>
        ) : (
          <ApplicationStatusTable
            filteredData={filteredData}
            setData={setData}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
          />
        )}
      </div>
    </div>
  );
};
 
export default ApplicationStatus;