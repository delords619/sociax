import { supabase } from '../config/supabase';

export const userService = {
  // Create user profile
  async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: profileData.email,
            username: profileData.username,
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            short_intro: profileData.shortIntro,
            bio: profileData.biography,
            hometown: profileData.hometown,
            city: profileData.city,
            date_of_birth: profileData.dateOfBirth,
            relationship_status: profileData.relationshipStatus,
            gender: profileData.gender,
            language: profileData.language,
            verified: false,
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

  // Get user profile
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get user details (hobbies, interests)
  async getUserDetails(userId) {
    try {
      const { data, error } = await supabase
        .from('user_details')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Create or update user details
  async upsertUserDetails(userId, detailsData) {
    try {
      const { data, error } = await supabase
        .from('user_details')
        .upsert(
          [
            {
              user_id: userId,
              hobbies: detailsData.hobbies || [],
              interests_music: detailsData.interestsMusic || [],
              interests_tv_shows: detailsData.interestsTvShows || [],
              interests_movies: detailsData.interestsMovies || [],
              interests_games: detailsData.interestsGames || [],
              interests_sports: detailsData.interestsSports || [],
              work_experience: detailsData.workExperience || [],
              education: detailsData.education || [],
            },
          ],
          { onConflict: 'user_id' }
        )
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Search users
  async searchUsers(query) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, profile_picture_url')
        .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(10);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get user by username
  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile-picture.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // Upload cover photo
  async uploadCoverPhoto(userId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/cover-photo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cover-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('cover-photos')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },
};
