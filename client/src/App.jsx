import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PatientListPage from './pages/PatientListPage';
import RegisterPatientPage from './pages/RegisterPatientPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import EditPatientPage from './pages/EditPatientPage';
import AppointmentListPage from './pages/AppointmentListPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import TodayAppointmentsPage from './pages/TodayAppointmentsPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import ConsultationPage from './pages/ConsultationPage';
import RoomListPage from './pages/RoomListPage';
import AdmissionListPage from './pages/AdmissionListPage';
import CreateAdmissionPage from './pages/CreateAdmissionPage';
import AdmissionDetailsPage from './pages/AdmissionDetailsPage';
import BillingListPage from './pages/BillingListPage';
import GenerateBillPage from './pages/GenerateBillPage';
import BillDetailsPage from './pages/BillDetailsPage';
import DischargeListPage from './pages/DischargeListPage';
import DischargeDetailsPage from './pages/DischargeDetailsPage';
import FollowUpListPage from './pages/FollowUpListPage';
import FollowUpDetailsPage from './pages/FollowUpDetailsPage';
import ScheduleFollowUpPage from './pages/ScheduleFollowUpPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/register"
            element={
              <ProtectedRoute>
                <RegisterPatientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/new"
            element={<Navigate to="/patients/register" replace />}
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id/edit"
            element={
              <ProtectedRoute>
                <EditPatientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/book"
            element={
              <ProtectedRoute>
                <BookAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={<Navigate to="/appointments/book" replace />}
          />
          <Route
            path="/appointments/today"
            element={
              <ProtectedRoute>
                <TodayAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id"
            element={
              <ProtectedRoute>
                <AppointmentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id/consultation"
            element={
              <ProtectedRoute>
                <ConsultationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions"
            element={
              <ProtectedRoute>
                <AdmissionListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/new"
            element={
              <ProtectedRoute>
                <CreateAdmissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/:id"
            element={
              <ProtectedRoute>
                <AdmissionDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <BillingListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills/new"
            element={
              <ProtectedRoute>
                <GenerateBillPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills/:id"
            element={
              <ProtectedRoute>
                <BillDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discharges"
            element={
              <ProtectedRoute>
                <DischargeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discharges/:id"
            element={
              <ProtectedRoute>
                <DischargeDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followups"
            element={
              <ProtectedRoute>
                <FollowUpListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followups/new"
            element={
              <ProtectedRoute>
                <ScheduleFollowUpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followups/:id"
            element={
              <ProtectedRoute>
                <FollowUpDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-logs"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ActivityLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
