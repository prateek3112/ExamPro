
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-exam-blue text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="font-bold text-2xl">ExamPro Admin</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Go to Student View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-exam-teal text-white">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-sm">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex flex-grow">
        <aside className="w-64 bg-white border-r">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/admin" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/exams" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Exams
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/tests" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Tests
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/questions" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Questions
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/analytics" 
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="flex-grow p-8 bg-gray-50">
          {children}
        </main>
      </div>
      
      <footer className="border-t py-4 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ExamPro Admin. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
