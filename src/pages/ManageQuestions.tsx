import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Download,
  X
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  createdAt: string;
  isActive: boolean;
}

const ManageQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showModal, setShowModal] = useState(false);

  const topics = [
    'All Topics',
    'Obstetrics',
    'Gynecology',
    'Reproductive Medicine',
    'Maternal-Fetal Medicine',
    'Gynecologic Oncology',
    'Urogynecology',
    'Family Planning',
    'Endocrinology',
    'General Medicine',
    'Surgery'
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Replace with actual API call
      // const response = await axios.get('/api/questions');
      
      // Mock data
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'A 32-year-old primigravida presents at 28 weeks gestation with severe preeclampsia. Which of the following is the most appropriate immediate management?',
          options: [
            'Immediate delivery by cesarean section',
            'Conservative management with bed rest',
            'Antihypertensive therapy only',
            'Expectant management until 37 weeks'
          ],
          correctAnswer: 'A',
          explanation: 'Severe preeclampsia at 28 weeks requires immediate delivery to prevent maternal and fetal complications.',
          topic: 'Obstetrics',
          createdAt: '2024-01-15',
          isActive: true
        },
        {
          id: '2',
          question: 'Which of the following is the most common cause of postmenopausal bleeding?',
          options: [
            'Endometrial cancer',
            'Endometrial atrophy',
            'Cervical cancer',
            'Uterine fibroids'
          ],
          correctAnswer: 'B',
          explanation: 'Endometrial atrophy is the most common cause of postmenopausal bleeding, accounting for 60-80% of cases.',
          topic: 'Gynecology',
          createdAt: '2024-01-14',
          isActive: true
        },
        {
          id: '3',
          question: 'A 25-year-old woman with PCOS presents for fertility treatment. What is the first-line pharmacological treatment?',
          options: [
            'Gonadotropins',
            'Clomiphene citrate',
            'Metformin',
            'Letrozole'
          ],
          correctAnswer: 'B',
          explanation: 'Clomiphene citrate is the first-line treatment for ovulation induction in women with PCOS.',
          topic: 'Reproductive Medicine',
          createdAt: '2024-01-13',
          isActive: true
        }
      ];
      
      setTimeout(() => {
        setQuestions(mockQuestions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === '' || selectedTopic === 'All Topics' || question.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });



  const handleToggleActive = async (id: string) => {
    try {
      // Replace with actual API call
      // await axios.patch(`/api/questions/${id}`, { isActive: !questions.find(q => q.id === id)?.isActive });
      
      setQuestions(questions.map(q => 
        q.id === id ? { ...q, isActive: !q.isActive } : q
      ));
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
          <p className="mt-2 text-gray-600">
            View, edit, and manage all MRCOG-1 questions
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Questions
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by question or topic..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Topic Filter */}
          <div>
            <label htmlFor="topic-filter" className="block text-sm font-medium text-gray-700">
              Filter by Topic
            </label>
            <select
              id="topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Export */}
          <div className="flex items-end">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Questions ({filteredQuestions.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {question.question}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {question.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {question.correctAnswer}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      question.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {question.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedQuestion(question);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(question.id)}
                        className={`${
                          question.isActive 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {question.isActive ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Question Detail Modal */}
      {showModal && selectedQuestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Question Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuestion.topic}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuestion.question}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <div className="mt-1 space-y-1">
                    {selectedQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-6">
                          {String.fromCharCode(65 + index)})
                        </span>
                        <span className={`text-sm ${
                          String.fromCharCode(65 + index) === selectedQuestion.correctAnswer
                            ? 'text-green-600 font-medium'
                            : 'text-gray-900'
                        }`}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Explanation</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedQuestion.explanation}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions; 