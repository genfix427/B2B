import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/OtherContent/PrivateRoute.jsx';
import Layout from './components/OtherContent/Layout.jsx';

// Pages
import Home from './pages/Home'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HowItWorks from './pages/HowItWorks'
import Testimonials from './pages/Testimonials'
import FAQ from './pages/FAQ'
import Shipping from './pages/Shipping'
import About from './pages/About'
import Contact from './pages/Contact'

import Register from './pages/Register.jsx';
// import Login from './pages/Login.jsx';
// import Dashboard from './pages/Dashboard.jsx';
// import AdminDashboard from './pages/admin/AdminDashboard.jsx';
// import PendingVerification from './pages/PendingVerification.jsx';

function App() {
  return (
    <Router>
      <Header />
      <AuthProvider>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/how-it-works' element={<HowItWorks />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/faqs' element={<FAQ />} />
          <Route path='/shipping' element={<Shipping />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/pending-verification" element={<PendingVerification />} /> */}

          {/* Protected Vendor Routes */}
          {/* <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route> */}

          {/* Admin Routes */}
          {/* <Route path="/admin/*" element={
            <PrivateRoute adminOnly={true}>
              <Layout admin={true} />
            </PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="vendors" element={<AdminDashboard />} />
          </Route> */}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
      <Footer />
    </Router>
  );
}

export default App;