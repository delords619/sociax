import React, { useState } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((urls) => {
      setImagePreviews(urls);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrls = [];

      if (images.length > 0) {
        for (const image of images) {
          const result = await postService.uploadPostImage(profile.id, image);
          if (result.error) {
            throw new Error(result.error);
          }
          imageUrls.push(result.url);
        }
      }

      const postData = {
        content: content.trim(),
        imageUrls: imageUrls,
      };

      const result = await postService.createPost(profile.id, postData);

      if (result.error) {
        throw new Error(result.error);
      }

      setContent('');
      setImages([]);
      setImagePreviews([]);
      onPostCreated();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img
          src={profile?.profile_picture_url || '/default-avatar.png'}
          alt="Profile"
          className="create-post-avatar"
        />
        <textarea
          className="create-post-input"
          placeholder={`What's on your mind, ${profile?.first_name}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          rows="3"
        />
      </div>

      {error && <div className="create-post-error">{error}</div>}

      {imagePreviews.length > 0 && (
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="preview-item">
              <img src={preview} alt={`Preview ${index + 1}`} />
              <button
                className="remove-image-btn"
                onClick={() => handleRemoveImage(index)}
                disabled={loading}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="create-post-footer">
        <div className="create-post-actions">
          <label className="post-action-btn">
            <span>📸</span>
            <span>Photo/Video</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleImageSelect}
              disabled={loading}
              hidden
            />
          </label>
          <button className="post-action-btn" disabled={loading}>
            <span>😊</span>
            <span>Feeling/Activity</span>
          </button>
          <button className="post-action-btn" disabled={loading}>
            <span>📍</span>
            <span>Check In</span>
          </button>
        </div>

        <button
          className="post-button"
          onClick={handlePost}
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
