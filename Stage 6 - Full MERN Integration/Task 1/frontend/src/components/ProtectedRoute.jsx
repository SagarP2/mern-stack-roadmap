import { useAuth } from '../contexts/AuthContext';
import LoginPrompt from './LoginPrompt';

const ProtectedRoute = ({ children, message }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <div></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt message={message} />;
  }

  return children;
};

export default ProtectedRoute;
