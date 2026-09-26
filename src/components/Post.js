import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import './Post.css';

const Post = ({ post, onLike, onDelete }) => {
  const { profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (date) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return postDate.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      const result = await postService.toggleLike(post.id, profile.id);
      if (result.error) {
        console.error('Like error:', result.error);
        return;
      }

      if (result.liked) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      }

      if (onLike) {
        onLike();
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeleting(true);
    try {
      const result = await postService.deletePost(post.id);
      if (result.error) {
        console.error('Delete error:', result.error);
        return;
      }

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  const isOwnPost = profile?.id === post.user_id;
  const author = post.users;

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${author?.id}`} className="post-author-link">
          <img
            src={author?.profile_picture_url || '/default-avatar.png'}
            alt={author?.first_name}
            className="post-avatar"
          />
          <div className="post-author-info">
            <h4 className="post-author-name">
              {author?.first_name} {author?.last_name}
            </h4>
            <span className="post-timestamp">{formatDate(post.created_at)}</span>
          </div>
        </Link>

        {isOwnPost && (
          <div className="post-menu">
            <button
              className="post-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
              disabled={deleting}
            >
              ⋯
            </button>
            {showMenu && (
              <div className="post-menu-dropdown">
                <button onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {post.image_urls && post.image_urls.length > 0 && (
        <div className="post-images">
          {post.image_urls.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Post image ${index + 1}`}
              className="post-image"
            />
          ))}
        </div>
      )}

      <div className="post-stats">
        <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>
        <span>{post.comments_count || 0} comment{post.comments_count !== 1 ? 's' : ''}</span>
        <span>{post.shares_count || 0} share{post.shares_count !== 1 ? 's' : ''}</span>
      </div>

      <div className="post-actions">
        <button
          className={`post-action ${liked ? 'active' : ''}`}
          onClick={handleLike}
          disabled={deleting}
        >
          <span>👍</span> Like
        </button>
        <button className="post-action" disabled={deleting}>
          <span>💬</span> Comment
        </button>
        <button className="post-action" disabled={deleting}>
          <span>↗️</span> Share
        </button>
      </div>
    </div>
  );
};

export default Post;
