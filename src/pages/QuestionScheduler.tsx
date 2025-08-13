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
  ChevronRight,
  Loader2
} from 'lucide-react';
import { schedulingAPI, questionsAPI } from '../services/api';

interface Question {
  _id: string;
  question: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionBucket {
  _id: string;
  name: string;
  topic: string;
  questions: Question[];
  maxQuestions: number;
  dayOfWeek: string;
  isActive: boolean;
  createdBy: string;
  lastScheduled?: Date;
  scheduleCount: number;
  createdAt: Date;
  updatedAt: Date;
  questionCount: number;
  availableSlots: number;
  completionPercentage: number;
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
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);

  const [newBucket, setNewBucket] = useState({
    name: '',
    topic: '',
    maxQuestions: 5,
    dayOfWeek: 'Monday',
    selectedQuestions: [] as string[]
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load buckets and questions in parallel
      const [bucketsResponse, questionsResponse] = await Promise.all([
        schedulingAPI.getAllBuckets(), // Use getAllBuckets to get all buckets without pagination
        questionsAPI.getAllQuestions() // Use getAllQuestions to get all questions without pagination
      ]);
      
      // Debug API responses
      console.log('Buckets API Response:', bucketsResponse);
      console.log('Questions API Response:', questionsResponse);
      
      // Ensure we always set arrays
      const bucketsData = bucketsResponse.data?.data?.docs; // Use .docs for the correct structure
      const questionsData = questionsResponse.data?.questions; // Use .questions for the correct structure
      
      console.log('Buckets Response:', bucketsResponse.data);
      console.log('Buckets Data:', bucketsData);
      console.log('Questions Data:', questionsData);
      
      setBuckets(Array.isArray(bucketsData) ? bucketsData : []);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBuckets = async () => {
    try {
      setError(null);
      
      const response = await schedulingAPI.getAllBuckets({
        topic: selectedTopic || undefined,
        isActive: true
      });
      
      // Ensure we always set an array
      const bucketsData = response.data?.data?.docs; // Use .docs for the correct structure
      setBuckets(Array.isArray(bucketsData) ? bucketsData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load buckets');
      console.error('Error loading buckets:', err);
      setBuckets([]); // Set empty array on error
    }
  };

  const loadQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      setError(null);
      
      const response = await questionsAPI.getAllQuestions({
        topic: selectedTopic || undefined,
        search: searchQuery || undefined
      });
      
      // Ensure we always set an array
      const questionsData = response.data?.questions; // Use .questions instead of .data.questions
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load questions');
      console.error('Error loading questions:', err);
      setQuestions([]); // Set empty array on error
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Reload data when filters change
  useEffect(() => {
    if (!isLoading) {
      loadBuckets();
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (!isLoading) {
      loadQuestions();
    }
  }, [selectedTopic, searchQuery]);

  const handleCreateBucket = async () => {
    if (!newBucket.name || !newBucket.topic || newBucket.selectedQuestions.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await schedulingAPI.createBucket({
        name: newBucket.name,
        topic: newBucket.topic,
        questions: newBucket.selectedQuestions,
        maxQuestions: newBucket.maxQuestions,
        dayOfWeek: newBucket.dayOfWeek
      });
      
      // Add new bucket to state
      setBuckets([...buckets, response.data.data]);
      
      // Reset form
      setNewBucket({
        name: '',
        topic: '',
        maxQuestions: 5,
        dayOfWeek: 'Monday',
        selectedQuestions: []
      });
      setIsCreatingBucket(false);
      
      // Reload buckets to get updated data
      await loadBuckets();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bucket');
      console.error('Error creating bucket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBucket = (bucketId: string) => {
    const bucket = buckets.find(b => b._id === bucketId);
    if (bucket) {
      setNewBucket({
        name: bucket.name,
        topic: bucket.topic,
        maxQuestions: bucket.maxQuestions,
        dayOfWeek: bucket.dayOfWeek,
        selectedQuestions: bucket.questions.map(q => q._id)
      });
      setEditingBucket(bucketId);
      setIsCreatingBucket(true);
    }
  };

  const handleUpdateBucket = async () => {
    if (!editingBucket) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      await schedulingAPI.updateBucket(editingBucket, {
        name: newBucket.name,
        topic: newBucket.topic,
        questions: newBucket.selectedQuestions,
        maxQuestions: newBucket.maxQuestions,
        dayOfWeek: newBucket.dayOfWeek
      });
      
      // Reload buckets to get updated data
      await loadBuckets();
      
      // Reset form
      setNewBucket({
        name: '',
        topic: '',
        maxQuestions: 5,
        dayOfWeek: 'Monday',
        selectedQuestions: []
      });
      setEditingBucket(null);
      setIsCreatingBucket(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update bucket');
      console.error('Error updating bucket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBucket = async (bucketId: string) => {
    if (!confirm('Are you sure you want to delete this bucket?')) return;
    
    try {
      setError(null);
      await schedulingAPI.deleteBucket(bucketId);
      
      // Remove bucket from state
      setBuckets(buckets.filter(b => b._id !== bucketId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete bucket');
      console.error('Error deleting bucket:', err);
    }
  };

  const toggleBucketActive = async (bucketId: string) => {
    try {
      setError(null);
      const bucket = buckets.find(b => b._id === bucketId);
      if (!bucket) return;
      
      await schedulingAPI.toggleBucketActive(bucketId, !bucket.isActive);
      
      // Update bucket in state
      setBuckets(buckets.map(b => 
        b._id === bucketId ? { ...b, isActive: !b.isActive } : b
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle bucket status');
      console.error('Error toggling bucket status:', err);
    }
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

  // Ensure buckets and questions are arrays
  const safeBuckets = Array.isArray(buckets) ? buckets : [];
  const safeQuestions = Array.isArray(questions) ? questions : [];

  // Questions filtered for the create bucket modal (by selected topic only)
  const modalFilteredQuestions = safeQuestions.filter(q => 
    q.isActive && 
    (newBucket.topic === '' || q.topic === newBucket.topic)
  );

  const getDayBuckets = (day: string) => {
    return safeBuckets.filter(b => b.dayOfWeek === day);
  };

  const getTopicBuckets = (topic: string) => {
    return safeBuckets.filter(b => b.topic === topic);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading question scheduler...</p>
        </div>
      </div>
    );
  }

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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
              {/* Help text */}
              {newBucket.topic && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> You've selected <strong>{newBucket.topic}</strong>. 
                    Only questions from this topic will be shown below.
                  </p>
                </div>
              )}
              
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
                    onChange={(e) => {
                      const newTopic = e.target.value;
                      // Clear selected questions when topic changes
                      setNewBucket({ 
                        ...newBucket, 
                        topic: newTopic,
                        selectedQuestions: [] // Reset selected questions when topic changes
                      });
                    }}
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
                  {newBucket.topic && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      • {modalFilteredQuestions.length} questions available for {newBucket.topic}
                    </span>
                  )}
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  {isLoadingQuestions ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading questions...</span>
                    </div>
                  ) : !newBucket.topic ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>Please select a topic first to see available questions</p>
                    </div>
                  ) : modalFilteredQuestions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>No questions available for {newBucket.topic}</p>
                    </div>
                  ) : (
                    modalFilteredQuestions.map(question => (
                      <label key={question._id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={newBucket.selectedQuestions.includes(question._id)}
                          onChange={(e) => {
                            if (e.target.checked && newBucket.selectedQuestions.length < newBucket.maxQuestions) {
                              setNewBucket({
                                ...newBucket,
                                selectedQuestions: [...newBucket.selectedQuestions, question._id]
                              });
                            } else if (!e.target.checked) {
                              setNewBucket({
                                ...newBucket,
                                selectedQuestions: newBucket.selectedQuestions.filter(id => id !== question._id)
                              });
                            }
                          }}
                          disabled={!newBucket.selectedQuestions.includes(question._id) && newBucket.selectedQuestions.length >= newBucket.maxQuestions}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-700">{question.question}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {question.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{question.topic}</span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
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
                  disabled={!newBucket.name || !newBucket.topic || newBucket.selectedQuestions.length === 0 || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2 inline" />
                  )}
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
          const totalQuestions = topicBuckets.reduce((sum, bucket) => sum + (bucket.questionCount || bucket.questions.length), 0);
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
                      <div key={bucket._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleBucketExpansion(bucket._id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedBuckets.has(bucket._id) ? (
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
                                  {bucket.questionCount || bucket.questions.length}/{bucket.maxQuestions} questions
                                </span>
                                <span className={`flex items-center ${bucket.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                  {bucket.isActive ? (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {bucket.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {bucket.completionPercentage !== undefined && (
                                  <span className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${bucket.completionPercentage}%` }}
                                      ></div>
                                    </div>
                                    {bucket.completionPercentage}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBucketActive(bucket._id)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                bucket.isActive
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {bucket.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => handleEditBucket(bucket._id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBucket(bucket._id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {expandedBuckets.has(bucket._id) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h6 className="font-medium text-gray-700 mb-2">Questions in this bucket:</h6>
                            <div className="space-y-2">
                              {bucket.questions.map(question => (
                                <div key={question._id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-700">{question.question}</span>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                      }`}>
                                        {question.difficulty}
                                      </span>
                                    </div>
                                  </div>
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
