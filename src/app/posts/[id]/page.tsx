'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, User, Eye, Tag, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { Post, PostStatus } from '@/redux/types/post/posts.types';

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCount, setViewCount] = useState(1234);

  useEffect(() => {
    // Mock API call - replace with real API
    const fetchPost = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock post data
        const mockPost: Post = {
          id: params.id as string,
          title: 'Complete Guide to React Best Practices',
          slug: 'complete-guide-react-best-practices',
          content: `
            <h2>Introduction</h2>
            <p>React has become one of the most popular JavaScript libraries for building user interfaces. In this comprehensive guide, we'll explore the best practices that will help you write cleaner, more maintainable React code.</p>
            
            <h2>1. Component Structure</h2>
            <p>Organizing your components properly is crucial for maintainability. Here are some key principles:</p>
            <ul>
              <li>Keep components small and focused</li>
              <li>Use functional components with hooks</li>
              <li>Separate logic from presentation</li>
            </ul>
            
            <h2>2. State Management</h2>
            <p>Proper state management is essential for React applications. Consider these approaches:</p>
            <ul>
              <li>Use useState for local component state</li>
              <li>Use useContext for shared state</li>
              <li>Consider Redux for complex state management</li>
            </ul>
            
            <h2>3. Performance Optimization</h2>
            <p>To ensure your React app performs well:</p>
            <ul>
              <li>Use React.memo for expensive components</li>
              <li>Implement proper key props in lists</li>
              <li>Lazy load components when possible</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>Following these best practices will help you build better React applications that are easier to maintain and scale.</p>
          `,
          excerpt: 'Learn the essential React best practices that will help you write cleaner, more maintainable code and build better applications.',
          featured_image: 'https://picsum.photos/800/400?random=1',
          status: PostStatus.PUBLISHED,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          user_id: '1',
          category_id: '1',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          category: {
            id: '1',
            name: 'Web Development',
            slug: 'web-development'
          },
          tags: [
            { id: '1', name: 'React', slug: 'react' },
            { id: '2', name: 'JavaScript', slug: 'javascript' },
            { id: '3', name: 'Best Practices', slug: 'best-practices' }
          ]
        };
        
        setPost(mockPost);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  // Realtime view count update
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3)); // Simulate realtime updates
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case PostStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case PostStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The post you&re looking for doesn&t exist.</p>
        <Button onClick={() => router.push('/posts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-linear-to-r from-primary-50 to-accent-50 p-6 rounded-2xl border border-primary-100">
        <Button variant="outline" onClick={() => router.push('/posts')} className="cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/posts/${post.id}/edit`)} className="cursor-pointer">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 cursor-pointer">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <Image
                src={post.featured_image}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getStatusColor(post.status)}>
                {post.status}
              </Badge>
              {post.category && (
                <Badge variant="secondary" className="cursor-pointer">
                  <Link href={`/categories/${post.category.id}`} className="hover:text-primary-600 transition-colors">
                    {post.category.name}
                  </Link>
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <Link href={`/users/${post.user?.id}`} className="hover:text-primary-600 transition-colors cursor-pointer">
                  {post.user?.name || 'Unknown Author'}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{viewCount} views</span>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="cursor-pointer">
                    <Link href={`/tags/${tag.id}`} className="hover:text-primary-600 transition-colors">
                      {tag.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{viewCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Views</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-600">Likes</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Comments</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-sm text-gray-600">Bookmarks</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" className="flex items-center gap-2 cursor-pointer hover:bg-red-50 hover:border-red-200">
          <Heart className="w-4 h-4" />
          Like
        </Button>
        <Button variant="outline" className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200">
          <MessageCircle className="w-4 h-4" />
          Comment
        </Button>
        <Button variant="outline" className="flex items-center gap-2 cursor-pointer hover:bg-green-50 hover:border-green-200">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" className="flex items-center gap-2 cursor-pointer hover:bg-yellow-50 hover:border-yellow-200">
          <Bookmark className="w-4 h-4" />
          Bookmark
        </Button>
      </div>
    </div>
  );
}