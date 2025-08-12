import { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

interface QuestionForm {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
}

const AddQuestion = () => {
  const [formData, setFormData] = useState<QuestionForm>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    topic: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const topics = [
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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate form
    if (!formData.question.trim()) {
      setError('Question is required');
      setLoading(false);
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      setError('All options are required');
      setLoading(false);
      return;
    }

    if (!formData.correctAnswer) {
      setError('Please select the correct answer');
      setLoading(false);
      return;
    }

    if (!formData.explanation.trim()) {
      setError('Explanation is required');
      setLoading(false);
      return;
    }

    if (!formData.topic) {
      setError('Please select a topic');
      setLoading(false);
      return;
    }

    try {
      // Replace with actual API call
      // const response = await axios.post('/api/questions', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        topic: ''
      });
    } catch (err) {
      setError('Failed to save question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Question</h1>
        <p className="mt-2 text-gray-600">
          Create a new MRCOG-1 question for the Telegram bot
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Save className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Question saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Question Details</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Topic Selection */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic *
            </label>
            <select
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select a topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question *
            </label>
            <textarea
              id="question"
              rows={4}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter the question text..."
              required
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options *
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={String.fromCharCode(65 + index)}
                      checked={formData.correctAnswer === String.fromCharCode(65 + index)}
                      onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select the radio button next to the correct answer
            </p>
          </div>

          {/* Explanation */}
          <div>
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
              Explanation *
            </label>
            <textarea
              id="explanation"
              rows={4}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Provide a detailed explanation for the correct answer..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  question: '',
                  options: ['', '', '', ''],
                  correctAnswer: '',
                  explanation: '',
                  topic: ''
                });
                setError('');
                setSuccess(false);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Question
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion; 