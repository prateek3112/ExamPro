
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/layouts/AdminLayout';
import { BarChart } from '@/components/ui/chart'; 

const AdminDashboard = () => {
  // Mock data for the dashboard
  const testData = [
    { name: 'Algebra Basics', attempts: 18 },
    { name: 'Geometry Fundamentals', attempts: 12 },
    { name: 'Mechanics', attempts: 7 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Monitor and manage your test platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">10</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Test Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">37</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Tests</CardTitle>
              <CardDescription>Tests with the most attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart 
                  data={testData.map(item => ({
                    name: item.name,
                    total: item.attempts
                  }))}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest test attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="font-medium">John Student</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Algebra Basics</span>
                    <span className="text-green-600">85%</span>
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium">Sarah Jones</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mechanics</span>
                    <span className="text-yellow-600">65%</span>
                  </div>
                  <div className="text-xs text-gray-500">Yesterday</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium">Michael Brown</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Geometry Fundamentals</span>
                    <span className="text-red-600">45%</span>
                  </div>
                  <div className="text-xs text-gray-500">2 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
