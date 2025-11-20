import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Save, X, Eye, FileText, Tag, Clock, ArrowLeft } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { createBlog, updateBlog, getBlog } = useAdminData();
  
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    content: '',
    conclusion: '',
    callToAction: '',
    tags: '',
    status: 'draft'
  });
  
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // Load blog data if editing
  useEffect(() => {
    const loadBlog = async () => {
      if (isEditing && id) {
        setInitialLoading(true);
        try {
          const blog = await getBlog(id);
          if (blog) {
            setFormData({
              title: blog.title || blog.heading || '',
              introduction: blog.introduction || '',
              content: blog.content || blog.mainBody || '',
              conclusion: blog.conclusion || '',
              callToAction: blog.callToAction || '',
              tags: blog.tags?.join(', ') || '',
              status: blog.status || 'draft'
            });
          }
        } catch (error) {
          toast.error('Failed to load blog');
          navigate('/admin/blogs');
        } finally {
          setInitialLoading(false);
        }
      }
    };

    loadBlog();
  }, [id, isEditing, getBlog, navigate]);

  // Calculate word count
  useEffect(() => {
    const text = formData.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [formData.content]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (status = 'draft') => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setLoading(true);

    const blogData = {
      ...formData,
      status,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      let result;
      if (isEditing) {
        result = await updateBlog(id, blogData);
      } else {
        result = await createBlog(blogData);
      }

      if (result.success) {
        toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
        navigate('/admin/blogs');
      } else {
        toast.error(result.error || 'Failed to save blog');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'script', 'indent', 'direction',
    'color', 'background', 'align', 'link', 'image', 'video'
  ];

  if (initialLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="h-full flex flex-col">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preview Mode
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              icon={FileText}
              onClick={() => setPreviewMode(false)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              icon={X}
              onClick={handleCancel}
            />
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h1>{formData.title}</h1>
            
            {formData.introduction && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500 my-6">
                <p className="text-blue-900 dark:text-blue-100 font-medium">
                  {formData.introduction}
                </p>
              </div>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            
            {formData.conclusion && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500 my-6">
                <h3 className="text-green-900 dark:text-green-100 font-semibold mb-2">Conclusion</h3>
                <p className="text-green-800 dark:text-green-200">{formData.conclusion}</p>
              </div>
            )}
            
            {formData.callToAction && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500 my-6">
                <p className="text-purple-900 dark:text-purple-100 font-medium">
                  {formData.callToAction}
                </p>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Blog' : 'Create New Blog'}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{Math.ceil(wordCount / 200)} min read</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            icon={Eye}
            onClick={() => setPreviewMode(true)}
          >
            Preview
          </Button>
          <Button
            variant="secondary"
            icon={Save}
            onClick={() => handleSubmit('draft')}
            loading={loading}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            icon={FileText}
            onClick={() => handleSubmit('published')}
            loading={loading}
          >
            {isEditing ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Main Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title..."
                  className="input-field text-lg font-semibold"
                  required
                />
              </div>

              {/* Introduction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Introduction
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  placeholder="Brief introduction or summary..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your blog content..."
                  style={{ height: 'calc(100% - 42px)' }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 space-y-6 overflow-y-auto">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Conclusion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conclusion
              </label>
              <textarea
                name="conclusion"
                value={formData.conclusion}
                onChange={handleInputChange}
                placeholder="Wrap up your thoughts..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            {/* Call to Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call to Action
              </label>
              <input
                type="text"
                name="callToAction"
                value={formData.callToAction}
                onChange={handleInputChange}
                placeholder="e.g., Subscribe for more updates"
                className="input-field"
              />
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Content Stats
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Words:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Characters:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.content.replace(/<[^>]*>/g, '').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reading time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.ceil(wordCount / 200)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
