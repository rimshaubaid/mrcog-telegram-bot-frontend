import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  topic: string;
  isActive: boolean;
}

interface QuestionBucket {
  id: string;
  name: string;
  topic: string;
  questions: Question[];
  maxQuestions: number;
  dayOfWeek: string;
  isActive: boolean;
  createdAt: Date;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

const TOPICS = [
  'Obstetrics', 'Gynecology', 'Reproductive Medicine', 
  'Fetal Medicine', 'Gynecological Oncology', 'Urogynecology',
  'General Practice', 'Emergency Medicine', 'Surgery'
];

const QuestionScheduler: React.FC = () => {
  const [buckets, setBuckets] = useState<QuestionBucket[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  const [editingBucket, setEditingBucket] = useState<string | null>(null);
  const [expandedBuckets, setExpandedBuckets] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [newBucket, setNewBucket] = useState({
    name: '',
    topic: '',
    maxQuestions: 5,
    dayOfWeek: 'Monday',
    selectedQuestions: [] as string[]
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockQuestions: Question[] = [
      { id: '1', question: 'What is the most common cause of postpartum hemorrhage?', topic: 'Obstetrics', isActive: true },
      { id: '2', question: 'Which hormone is responsible for maintaining pregnancy?', topic: 'Obstetrics', isActive: true },
      { id: '3', question: 'What is the first sign of preeclampsia?', topic: 'Obstetrics', isActive: true },
      { id: '4', question: 'Which screening test is recommended for cervical cancer?', topic: 'Gynecology', isActive: true },
      { id: '5', question: 'What is the most common type of ovarian cancer?', topic: 'Gynecological Oncology', isActive: true },
    ];

    const mockBuckets: QuestionBucket[] = [
      {
        id: '1',
        name: 'Monday Obstetrics',
        topic: 'Obstetrics',
        questions: mockQuestions.filter(q => q.topic === 'Obstetrics').slice(0, 3),
        maxQuestions: 5,
        dayOfWeek: 'Monday',
        isActive: true,
        createdAt: new Date('2024-01-01')
      }
    ];

    setQuestions(mockQuestions);
    setBuckets(mockBuckets);
  }, []);

  const handleCreateBucket = () => {
    if (!newBucket.name || !newBucket.topic || newBucket.selectedQuestions.length === 0) {
      return;
    }

    const bucket: QuestionBucket = {
      id: Date.now().toString(),
      name: newBucket.name,
      topic: newBucket.topic,
      questions: questions.filter(q => newBucket.selectedQuestions.includes(q.id)),
      maxQuestions: newBucket.maxQuestions,
      dayOfWeek: newBucket.dayOfWeek,
      isActive: true,
      createdAt: new Date()
    };

    setBuckets([...buckets, bucket]);
    setNewBucket({
      name: '',
      topic: '',
      maxQuestions: 5,
      dayOfWeek: 'Monday',
      selectedQuestions: []
    });
    setIsCreatingBucket(false);
  };

  const handleEditBucket = (bucketId: string) => {
    const bucket = buckets.find(b => b.id === bucketId);
    if (bucket) {
      setNewBucket({
        name: bucket.name,
        topic: bucket.topic,
        maxQuestions: bucket.maxQuestions,
        dayOfWeek: bucket.dayOfWeek,
        selectedQuestions: bucket.questions.map(q => q.id)
      });
      setEditingBucket(bucketId);
      setIsCreatingBucket(true);
    }
  };

  const handleUpdateBucket = () => {
    if (!editingBucket) return;

    setBuckets(buckets.map(bucket => {
      if (bucket.id === editingBucket) {
        return {
          ...bucket,
          name: newBucket.name,
          topic: newBucket.topic,
          questions: questions.filter(q => newBucket.selectedQuestions.includes(q.id)),
          maxQuestions: newBucket.maxQuestions,
          dayOfWeek: newBucket.dayOfWeek
        };
      }
      return bucket;
    }));

    setNewBucket({
      name: '',
      topic: '',
      maxQuestions: 5,
      dayOfWeek: 'Monday',
      selectedQuestions: []
    });
    setEditingBucket(null);
    setIsCreatingBucket(false);
  };

  const handleDeleteBucket = (bucketId: string) => {
    setBuckets(buckets.filter(b => b.id !== bucketId));
  };

  const toggleBucketExpansion = (bucketId: string) => {
    const newExpanded = new Set(expandedBuckets);
    if (newExpanded.has(bucketId)) {
      newExpanded.delete(bucketId);
    } else {
      newExpanded.add(bucketId);
    }
    setExpandedBuckets(newExpanded);
  };

  const toggleBucketActive = (bucketId: string) => {
    setBuckets(buckets.map(bucket => 
      bucket.id === bucketId ? { ...bucket, isActive: !bucket.isActive } : bucket
    ));
  };

  const filteredQuestions = questions.filter(q => 
    q.isActive && 
    (selectedTopic === '' || q.topic === selectedTopic) &&
    (searchQuery === '' || q.question.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDayBuckets = (day: string) => {
    return buckets.filter(b => b.dayOfWeek === day);
  };

  const getTopicBuckets = (topic: string) => {
    return buckets.filter(b => b.topic === topic);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Scheduler</h1>
          <p className="text-gray-600 mt-2">
            Manage question distribution by topic and schedule them for specific days
          </p>
        </div>
        <button
          onClick={() => setIsCreatingBucket(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Bucket
        </button>
      </div>

      {/* Create/Edit Bucket Modal */}
      {isCreatingBucket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingBucket ? 'Edit Question Bucket' : 'Create Question Bucket'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingBucket(false);
                  setEditingBucket(null);
                  setNewBucket({
                    name: '',
                    topic: '',
                    maxQuestions: 5,
                    dayOfWeek: 'Monday',
                    selectedQuestions: []
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={newBucket.name}
                  onChange={(e) => setNewBucket({ ...newBucket, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Monday Obstetrics Questions"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <select
                    value={newBucket.topic}
                    onChange={(e) => setNewBucket({ ...newBucket, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Topic</option>
                    {TOPICS.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={newBucket.dayOfWeek}
                    onChange={(e) => setNewBucket({ ...newBucket, dayOfWeek: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Questions (5-10)
                </label>
                <input
                  type="number"
                  min="5"
                  max="10"
                  value={newBucket.maxQuestions}
                  onChange={(e) => setNewBucket({ ...newBucket, maxQuestions: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Questions ({newBucket.selectedQuestions.length}/{newBucket.maxQuestions})
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  {filteredQuestions.map(question => (
                    <label key={question.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={newBucket.selectedQuestions.includes(question.id)}
                        onChange={(e) => {
                          if (e.target.checked && newBucket.selectedQuestions.length < newBucket.maxQuestions) {
                            setNewBucket({
                              ...newBucket,
                              selectedQuestions: [...newBucket.selectedQuestions, question.id]
                            });
                          } else if (!e.target.checked) {
                            setNewBucket({
                              ...newBucket,
                              selectedQuestions: newBucket.selectedQuestions.filter(id => id !== question.id)
                            });
                          }
                        }}
                        disabled={!newBucket.selectedQuestions.includes(question.id) && newBucket.selectedQuestions.length >= newBucket.maxQuestions}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{question.question}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsCreatingBucket(false);
                    setEditingBucket(null);
                    setNewBucket({
                      name: '',
                      topic: '',
                      maxQuestions: 5,
                      dayOfWeek: 'Monday',
                      selectedQuestions: []
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingBucket ? handleUpdateBucket : handleCreateBucket}
                  disabled={!newBucket.name || !newBucket.topic || newBucket.selectedQuestions.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  {editingBucket ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Topics</option>
              {TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Topic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map(topic => {
          const topicBuckets = getTopicBuckets(topic);
          const totalQuestions = topicBuckets.reduce((sum, bucket) => sum + bucket.questions.length, 0);
          const activeBuckets = topicBuckets.filter(b => b.isActive).length;
          const scheduledDays = [...new Set(topicBuckets.map(b => b.dayOfWeek))];
          
          return (
            <div key={topic} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{topic}</h4>
                <span className="text-sm text-gray-500">
                  {questions.filter(q => q.topic === topic).length} questions
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Buckets:</span>
                  <span className="font-medium">{topicBuckets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active:</span>
                  <span className={`font-medium ${activeBuckets > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {activeBuckets}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled:</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
                {scheduledDays.length > 0 && (
                  <div className="flex justify-between">
                    <span>Days:</span>
                    <span className="font-medium text-blue-600">
                      {scheduledDays.join(', ')}
                    </span>
                  </div>
                )}
              </div>
              {topicBuckets.length === 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">No buckets created</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Schedule View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {DAYS_OF_WEEK.map(day => {
            const dayBuckets = getDayBuckets(day);
            return (
              <div key={day} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">{day}</h4>
                  <span className="text-sm text-gray-500">
                    {dayBuckets.length} bucket{dayBuckets.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {dayBuckets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No questions scheduled for {day}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayBuckets.map(bucket => (
                      <div key={bucket.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleBucketExpansion(bucket.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedBuckets.has(bucket.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <h5 className="font-medium text-gray-900">{bucket.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  {bucket.topic}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {bucket.questions.length}/{bucket.maxQuestions} questions
                                </span>
                                <span className={`flex items-center ${bucket.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                  {bucket.isActive ? (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {bucket.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBucketActive(bucket.id)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                bucket.isActive
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {bucket.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => handleEditBucket(bucket.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBucket(bucket.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {expandedBuckets.has(bucket.id) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h6 className="font-medium text-gray-700 mb-2">Questions in this bucket:</h6>
                            <div className="space-y-2">
                              {bucket.questions.map(question => (
                                <div key={question.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{question.question}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionScheduler;
