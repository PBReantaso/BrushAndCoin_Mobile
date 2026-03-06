'use client';

import { useCreateCommission } from '@/hooks/useCommission';
import { AlertCircle, Calendar, DollarSign, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface CommissionRequestFormProps {
  artistId: string;
  artistName: string;
  artistAvatar?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CommissionRequestForm({
  artistId,
  artistName,
  artistAvatar,
  onClose,
  onSuccess,
}: CommissionRequestFormProps) {
  const createCommissionMutation = useCreateCommission();
  const isLoading = (createCommissionMutation as any).isLoading;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    requirements: '',
  });
  
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (files: FileList) => {
  const newFiles = Array.from(files);
  const totalFiles = referenceImages.length + newFiles.length;
  
  if (totalFiles > 5) {
    setErrors(prev => ({
      ...prev,
      images: 'Maximum 5 reference images allowed',
    }));
    return;
  }

  setReferenceImages(prev => [...prev, ...newFiles]);

  // Upload images to Neon
  for (const file of newFiles) {
    try {
      // Validate file
      const validation = validateFile(file, 'commissions');
      
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          images: validation.error,
        }));
        continue;
      }

      // Upload file to Neon
      const uploadResult = await uploadFileToNeon(file, 'commissions');
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      setUploadedImageUrls(prev => [...prev, uploadResult.publicUrl]);
      setUploadedFileIds(prev => [...prev, uploadResult.fileId]);
    } catch (error: any) {
      console.error('Image upload failed:', error);
      setErrors(prev => ({
        ...prev,
        images: 'Failed to upload image. Please try again.',
      }));
    }
  }
};

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    const baseBudget = parseFloat(formData.budget) || 0;
    const urgencyFee = isUrgent ? baseBudget * 0.2 : 0;
    const platformFee = baseBudget * 0.05;
    return baseBudget + urgencyFee + platformFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  try {
    // Use react-query mutation to create a commission record
    try {
      await createCommissionMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: 'general',
        budget: parseFloat(formData.budget) || 0,
        deadline: formData.deadline || undefined,
        requirements: formData.requirements || undefined,
        isUrgent,
        artistId,
        referenceImages: uploadedImageUrls,
      })

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create commission (mutation):', err)
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create commission request. Please try again.',
      }))
    }
  } catch (error) {
    console.error('Failed to create commission:', error);
    setErrors(prev => ({
      ...prev,
      submit: 'Failed to create commission request. Please try again.',
    }));
  }
};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Form */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {artistAvatar ? (
                    <img
                      src={artistAvatar}
                      alt={artistName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {artistName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Request Commission</h2>
                  <p className="text-sm text-gray-500">for {artistName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Commission Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Digital Portrait of My Pet"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what you want commissioned in detail..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Budget (₱) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 2500"
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                      errors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.budget}
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Preferred Deadline (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.deadline}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Special Requirements (Optional)
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any specific details, style preferences, dimensions, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Reference Images */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reference Images (Optional, max 5)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload reference images</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                </button>
                
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.images}
                  </p>
                )}

                {/* Preview Images */}
                {referenceImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {referenceImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Urgent Commission */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="urgent" className="ml-2 text-sm text-gray-900">
                  This is an urgent commission (+20% fee)
                </label>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Pricing Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Budget</span>
                    <span>₱{parseFloat(formData.budget) || 0}</span>
                  </div>
                  {isUrgent && (
                    <div className="flex justify-between text-sm">
                      <span>Urgency Fee (20%)</span>
                      <span>₱{((parseFloat(formData.budget) || 0) * 0.2).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee (5%)</span>
                    <span>₱{((parseFloat(formData.budget) || 0) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="text-red-600">₱{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.submit}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending Request...
                    </>
                  ) : (
                    'Send Commission Request'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}