import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HeaderContainer from './Container/HeaderContainer/HeaderContainer';
import SidebarContainer from './Container/SidebarContainer/SidebarContainer';

import ApplicationStatus from './Components/ApplicationComponent/ApplicationStatus/ApplicationStatus';
import ApplicationStatusForm from './Components/ApplicationComponent/ApplicationStatusForm/AppplicationStatusForm';

function App() {
  return (
    <div className="app-layout">
      {/* Header */}
      <HeaderContainer />

      <div className="body-layout">
        {/* Sidebar */}
        <SidebarContainer />

        {/* Main content */}
        <main className="content-area ">
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <h2>Dashboard</h2>
              }
            />

            {/* Application */}
            <Route path="/application" element={<ApplicationStatus />} />
            <Route path="/application/:applicationNo/:status?" element={<ApplicationStatusForm />} />

            {/* Students */}
            <Route
              path="/students"
              element={<h2>Student</h2>
              }
            />

            {/* Other Sidebar Pages - Only Text */}
            <Route path="/employee" element={<h2>Employee Page</h2>} />
            <Route path="/fleet" element={<h2>Fleet Page</h2>} />
            <Route path="/warehouse" element={<h2>Warehouse Page</h2>} />
            <Route path="/sms" element={<h2>SMS Page</h2>} />
            <Route path="/question-bank" element={<h2>Question Bank Page</h2>} />
            <Route path="/assets" element={<h2>Assets Management Page</h2>} />
            <Route path="/payments" element={<h2>Payment Services Page</h2>} />
            <Route path="/cctv" element={<h2>CCTV Page</h2>} />
            <Route path="/hrms" element={<h2>HRMS Page</h2>} />
            <Route path="/masters" element={<h2>Masters Page</h2>} />

            {/* Fallback */}
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
