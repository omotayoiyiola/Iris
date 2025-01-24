import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext.jsx";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { authData } = useAuth();

  if (!authData || !authData.token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
