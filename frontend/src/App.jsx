import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import TechnicalEnglishLandingPage from './pages/TechnicalEnglishLandingPage';
import PreRegistrationPage from './pages/PreRegistrationPage';
import AcademicRegistrationPage from './pages/AcademicRegistrationPage';
import PaymentPage from './pages/PaymentPage';
import AdminPaymentDashboard from './pages/AdminPaymentDashboard';
import BecaPage from './pages/BecaPage';
import CourseSurveyPage from './pages/CourseSurveyPage';

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<TechnicalEnglishLandingPage />} />
        <Route path="/ingles-tecnico" element={<TechnicalEnglishLandingPage />} />
        <Route path="/preregistro" element={<PreRegistrationPage />} />
        <Route path="/registro-academico" element={<AcademicRegistrationPage />} />
        <Route path="/pagina-pago" element={<PaymentPage />} />
        <Route path="/becas" element={<BecaPage />} />
        <Route path="/encuesta-curso" element={<CourseSurveyPage />} />
        <Route path="/encuesta-curso/*" element={<CourseSurveyPage />} />
        <Route path="/admin/pagos" element={<AdminPaymentDashboard />} />
        <Route path="*" element={<TechnicalEnglishLandingPage />} />
      </Routes>
    </div>
  );
}
