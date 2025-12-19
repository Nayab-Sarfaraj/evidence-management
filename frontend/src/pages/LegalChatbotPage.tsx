import { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, FileText, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function LegalChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Legal Knowledge Assistant. I can help explain legal concepts related to digital evidence, chain of custody, and evidence admissibility. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'Police' | 'General'>('General');
  // Context input state
  const [contextText, setContextText] = useState('');
  const [isContextOpen, setIsContextOpen] = useState(false);
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contextTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    'What is chain of custody?',
    'What makes digital evidence admissible?',
    'Common reasons evidence is rejected',
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleQuickQuestion = async (question: string) => {
    setInputValue(question);
    await sendMessage(question);
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let response: Response;

      // If image is selected, use multipart/form-data
      if (selectedImage) {
        const formData = new FormData();
        formData.append('role', userRole);
        formData.append('question', messageText);
        formData.append('context', contextText.trim() || '');
        formData.append('image', selectedImage);

        response = await fetch('http://localhost:3001/api/legal-chat', {
          method: 'POST',
          body: formData, // Don't set Content-Type header, browser will set it with boundary
        });
      } else {
        // Text-only request with optional context
        const requestBody: {
          role: 'Police' | 'General';
          question: string;
          context: string | null;
        } = {
          role: userRole,
          question: messageText,
          context: contextText.trim() || null,
        };

        response = await fetch('http://localhost:3001/api/legal-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Clear image after successful send (optional - you may want to keep it)
      // setSelectedImage(null);
      // setImagePreview(null);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please ensure the backend server is running on http://localhost:3001',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e3a5f] text-white flex flex-col">
        <div className="p-6">
          <div className="mb-8">
            <span className="text-base font-semibold text-white">TrustChain-EMS</span>
          </div>
          
          {/* User Type Selector */}
          <div>
            <p className="text-xs text-blue-200 uppercase tracking-wider mb-3 font-medium">User Type</p>
            <div className="space-y-1">
              <button
                onClick={() => setUserRole('Police')}
                className={`w-full text-left px-4 py-3 text-sm font-normal transition-colors ${
                  userRole === 'Police'
                    ? 'bg-blue-400 text-white'
                    : 'text-white hover:bg-blue-500/20'
                }`}
              >
                Police
              </button>
              <button
                onClick={() => setUserRole('General')}
                className={`w-full text-left px-4 py-3 text-sm font-normal transition-colors ${
                  userRole === 'General'
                    ? 'bg-blue-400 text-white'
                    : 'text-white hover:bg-blue-500/20'
                }`}
              >
                General
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-white">TrustChain-EMS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-normal text-white">{userRole === 'Police' ? 'Sardar Police' : 'General User'}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> This chatbot provides general legal information only and does not constitute legal advice. Please consult with qualified legal counsel for advice specific to your situation.
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Messages Area */}
            <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-5 py-3 ${
                  message.isUser
                    ? 'bg-blue-600 text-white rounded-br-sm ml-auto'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                <span
                  className={`text-xs mt-2 block ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Quick Questions (only show when no user messages) */}
          {messages.length === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-medium mb-3">
                Suggested questions:
              </p>
              <div className="grid gap-3">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm text-gray-700 shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Image Preview (Optional) */}
          {imagePreview && selectedImage && (
            <div className="px-6 mb-4">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {selectedImage.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="mt-2 text-xs text-amber-600 italic">
                      Image analysis is for explanatory purposes only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Context Input Area (Optional) */}
          <div className="px-6 mb-4">
            <div
              className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 overflow-hidden ${
                isContextOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Context
                </label>
                <textarea
                  ref={contextTextareaRef}
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="Provide brief background or evidence description for better answers"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-700 placeholder-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500 italic">
                  Context is used only for explanation and is treated as unverified
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Add Image Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    selectedImage
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  type="button"
                  aria-label="Add image"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Image</span>
                </button>

                {/* Add Context Button */}
                <button
                  onClick={() => {
                    setIsContextOpen(!isContextOpen);
                    // Focus textarea when opening
                    if (!isContextOpen && contextTextareaRef.current) {
                      setTimeout(() => contextTextareaRef.current?.focus(), 100);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    isContextOpen
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  type="button"
                  aria-label="Toggle context input"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Context</span>
                  {isContextOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Chat Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a legal question..."
                  disabled={isLoading}
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

