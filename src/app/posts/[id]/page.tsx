'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, User, Eye, Tag, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PostStatus } from '@/redux/types/post/posts.types';
import { useGetPostByIdQuery } from '@/redux/api/post/posts.api';
import { useCreateReactionMutation, useDeleteReactionMutation } from '@/redux/api/reaction/reactions.api';
import { useCreateBookmarkMutation, useDeleteBookmarkMutation, useGetUserBookmarksQuery } from '@/redux/api/bookmark/bookmarksApi';
import { useFollowAuthorMutation, useUnfollowAuthorMutation, useGetAuthorFollowersQuery } from '@/redux/api/authorfollower/authorFollowersApi';
import { useGetCommentsQuery, useCreateCommentMutation } from '@/redux/api/comment/commentsApi';
import { useGetCommentRepliesQuery, useCreateCommentReplyMutation } from '@/redux/api/commentreplies/commentRepliesApi';
import { useCreateViewMutation } from '@/redux/api/view/viewsApi';
import { ViewableType } from '@/redux/types/view/viewsTypes';
import { useAppSelector } from '@/redux/hooks';

function CommentRepliesSection({
  commentId,
  currentUserId,
  onRequireAuth,
}: {
  commentId: string;
  currentUserId?: string;
  onRequireAuth: () => void;
}) {
  const { data: replies } = useGetCommentRepliesQuery({ commentId });
  const [createCommentReply] = useCreateCommentReplyMutation();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleOpenReply = () => {
    if (!currentUserId) {
      onRequireAuth();
      return;
    }
    setIsReplying((prev) => !prev);
  };

  const handleSubmitReply = async () => {
    if (!currentUserId) {
      onRequireAuth();
      return;
    }

    if (!replyContent.trim()) {
      alert('Please write a reply before posting.');
      return;
    }

    setIsSubmittingReply(true);
    try {
      await createCommentReply({
        commentId,
        content: replyContent,
      }).unwrap();
      setReplyContent('');
      setIsReplying(false);
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="mt-3">
      <Button variant="ghost" size="sm" onClick={handleOpenReply} className="px-0 text-blue-600 hover:text-blue-700">
        Reply
      </Button>

      {isReplying && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={handleSubmitReply} disabled={isSubmittingReply}>
              {isSubmittingReply ? 'Posting...' : 'Post Reply'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {Array.isArray(replies) && replies.length > 0 && (
        <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
          {replies.map((reply: any) => (
            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900">
                  {reply.author?.name || reply.authorId || 'Anonymous'}
                </p>
                <span className="text-xs text-gray-500">
                  {reply.createdAt
                    ? new Date(reply.createdAt).toLocaleDateString()
                    : 'Just now'}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type MediaLike = {
  url?: string;
  file_url?: string;
  filename?: string;
  media?: {
    url?: string;
    file_url?: string;
    filename?: string;
  };
};

const resolveMediaUrl = (media: MediaLike): string => {
  return media?.url || media?.file_url || media?.media?.url || media?.media?.file_url || '';
};

const normalizeContentMediaUrls = (content: string, mediaList: MediaLike[] = []): string => {
  if (!content) return content;

  const validMedia = mediaList
    .map((media) => ({
      url: resolveMediaUrl(media),
      filename: (media?.filename || media?.media?.filename || '').toLowerCase(),
    }))
    .filter((item) => Boolean(item.url));

  const usedUrls = new Set<string>();

  let normalized = content;

  if (validMedia.length > 0) {
    normalized = normalized.replace(/(!?\[[^\]]*\])\((?:undefined|null)?\)/gi, (match, labelToken: string) => {
      const labelMatch = labelToken.match(/\[([^\]]*)\]/);
      const label = (labelMatch?.[1] || '').toLowerCase().trim();

      let chosen = validMedia.find((item) => item.filename && label && item.filename === label && !usedUrls.has(item.url));
      if (!chosen) {
        chosen = validMedia.find((item) => !usedUrls.has(item.url));
      }

      if (!chosen) return match;

      usedUrls.add(chosen.url);
      return `${labelToken}(${chosen.url})`;
    });
  }

  normalized = normalized.replace(/!([^\[\]\n][^\]]*?)\]\(([^)]+)\)/gi, (_match, label: string, url: string) => {
    return `![${label}](${url})`;
  });

  normalized = normalized.replace(/(!?)\[([^\]]+)\]\(([^)]+)\)/gi, (_match, marker: string, label: string, rawUrl: string) => {
    const cleanedUrl = rawUrl.trim().replace(/\s/g, '%20');
    return `${marker}[${label}](${cleanedUrl})`;
  });

  return normalized.replace(/(!?)\[([^\]]+)\]\(([^)]+)\)/gi, (match, marker: string, label: string, url: string) => {
    if (marker === '!') return match;

    const isImageLink = /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(label) ||
      /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(url);

    if (!isImageLink) return match;
    return `![${label}](${url})`;
  });
};

const isImageUrl = (url: string): boolean => {
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(url);
};

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { data: post, isLoading, error } = useGetPostByIdQuery(postId);
  const currentUser = useAppSelector((state) => state.auth?.user);
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [createReaction] = useCreateReactionMutation();
  const [deleteReaction] = useDeleteReactionMutation();
  const [createBookmark] = useCreateBookmarkMutation();
  const [deleteBookmark] = useDeleteBookmarkMutation();
  const [followAuthor] = useFollowAuthorMutation();
  const [unfollowAuthor] = useUnfollowAuthorMutation();
  const [createComment] = useCreateCommentMutation();
  const [createView] = useCreateViewMutation();

  const requireAuth = () => {
    // In admin panel, user should already be authenticated
    // If user data not loaded yet, just return false without redirecting
    if (currentUser?.id) return true;
    if (isAuthenticated) {
      // Authenticated but user data still loading, just return false
      console.log('User authenticated but data not loaded yet');
      return false;
    }
    // Not authenticated at all - this shouldn't happen in admin panel
    return false;
  };

  const { data: bookmarks } = useGetUserBookmarksQuery(
    currentUser?.id ? { userId: currentUser.id, page: 1, limit: 100 } : { userId: '' },
    { skip: !currentUser?.id }
  );

  const { data: followers } = useGetAuthorFollowersQuery(
    post?.user?.id ? { authorId: post.user.id } : undefined,
    { skip: !post?.user?.id }
  );

  const { data: comments } = useGetCommentsQuery(
    post?.id ? { postId: post.id } : undefined,
    { skip: !post?.id }
  );

  useEffect(() => {
    if (currentUser?.id && post?.id) {
      const liked = (post.reactions || []).some(
        (r) => r.user_id === currentUser.id && r.type === 'like'
      );
      setIsLiked(liked);
      setLikeCount((post.reactions || []).filter((r) => r.type === 'like').length);
    }
  }, [post, currentUser]);

  useEffect(() => {
    if (currentUser?.id && bookmarks) {
      const bookmarked = bookmarks.some((b: any) => b.post_id === post?.id);
      setIsBookmarked(bookmarked);
    }
  }, [bookmarks, post, currentUser]);

  useEffect(() => {
    if (currentUser?.id && post?.user?.id && followers) {
      const following = (followers.items || []).some((f: any) => f.followerId === currentUser.id);
      setIsFollowing(following || false);
    }
  }, [followers, post, currentUser]);

  useEffect(() => {
    if (comments && Array.isArray(comments)) {
      setCommentCount(comments.length);
    }
  }, [comments]);

  useEffect(() => {
    const trackView = async () => {
      if (!post?.id || !currentUser?.id) return;

      const viewTrackKey = `view-tracked-${post.id}-${currentUser.id}`;
      if (typeof window !== 'undefined' && sessionStorage.getItem(viewTrackKey)) {
        return;
      }

      try {
        await createView({
          user_id: currentUser.id,
          viewable_type: ViewableType.POST,
          viewable_id: post.id,
          ip_address: 'client',
        }).unwrap();

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(viewTrackKey, '1');
        }
      } catch (err) {
        console.error('Failed to track post view:', err);
      }
    };

    trackView();
  }, [post?.id, currentUser?.id, createView]);

  const handleLike = async () => {
    if (!requireAuth() || !post?.id) return;
    const userId = currentUser?.id;
    if (!userId) return;

    try {
      if (isLiked) {
        const likeReaction = (post.reactions || []).find(
          (r) => r.user_id === userId && r.type === 'like'
        );
        if (likeReaction) {
          await deleteReaction(likeReaction.id).unwrap();
        }
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await createReaction({
          user_id: userId,
          reactable_type: 'post',
          reactable_id: post.id,
          type: 'like',
        } as any).unwrap();
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleBookmark = async () => {
    if (!requireAuth() || !post?.id) return;
    const userId = currentUser?.id;
    if (!userId) return;

    try {
      if (isBookmarked) {
        const bookmark = bookmarks?.find((b: any) => b.post_id === post.id);
        if (bookmark) {
          await deleteBookmark(bookmark.id).unwrap();
        }
        setIsBookmarked(false);
      } else {
        await createBookmark({
          user_id: userId,
          post_id: post.id,
        } as any).unwrap();
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleFollowAuthor = async () => {
    if (!requireAuth() || !post?.user?.id) return;
    const userId = currentUser?.id;
    if (!userId) return;

    try {
      if (isFollowing) {
        const follower = (followers?.items || []).find((f: any) => f.followerId === userId);
        if (follower) {
          await unfollowAuthor(follower.id).unwrap();
        }
        setIsFollowing(false);
      } else {
        await followAuthor({
          author_id: post.user.id,
          follower_id: userId,
        } as any).unwrap();
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  const handleAddComment = async () => {
    if (!requireAuth() || !post?.id) return;
    if (!newCommentContent.trim()) {
      alert('Please write a comment before posting.');
      document.getElementById('new-comment-input')?.focus();
      return;
    }

    setIsSubmittingComment(true);
    try {
      await createComment({
        postId: post.id,
        content: newCommentContent,
      } as any).unwrap();
      setNewCommentContent('');
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };



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

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const shareUrl = window.location.href;
    const shareTitle = post?.title || 'Post';

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert('Post link copied to clipboard');
    } catch (err) {
      console.error('Failed to share post:', err);
    }
  };

  const handleCommentButtonClick = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });

    if (!currentUser?.id) {
      // In admin panel, user should already be authenticated
      console.log('User data not loaded yet');
      return;
    }

    setTimeout(() => {
      document.getElementById('new-comment-input')?.focus();
    }, 250);
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

  const contentToRender = normalizeContentMediaUrls(post.content, post.media || []);
  const attachedMedia = Array.from(
    new Map(
      ((post.media || []) as MediaLike[])
        .map((item) => {
          const url = resolveMediaUrl(item);
          return {
            id: (item as any)?.id || (item as any)?.media?.id || url,
            url,
            filename: item?.filename || item?.media?.filename || 'media',
          };
        })
        .filter((item) => Boolean(item.url))
        .map((item) => [item.url, item]),
    ).values(),
  );

  const contentBlocks = post.content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

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
                  {(post.user as any)?.display_name || post.user?.name || (post.user as any)?.username || 'Unknown Author'}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(post.views || 0).toLocaleString()} views</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFollowAuthor}
                disabled={!currentUser?.id || post.user_id === currentUser?.id}
                className={`text-xs ${isFollowing ? 'bg-primary-100 text-primary-700' : ''}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
            </div>
          )}

          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-lg my-2"
              />
            </div>
          )}

          {/* Interleaved Content Blocks and Attached Media */}
          {contentBlocks.map((block, blockIndex) => (
            <div key={`block-${blockIndex}`}>
              {/* Render content block */}
              <div className="prose prose-lg max-w-none mb-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) => (
                      <img
                        src={src || ''}
                        alt={alt || 'Post image'}
                        className="w-full rounded-lg my-6"
                      />
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {block}
                </ReactMarkdown>
              </div>

              {/* Render corresponding attached media image if it exists */}
              {blockIndex < attachedMedia.length && attachedMedia[blockIndex] && (
                <div className="mb-8">
                  {isImageUrl(attachedMedia[blockIndex].url) ? (
                    <img
                      src={attachedMedia[blockIndex].url}
                      alt={attachedMedia[blockIndex].filename}
                      className="w-full rounded-lg my-2"
                    />
                  ) : (
                    <a
                      href={attachedMedia[blockIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {attachedMedia[blockIndex].filename}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Render any remaining images that don't have corresponding content blocks */}
          {attachedMedia.length > contentBlocks.length && (
            <div className="mb-8 space-y-6">
              {attachedMedia.slice(contentBlocks.length).map((media) => (
                <div key={media.id} className="w-full">
                  {isImageUrl(media.url) ? (
                    <img
                      src={media.url}
                      alt={media.filename}
                      className="w-full rounded-lg my-2"
                    />
                  ) : (
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {media.filename}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

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
            <div className="text-2xl font-bold text-blue-600">{(post.views || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Views</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{likeCount}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{commentCount}</div>
            <div className="text-sm text-gray-600">Comments</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{bookmarks?.filter((b: any) => b.post_id === post.id).length || 0}</div>
            <div className="text-sm text-gray-600">Bookmarks</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={handleLike}
          disabled={!currentUser?.id}
          className={`flex items-center gap-2 cursor-pointer ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-red-50 hover:border-red-200'}`}
        >
          <Heart className="w-4 h-4" />
          Like {likeCount > 0 && `(${likeCount})`}
        </Button>
        <Button
          variant="outline"
          onClick={handleCommentButtonClick}
          disabled={!currentUser?.id}
          className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200"
        >
          <MessageCircle className="w-4 h-4" />
          Comment {commentCount > 0 && `(${commentCount})`}
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center gap-2 cursor-pointer hover:bg-green-50 hover:border-green-200"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={handleBookmark}
          disabled={!currentUser?.id}
          className={`flex items-center gap-2 cursor-pointer ${isBookmarked ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'hover:bg-yellow-50 hover:border-yellow-200'}`}
        >
          <Bookmark className="w-4 h-4" />
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
      </div>

      {/* Comments Section */}
      <div id="comments-section">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({commentCount})</h3>

            {/* Comment Form */}
            {currentUser?.id ? (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add a Comment
                  </label>
                  <textarea
                    id="new-comment-input"
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={handleAddComment}
                  disabled={isSubmittingComment}
                  className="w-full"
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-blue-700">
                  <Link href="/auth/login" className="font-semibold hover:underline">
                    Sign in
                  </Link>
                  {' '}to leave a comment.
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments && Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="pb-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-900">
                            {comment.author?.name || comment.authorId || 'Anonymous'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString()
                              : 'Just now'}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        <CommentRepliesSection
                          commentId={comment.id}
                          currentUserId={currentUser?.id}
                          onRequireAuth={() => router.push(`/auth/login?redirect=/posts/${postId}`)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}