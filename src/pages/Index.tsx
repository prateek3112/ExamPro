
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Just redirect to the home page
  return <Navigate to="/" replace />;
};

export default Index;
