'use client';

import { useState } from 'react';

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
}

export default function CreatePostWithMultipleImages() {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category_id: '',
    status: 'draft'
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth
      const mediaIds: string[] = [];

      // Step 1: Upload each image to media endpoint
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);

        const response = await fetch('http://localhost:3000/media/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Failed to upload image');
        
        const media = await response.json();
        mediaIds.push(media.id);
      }

      // Step 2: Create post with media IDs
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          media_ids: mediaIds
        })
      });

      if (!response.ok) throw new Error('Failed to create post');

      const post = await response.json();
      alert('Post created successfully!');
      console.log('Created post:', post);
      
      // Reset form
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category_id: '',
        status: 'draft'
      });
      setImages([]);
      setPreviews([]);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Post with Multiple Images</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-2">Slug</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-2">Content</label>
          <textarea
            required
            rows={6}
            className="w-full p-2 border rounded"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-2">Excerpt</label>
          <textarea
            rows={3}
            className="w-full p-2 border rounded"
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-2">Category ID</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.category_id}
            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-2">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as any})}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Upload Images (Multiple)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            Select multiple images (max 10, 10MB each)
          </p>
        </div>

        {previews.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Selected Images ({previews.length})</h3>
            <div className="grid grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
