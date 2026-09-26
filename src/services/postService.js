import { supabase } from '../config/supabase';

export const postService = {
  // Create a new post
  async createPost(userId, postData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: userId,
            content: postData.content,
            image_urls: postData.imageUrls || [],
            likes_count: 0,
            comments_count: 0,
            shares_count: 0,
            created_at: new Date(),
          },
        ])
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get feed posts
  async getFeedPosts(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id (
            id,
            username,
            first_name,
            last_name,
            profile_picture_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get user posts
  async getUserPosts(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Update post
  async updatePost(postId, updateData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Like/unlike post
  async toggleLike(postId, userId) {
    try {
      const { data: existingLike, error: fetchError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        if (deleteError) throw deleteError;
        return { liked: false, error: null };
      } else {
        // Like
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }]);
        if (insertError) throw insertError;
        return { liked: true, error: null };
      }
    } catch (error) {
      return { liked: null, error: error.message };
    }
  },

  // Upload post images
  async uploadPostImage(postId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${postId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },
};
