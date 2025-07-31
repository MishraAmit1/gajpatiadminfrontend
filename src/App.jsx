import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import useAuthStore from "./stores/authStore";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import Toaster from "./components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Plants from "./pages/Plants";
import Natures from "./pages/Natures";
import Blogs from "./pages/Blogs";
import Inquiries from "./pages/Inquiries";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NatureView from "./pages/NatureView";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import ProductView from "./pages/ProductView";
import InquiryView from "./pages/InquiryView";
import BlogCreate from "./pages/BlogCreate";
import BlogEdit from "./pages/BlogEdit";
import NatureCreate from "./pages/NatureCreate";
import NatureEdit from "./pages/NatureEdit";
import Subscriber from "./pages/Subscriber";
import Quotes from "./pages/Quotes";
import QuoteView from "./pages/QuoteView";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes - accessible before login */}
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRedirect>
                  <Signup />
                </AuthRedirect>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthRedirect>
                  <ForgotPassword />
                </AuthRedirect>
              }
            />
            {/* Protected admin routes - only accessible after login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="products/:id" element={<ProductView />} />
              <Route path="plants" element={<Plants />} />
              <Route path="natures" element={<Natures />} />
              <Route path="natures/create" element={<NatureCreate />} />
              <Route path="natures/:id/edit" element={<NatureEdit />} />
              <Route path="natures/:id" element={<NatureView />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/create" element={<BlogCreate />} />
              <Route path="blogs/:id/edit" element={<BlogEdit />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="inquiries/:id" element={<InquiryView />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="quotes/:id" element={<QuoteView />} />
              <Route path="users" element={<Users />} />
              <Route path="subscribers" element={<Subscriber />} />
            </Route>

            {/* Redirect any unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
