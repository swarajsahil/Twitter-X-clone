"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit } from "react-icons/md";
import useUpdateUserProfile from "../hooks/useUpdateUserProfile";
import useAuthUser from "../hooks/useAuthUser";

interface ProfileFormData {
  fullName: string;
  username: string;
  email: string;
  bio?: string;
  link?: string;
  newPassword?: string;
  currentPassword?: string;
  profileImg?: File | null;
  coverImg?: File | null;
}

const EditProfileModal = () => {
  const { authUser } = useAuthUser();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
    profileImg: null,
    coverImg: null,
  });
  const [initialData, setInitialData] = useState<ProfileFormData>({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
  });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const modalRef = useRef<HTMLDialogElement>(null);
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  // Initialize form data with user data
  useEffect(() => {
    if (authUser?.user) {
      const userData = {
        fullName: authUser.user.fullName || "",
        username: authUser.user.username || "",
        email: authUser.user.email || "",
        bio: authUser.user.bio || "",
        link: authUser.user.link || "",
        newPassword: "",
        currentPassword: "",
        profileImg: null,
        coverImg: null,
      };
      setFormData(userData);
      setInitialData(userData);
      setProfilePreview(authUser.user.profileImg || null);
      setCoverPreview(authUser.user.coverImg || null);
    }
  }, [authUser]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password validation
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = "Current password is required to change password";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImg' | 'coverImg') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (field === 'profileImg') {
          setProfilePreview(result);
        } else {
          setCoverPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Always include required fields
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      
      // Add other fields if they have values
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (formData.link) formDataToSend.append('link', formData.link);
      if (formData.newPassword) formDataToSend.append('newPassword', formData.newPassword);
      if (formData.currentPassword) formDataToSend.append('currentPassword', formData.currentPassword);
      if (formData.profileImg) formDataToSend.append('profileImg', formData.profileImg);
      if (formData.coverImg) formDataToSend.append('coverImg', formData.coverImg);

      await updateProfile(formDataToSend);
      modalRef.current?.close();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="px-2 btn btn-outline rounded-full btn-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none hover:shadow-lg transition-all"
        onClick={() => modalRef.current?.showModal()}
        aria-label="Edit profile"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
          Edit Profile
        </span>
      </motion.button>
      
      <dialog 
        ref={modalRef} 
        className="modal backdrop-blur-sm"
        onClose={() => {
          setFormData(initialData);
          setProfilePreview(authUser?.user?.profileImg || null);
          setCoverPreview(authUser?.user?.coverImg || null);
          setErrors({});
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="modal-box border-0 shadow-xl max-w-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-0 overflow-hidden"
          >
            <div className="relative">
              <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full"></div>
              
              <div className="px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-2xl text-gray-800">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                      Edit Profile
                    </span>
                  </h3>
                  <button 
                    onClick={() => modalRef.current?.close()}
                    className="btn btn-circle btn-ghost btn-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 transition-colors"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
                
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  {/* Cover Image Upload */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Cover Image</span>
                    </label>
                    <div className="relative group">
                      <img
                        src={coverPreview || "/cover-placeholder.png"}
                        className="w-full h-32 object-cover rounded-lg"
                        alt="Cover preview"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all cursor-pointer">
                        <span className="opacity-0 group-hover:opacity-100 transition-all text-white font-medium">
                          Change Cover
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'coverImg')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Profile Image</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="avatar relative group">
                        <div className="w-24 rounded-full">
                          <img
                            src={profilePreview || "/avatar-placeholder.png"}
                            alt="Profile preview"
                          />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all cursor-pointer">
                          <MdEdit className="opacity-0 group-hover:opacity-100 transition-all text-white text-xl" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'profileImg')}
                          />
                        </label>
                      </div>
                      <span className="text-sm text-gray-500">
                        Click on the image to change
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Full Name</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`}
                        value={formData.fullName}
                        name="fullName"
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                      {errors.fullName && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.fullName}</span>
                        </label>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Username</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                        value={formData.username}
                        name="username"
                        onChange={handleInputChange}
                        placeholder="username"
                        required
                      />
                      {errors.username && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.username}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Email</span>
                    </label>
                    <input
                      type="email"
                      className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                      value={formData.email}
                      name="email"
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.email}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Bio</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      value={formData.bio}
                      name="bio"
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      maxLength={160}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{formData.bio?.length || 0}/160</span>
                      {formData.bio && formData.bio.length > 0 && (
                        <span className="text-xs text-blue-500">
                          {160 - (formData.bio?.length || 0)} characters left
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Website</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered w-full"
                      value={formData.link}
                      name="link"
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Current Password</span>
                      </label>
                      <input
                        type="password"
                        className={`input input-bordered w-full ${errors.currentPassword ? 'input-error' : ''}`}
                        value={formData.currentPassword}
                        name="currentPassword"
                        onChange={handleInputChange}
                        placeholder="••••••••"
                      />
                      {errors.currentPassword && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.currentPassword}</span>
                        </label>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">New Password</span>
                      </label>
                      <input
                        type="password"
                        className={`input input-bordered w-full ${errors.newPassword ? 'input-error' : ''}`}
                        value={formData.newPassword}
                        name="newPassword"
                        onChange={handleInputChange}
                        placeholder="••••••••"
                      />
                      {errors.newPassword && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.newPassword}</span>
                        </label>
                      )}
                      <label className="label">
                        <span className="label-text-alt text-gray-500">Leave blank to keep current password</span>
                      </label>
                    </div>
                  </div>

                  <div className="modal-action mt-2">
                    <button 
                      type="submit"
                      className="btn w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Save Changes
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;