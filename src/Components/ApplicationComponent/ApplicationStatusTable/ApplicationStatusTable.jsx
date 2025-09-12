import React from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStatusDataTable from "../../../Widgets/ApplicationStatusDataTable/ApplicationStatusDataTable";
import styles from "./ApplicationStatusTable.module.css";

const ApplicationStatusTable = ({ filteredData, setData, pageIndex, setPageIndex }) => {
  const navigate = useNavigate();
  const pageSize = 10;

  const columns = React.useMemo(
    () => [
      { accessorKey: "applicationNo", header: "Application No" },
      { accessorKey: "pro", header: "PRO" },
      { accessorKey: "campus", header: "Campus" },
      { accessorKey: "dgm", header: "DGM" },
      { accessorKey: "zone", header: "Zone" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const backendStatus = row?.original?.status ?? "";
          const normalizedStatus = backendStatus.toLowerCase().trim();
          let displayStatus = "";
          switch (normalizedStatus) {
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
              displayStatus =
                backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1).toLowerCase();
              break;
          }
          return (
            <span
              className={`${styles.Application_Status_Table_status_badge} ${
                styles[displayStatus.replace(/\s+/g, "").toLowerCase()] || ""
              }`}
            >
              {displayStatus}
            </span>
          );
        },
      },
    ],
    [styles]
  );

  const unwrapRow = (rowOrRowObject) => rowOrRowObject?.original ?? rowOrRowObject ?? {};
  const extractId = (rowObj) => rowObj?.applicationNo ?? rowObj?.id ?? null;

  const handleSelectRow = (row, checked) => {
    const rowObj = unwrapRow(row);
    const idToToggle = extractId(rowObj);
    if (idToToggle == null) return;
    setData((prevData) =>
      prevData.map((item) => {
        const itemId = extractId(item);
        if (itemId === idToToggle) {
          return { ...item, isSelected: checked };
        }
        return item;
      })
    );
  };

  const handleNavigateToSale = (row) => {
    const rowObj = unwrapRow(row);
    const id = extractId(rowObj);
    
    // Debug logging for table navigation
    console.log("🔄 Table Update button clicked - Sale navigation:", {
      applicationNo: id,
      rowObj: rowObj,
      campus: rowObj.campus,
      cmps_name: rowObj.cmps_name,
      campusName: rowObj.campusName,
      zone: rowObj.zone,
      zonal_name: rowObj.zonal_name,
      zoneName: rowObj.zoneName
    });
    
    if (id != null) {
      const initialValues = {
        applicationNo: rowObj.applicationNo || "",
        zoneName: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
        zone: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
        zoneEmpId: rowObj.zoneEmpId || rowObj.zone_emp_id || "",
        campusName: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
        campus: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
        campusId: rowObj.campusId || rowObj.campus_id || "",
        proName: rowObj.pro || rowObj.proName || rowObj.pro_name || "",
        proId: rowObj.proId || rowObj.pro_id || "",
        dgmName: rowObj.dgm || rowObj.dgmName || rowObj.dgm_name || "",
        dgmEmpId: rowObj.dgmEmpId || rowObj.dgm_emp_id || "",
        status: rowObj.status || "",
        statusId: rowObj.statusId || rowObj.status_id || "",
        reason: rowObj.reason || "",
      };
      
      console.log("🚀 Table navigating to Sale with initialValues:", initialValues);
      
      navigate(`/application/${id}/sale`, {
        state: { 
          initialValues: initialValues,
        },
      });
    }
  };

  const handleNavigateToConfirmation = (row) => {
    const rowObj = unwrapRow(row);
    const id = extractId(rowObj);
    if (id != null) {
      navigate(`/application/${id}/confirmation`, {
        state: { 
          initialValues: {
            applicationNo: rowObj.applicationNo || "",
            zoneName: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
            zone: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
            zoneEmpId: rowObj.zoneEmpId || rowObj.zone_emp_id || "",
            campusName: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
            campus: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
            campusId: rowObj.campusId || rowObj.campus_id || "",
            proName: rowObj.pro || rowObj.proName || rowObj.pro_name || "",
            proId: rowObj.proId || rowObj.pro_id || "",
            dgmName: rowObj.dgm || rowObj.dgmName || rowObj.dgm_name || "",
            dgmEmpId: rowObj.dgmEmpId || rowObj.dgm_emp_id || "",
            status: rowObj.status || "",
            statusId: rowObj.statusId || rowObj.status_id || "",
            reason: rowObj.reason || "",
          }
        },
      });
    }
  };

  const handleNavigateToDamage = (row) => {
    const rowObj = unwrapRow(row);
    const id = extractId(rowObj);
    if (id != null) {
      navigate(`/application/${id}/damaged`, {
        state: { 
          initialValues: {
            applicationNo: rowObj.applicationNo || "",
            zoneName: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
            zone: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
            zoneEmpId: rowObj.zoneEmpId || rowObj.zone_emp_id || "",
            campusName: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
            campus: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
            campusId: rowObj.campusId || rowObj.campus_id || "",
            proName: rowObj.pro || rowObj.proName || rowObj.pro_name || "",
            proId: rowObj.proId || rowObj.pro_id || "",
            dgmName: rowObj.dgm || rowObj.dgmName || rowObj.dgm_name || "",
            dgmEmpId: rowObj.dgmEmpId || rowObj.dgm_emp_id || "",
            status: rowObj.status || "",
            statusId: rowObj.statusId || rowObj.status_id || "",
            reason: rowObj.reason || "",
          }
        },
      });
    }
  };

  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className={styles.Application_Status_Table_application_status_table}>
      <ApplicationStatusDataTable
        columns={columns}
        data={paginatedData}
        onSelectRow={handleSelectRow}
        onNavigateToSale={handleNavigateToSale}
        onNavigateToConfirmation={handleNavigateToConfirmation}
        onNavigateToDamage={handleNavigateToDamage}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        totalData={filteredData.length}
      />
    </div>
  );
};

export default ApplicationStatusTable;