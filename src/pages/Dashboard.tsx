import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from 'lucide-react';

interface DashboardStats {
  totalQuestions: number;
  totalUsers: number;
  dailyQuestionsPosted: number;
  totalInteractions: number;
  lastPostedDate: string;
  nextScheduledPost: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuestions: 0,
    totalUsers: 0,
    dailyQuestionsPosted: 0,
    totalInteractions: 0,
    lastPostedDate: 'Not available',
    nextScheduledPost: '8:00 AM tomorrow'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        // Replace with actual API call
        // const response = await axios.get('/api/dashboard/stats');
        // setStats(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setStats({
            totalQuestions: 156,
            totalUsers: 234,
            dailyQuestionsPosted: 10,
            totalInteractions: 1247,
            lastPostedDate: 'Today at 8:00 AM',
            nextScheduledPost: 'Tomorrow at 8:00 AM'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Questions',
      value: stats.totalQuestions,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12 this week'
    },
    {
      title: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+8 this week'
    },
    {
      title: 'Daily Questions',
      value: stats.dailyQuestionsPosted,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Posted today'
    },
    {
      title: 'Total Interactions',
      value: stats.totalInteractions,
      icon: MessageSquare,
      color: 'bg-orange-500',
      change: '+156 this week'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your MRCOG-1 Telegram Bot performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-md ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Daily questions posted successfully
                </p>
                <p className="text-sm text-gray-500">
                  {stats.lastPostedDate}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Next scheduled post
                </p>
                <p className="text-sm text-gray-500">
                  {stats.nextScheduledPost}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Bot status: Active
                </p>
                <p className="text-sm text-gray-500">
                  All systems operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Question
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FileText className="h-4 w-4 mr-2" />
              View All Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 