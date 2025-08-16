import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PrivateRoute } from "@/components/common/PrivateRoute";
import { Layout } from "@/components/layout/Layout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TasksPage from "@/pages/TasksPage";
import AnalyticsPage from "@/pages/AnalyticsPage";

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={3000}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout>
                      <TasksPage />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute adminOnly>
                    <Layout>
                      <AnalyticsPage />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
