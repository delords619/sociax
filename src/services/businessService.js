import { supabase } from '../config/supabase';

export const businessService = {
  // Create business page
  async createBusinessPage(userId, businessData) {
    try {
      const { data, error } = await supabase
        .from('business_pages')
        .insert([
          {
            user_id: userId,
            name: businessData.name,
            category: businessData.category,
            description: businessData.description,
            email: businessData.email,
            phone: businessData.phone,
            website: businessData.website,
            address: businessData.address,
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

  // Get business page
  async getBusinessPage(businessId) {
    try {
      const { data, error } = await supabase
        .from('business_pages')
        .select(`
          *,
          users:user_id (
            username,
            first_name,
            last_name
          )
        `)
        .eq('id', businessId)
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get user's business pages
  async getUserBusinessPages(userId) {
    try {
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update business page
  async updateBusinessPage(businessId, updateData) {
    try {
      const { data, error } = await supabase
        .from('business_pages')
        .update(updateData)
        .eq('id', businessId)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Delete business page
  async deleteBusinessPage(businessId) {
    try {
      const { error } = await supabase
        .from('business_pages')
        .delete()
        .eq('id', businessId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Upload business profile picture
  async uploadBusinessPicture(businessId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${businessId}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('business-pictures')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // Search business pages
  async searchBusinessPages(query) {
    try {
      const { data, error } = await supabase
        .from('business_pages')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(20);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
};
