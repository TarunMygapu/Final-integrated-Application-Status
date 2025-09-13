import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/student-admissions-sale'; // Backend URL
const DISTRIBUTION_API_BASE_URL = 'http://localhost:8080/distribution/gets'; // Distribution API base URL

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
  });
  throw error.response?.data || error.message || 'An error occurred';
};

// API calls for dropdowns (aligned with backend endpoints)
export const fetchAdmissionTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admission-types`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchStudentTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student-types`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchGenders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genders`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sections`, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.data && typeof response.data === 'object') {
      return Array.isArray(response.data) ? response.data : [response.data];
    } else if (response.data) {
      try {
        const parsedData = JSON.parse(response.data);
        return Array.isArray(parsedData) ? parsedData : [parsedData];
      } catch (parseError) {
        console.error("Failed to parse sections data:", parseError);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching sections:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const fetchCampuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campuses`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchClasses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classes`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// export const fetchCourseBatches = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/course-batches`);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };


export const fetchQuotas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quotas`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchRelationTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relation-types`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCityById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/city/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchOrientationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orientation/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchMandalById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mandal/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConcessionReasonById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/concession-reason/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConcessionReasons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/concession-reasons`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchOrganizationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/organization/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchBankById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bank/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Employees Response:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const submitAdmissionForm = async (formData) => {
  try {
    console.log("🚀 ===== SUBMITTING TO BACKEND =====");
    console.log("📋 Complete Form Data being sent:", JSON.stringify(formData, null, 2));
    
    // Check for null/undefined ID fields that might cause the error
    const nullIdFields = [];
    const checkForNullIds = (obj, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (key.toLowerCase().includes('id') && (value === null || value === undefined || value === '')) {
          nullIdFields.push(`${prefix}${key}: ${value}`);
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkForNullIds(value, `${prefix}${key}.`);
        }
      });
    };
    
    checkForNullIds(formData);
    
    if (nullIdFields.length > 0) {
      console.log("⚠️ NULL ID FIELDS FOUND:", nullIdFields);
    } else {
      console.log("✅ No null ID fields found");
    }
    
    console.log("🚀 ===== END BACKEND SUBMISSION =====");
    
    const response = await axios.post(`${API_BASE_URL}/create`, formData);
    return response.data;
  } catch (error) {
    console.error("❌ Backend submission failed:", error);
    handleApiError(error);
  }
};

export const getApplicationDetails = async (applicationNo) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/applications/${applicationNo}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Application Details Response for ${applicationNo}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching application details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// New APIs for distribution-based endpoints
export const fetchDistributionStates = async () => {
  try {
    const url = `${DISTRIBUTION_API_BASE_URL}/states`;
    console.log("=== API Call Details ===");
    console.log("Base URL:", DISTRIBUTION_API_BASE_URL);
    console.log("Full URL:", url);
    console.log("Making request to:", url);
    
    const response = await axios.get(url);
    console.log("=== API Response Details ===");
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Is response data array:", Array.isArray(response.data));
    
    return response.data;
  } catch (error) {
    console.error("=== API Error Details ===");
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Request URL:", error.config?.url);
    handleApiError(error);
  }
};

export const fetchDistrictsByDistributionState = async (stateId) => {
  try {
    const response = await axios.get(`${DISTRIBUTION_API_BASE_URL}/districts/${stateId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCitiesByDistributionDistrict = async (districtId) => {
  try {
    const response = await axios.get(`${DISTRIBUTION_API_BASE_URL}/cities/${districtId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchMandalsByDistributionDistrict = async (districtId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mandals/${districtId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// New APIs for Payment Info Section
export const fetchOrganizations = async () => {
  try {
    console.log("Fetching organizations from:", `${API_BASE_URL}/organizations`);
    const response = await axios.get(`${API_BASE_URL}/organizations`);
    console.log("Organizations API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    handleApiError(error);
  }
};

export const fetchCities = async () => {
  try {
    console.log("Fetching cities from:", `${DISTRIBUTION_API_BASE_URL}/cities`);
    const response = await axios.get(`${DISTRIBUTION_API_BASE_URL}/cities`);
    console.log("Cities API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    handleApiError(error);
  }
};

export const fetchBanksByOrganization = async (organizationId) => {
  try {
    console.log("Fetching banks for organization:", organizationId);
    const response = await axios.get(`${API_BASE_URL}/banks/${organizationId}`);
    console.log("Banks API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching banks by organization:", error);
    handleApiError(error);
  }
};

export const fetchBranchesByOrganizationAndBank = async (organizationId, bankId) => {
  try {
    console.log("Fetching branches for organization:", organizationId, "and bank:", bankId);
    const response = await axios.get(`${API_BASE_URL}/branches/${organizationId}/${bankId}`);
    console.log("Branches API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching branches by organization and bank:", error);
    handleApiError(error);
  }
};

// New APIs for Concession Info Section
export const fetchAuthorizedByAll = async () => {
  try {
    console.log("Fetching authorized by all from:", `${API_BASE_URL}/authorizedBy/all`);
    const response = await axios.get(`${API_BASE_URL}/authorizedBy/all`);
    console.log("Authorized by all API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching authorized by all:", error);
    handleApiError(error);
  }
};

export const fetchConcessionReasonAll = async () => {
  try {
    console.log("Fetching concession reason all from:", `${API_BASE_URL}/concessionReson/all`);
    const response = await axios.get(`${API_BASE_URL}/concessionReson/all`);
    console.log("Concession reason all API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching concession reason all:", error);
    handleApiError(error);
  }
};

// Fetch classes by campus for GeneralInfoSection
export const fetchClassesByCampus = async (campusId) => {
  try {
    console.log("Fetching classes by campus from:", `${API_BASE_URL}/classes/by-campus/${campusId}`);
    const response = await axios.get(`${API_BASE_URL}/classes/by-campus/${campusId}`);
    console.log("Classes by campus API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching classes by campus:", error);
    handleApiError(error);
  }
};

// Fetch orientations by class for GeneralInfoSection
export const fetchOrientationsByClass = async (classId) => {
  try {
    console.log("Fetching orientations by class from:", `${API_BASE_URL}/orientations/by-class/${classId}`);
    const response = await axios.get(`${API_BASE_URL}/orientations/by-class/${classId}`);
    console.log("Orientations by class API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orientations by class:", error);
    handleApiError(error);
  }
};

// Fetch orientation batches for GeneralInfoSection
export const fetchOrientationBatches = async (cmpsId, classId, orientationId) => {
  try {
    console.log("Fetching orientation batches from:", `${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}`);
    const response = await axios.get(`${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}`);
    console.log("Orientation batches API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orientation batches:", error);
    handleApiError(error);
  }
};

// Fetch orientation details by campus, class, orientation and batch for GeneralInfoSection
export const fetchOrientationDetails = async (cmpsId, classId, orientationId, orientationBatchId) => {
  try {
    console.log("Fetching orientation details from:", `${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}/${orientationBatchId}/details`);
    const response = await axios.get(`${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}/${orientationBatchId}/details`);
    console.log("Orientation details API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orientation details:", error);
    handleApiError(error);
  }
};

// Fetch school states for GeneralInfoSection
export const fetchSchoolStates = async () => {
  try {
    console.log("Fetching school states from:", `http://localhost:8080/distribution/gets/states`);
    const response = await axios.get(`http://localhost:8080/distribution/gets/states`);
    console.log("School states API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching school states:", error);
    handleApiError(error);
  }
};

// Fetch school districts by state for GeneralInfoSection
export const fetchSchoolDistricts = async (stateId) => {
  try {
    console.log("Fetching school districts from:", `http://localhost:8080/distribution/gets/districts/${stateId}`);
    const response = await axios.get(`http://localhost:8080/distribution/gets/districts/${stateId}`);
    console.log("School districts API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching school districts:", error);
    handleApiError(error);
  }
};

// Fetch school types for GeneralInfoSection
export const fetchSchoolTypesNew = async () => {
  try {
    console.log("Fetching school types from:", `${API_BASE_URL}/Type_of_school`);
    const response = await axios.get(`${API_BASE_URL}/Type_of_school`);
    console.log("School types API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching school types:", error);
    handleApiError(error);
  }
};

// Update the existing fetchSchoolTypes to use the correct endpoint
export const fetchSchoolTypes = async () => {
  try {
    console.log("Fetching school types from:", `${API_BASE_URL}/Type_of_school`);
    const response = await axios.get(`${API_BASE_URL}/Type_of_school`);
    console.log("School types API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching school types:", error);
    handleApiError(error);
  }
};

// Fetch religions for GeneralInfoSection
export const fetchReligions = async () => {
  try {
    console.log("Fetching religions from:", `${API_BASE_URL}/religions`);
    const response = await axios.get(`${API_BASE_URL}/religions`);
    console.log("Religions API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching religions:", error);
    handleApiError(error);
  }
};

// Fetch castes for GeneralInfoSection
export const fetchCastes = async () => {
  try {
    console.log("Fetching castes from:", `${API_BASE_URL}/castes`);
    const response = await axios.get(`${API_BASE_URL}/castes`);
    console.log("Castes API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching castes:", error);
    handleApiError(error);
  }
};

// Fetch blood groups for GeneralInfoSection
export const fetchBloodGroups = async () => {
  try {
    console.log("Fetching blood groups from:", `${API_BASE_URL}/BloodGroup/all`);
    const response = await axios.get(`${API_BASE_URL}/BloodGroup/all`);
    console.log("Blood groups API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching blood groups:", error);
    handleApiError(error);
  }
};

// Fetch all student classes for siblings
export const fetchAllStudentClasses = async () => {
  try {
    console.log("Fetching all student classes from:", `${API_BASE_URL}/all/Studentclass`);
    const response = await axios.get(`${API_BASE_URL}/all/Studentclass`);
    console.log("All student classes API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all student classes:", error);
    handleApiError(error);
  }
};

// New cascading dropdown APIs

export const fetchBatchTypeByCampusAndClass = async (campusId, classId) => {
  try {
    console.log("Fetching batch type from:", `${API_BASE_URL}/study-typebycmpsId_and_classId?cmpsId=${campusId}&classId=${classId}`);
    const response = await axios.get(`${API_BASE_URL}/study-typebycmpsId_and_classId?cmpsId=${campusId}&classId=${classId}`);
    console.log("Batch type API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching batch type:", error);
    handleApiError(error);
  }
};

export const fetchOrientationNameByCampusClassAndStudyType = async (campusId, classId, studyTypeId) => {
  try {
    console.log("Fetching orientation name from:", `${API_BASE_URL}/orientationbycmpsId_and_classId_and_studyType?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}`);
    const response = await axios.get(`${API_BASE_URL}/orientationbycmpsId_and_classId_and_studyType?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}`);
    console.log("Orientation name API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orientation name:", error);
    handleApiError(error);
  }
};

export const fetchOrientationBatchByAllFields = async (campusId, classId, studyTypeId, orientationId) => {
  try {
    console.log("Fetching orientation batch from:", `${API_BASE_URL}/orientation-batchbycmpsId_and_classId_and_studyType_and_orientation?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}`);
    const response = await axios.get(`${API_BASE_URL}/orientation-batchbycmpsId_and_classId_and_studyType_and_orientation?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}`);
    console.log("Orientation batch API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orientation batch:", error);
    handleApiError(error);
  }
};

export const fetchOrientationStartDateAndFee = async (campusId, classId, studyTypeId, orientationId, orientationBatchId) => {
  try {
    console.log("Fetching orientation details from:", `${API_BASE_URL}/get_orientation_startDate_and_fee?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}&orientationBatchId=${orientationBatchId}`);
    const response = await axios.get(`${API_BASE_URL}/get_orientation_startDate_and_fee?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}&orientationBatchId=${orientationBatchId}`);
    console.log("Orientation details API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orientation details:", error);
    handleApiError(error);
  }
};

// Default export with all API functions
const apiService = {
  fetchDistributionStates,
  fetchDistrictsByDistributionState,
  fetchCitiesByDistributionDistrict,
  fetchMandalsByDistributionDistrict,
  fetchOrganizations,
  fetchCities,
  fetchBanksByOrganization,
  fetchBranchesByOrganizationAndBank,
  fetchAuthorizedByAll,
  fetchConcessionReasonAll,
  fetchAdmissionTypes,
  fetchStudentTypes,
  fetchGenders,
  getSections,
  fetchCampuses,
  fetchCourses,
  // fetchCourseBatches,
  fetchSchoolTypes,
  fetchQuotas,
  fetchRelationTypes,
  fetchClasses,
  fetchCityById,
  fetchOrientationById,
  fetchMandalById,
  fetchConcessionReasonById,
  fetchConcessionReasons,
  fetchOrganizationById,
  fetchBankById,
  fetchEmployees,
  submitAdmissionForm,
  getApplicationDetails,
  // Aliases for backward compatibility
  getAdmissionTypes: fetchAdmissionTypes,
  getStudentTypes: fetchStudentTypes,
  getGenders: fetchGenders,
  getSections: getSections,
  getCampuses: fetchCampuses,
  getCourses: fetchCourses,
  // getCourseBatches: fetchCourseBatches,
  getSchoolTypes: fetchSchoolTypes,
  getQuotas: fetchQuotas,
  getRelationTypes: fetchRelationTypes,
  getClasses: fetchClasses,
  getCityById: fetchCityById,
  getOrientationById: fetchOrientationById,
  getMandalById: fetchMandalById,
  getConcessionReasonById: fetchConcessionReasonById,
  getConcessionReasons: fetchConcessionReasons,
  getOrganizationById: fetchOrganizationById,
  getBankById: fetchBankById,
  getEmployees: fetchEmployees,
  getOrganizations: fetchOrganizations,
  getCities: fetchCities,
  getBanksByOrganization: fetchBanksByOrganization,
  getBranchesByOrganizationAndBank: fetchBranchesByOrganizationAndBank,
  getAuthorizedByAll: fetchAuthorizedByAll,
  getConcessionReasonAll: fetchConcessionReasonAll,
  // New APIs for GeneralInfoSection
  fetchClassesByCampus,
  fetchOrientationsByClass,
  fetchOrientationBatches,
  fetchOrientationDetails,
  fetchSchoolStates,
  fetchSchoolDistricts,
  fetchSchoolTypes,
  fetchReligions,
  fetchCastes,
  fetchBloodGroups,
  fetchAllStudentClasses,
  // New cascading dropdown APIs
  fetchBatchTypeByCampusAndClass,
  fetchOrientationNameByCampusClassAndStudyType,
  fetchOrientationBatchByAllFields,
  fetchOrientationStartDateAndFee,
};

export default apiService;