import { supabase } from '../config/supabase';

export const verificationService = {
  // Submit verification request
  async submitVerificationRequest(userId, verificationData) {
    try {
      const fileExt = verificationData.documentFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // Upload document
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, verificationData.documentFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(filePath);

      // Create verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .insert([
          {
            user_id: userId,
            document_type: verificationData.documentType,
            document_url: urlData.publicUrl,
            full_name: verificationData.fullName,
            id_number: verificationData.idNumber,
            status: 'pending',
            submitted_at: new Date(),
          },
        ])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get verification request
  async getVerificationRequest(userId) {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get all verification requests (admin)
  async getVerificationRequests(status = null) {
    try {
      let query = supabase
        .from('verification_requests')
        .select(`
          *,
          users:user_id (
            username,
            email,
            first_name,
            last_name
          )
        `)
        .order('submitted_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Approve verification
  async approveVerification(requestId, userId) {
    try {
      // Update verification request
      const { error: updateError } = await supabase
        .from('verification_requests')
        .update({ status: 'approved', reviewed_at: new Date() })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Update user verified status
      const { error: userError } = await supabase
        .from('users')
        .update({ verified: true })
        .eq('id', userId);

      if (userError) throw userError;

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Reject verification
  async rejectVerification(requestId, rejectionReason) {
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: new Date(),
        })
        .eq('id', requestId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
