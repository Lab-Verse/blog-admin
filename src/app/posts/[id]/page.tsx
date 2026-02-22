'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, User, Eye, Tag, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { PostStatus } from '@/redux/types/post/posts.types';
import { useGetPostByIdQuery } from '@/redux/api/post/posts.api';

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { data: post, isLoading, error } = useGetPostByIdQuery(postId);
  const [viewCount, setViewCount] = useState(1234);

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

  if (error || (!isLoading && !post)) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/posts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
      </div>
    );
  }

  if (!post) return null;

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