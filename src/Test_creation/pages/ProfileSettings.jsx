// src/pages/ProfileSettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/Navbar';


const EyeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);
const InputField = ({ label, name, children, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-black mb-2">{label}</label>
        <div className="relative">
            <input
                id={name}
                name={name}
                className="w-full h-10 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition pr-10"
                {...props}
            />
            {children && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {children}
                </div>
            )}
        </div>
    </div>
);

const ProfileSettings = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
const [passwordVisibility, setPasswordVisibility] = useState({
    new: false,
    confirm: false,
});
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
});

const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

useEffect(() => {
    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/profile/settings/', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            const { first_name, last_name, phone, email, company_name, company_website } = data;
            setFormData(prev => ({ 
                ...prev, 
                firstName: first_name || '', 
                lastName: last_name || '', 
                phone: phone || '', 
                email: email || '', 
                companyName: company_name || '', 
                companyWebsite: company_website || '' 
            }));
        } catch (error) {
            console.error("Fetch profile error:", error);
        }
    };
    fetchProfileData();
}, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
// REPLACE the old handleSubmit with this new one
const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,
        company_website: formData.companyWebsite,
    };

    if (formData.newPassword) {
        payload.current_password = formData.currentPassword;
        payload.new_password = formData.newPassword;
        payload.confirm_new_password = formData.confirmNewPassword;
    }

    try {
        const response = await fetch('http://localhost:8000/api/profile/settings/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // This will show specific backend errors like "Password incorrect"
            const errorMessage = Object.values(errorData).flat().join(' ');
            throw new Error(errorMessage || 'Failed to save changes.');
        }

        alert("Changes Saved Successfully!");
        // Clear password fields for security
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Save error:", error);
    }
};

    return (
        <div className="bg-[#F9F9F9] min-h-screen font-sans">
            {/* Header */}
     {/*}       <header className="flex items-center justify-between py-3 px-6 bg-white border-b sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 flex items-center justify-center text-white font-bold text-lg rounded">■</div>
                    <span className="font-semibold text-gray-800">GA Proctored Test</span>
                </div>
                <nav className="flex items-center gap-8 text-sm text-gray-600">
                        <Link to="/dashboard" className="text-[#121417]">Dashboard</Link>
    <Link to="/tests" className="text-[#121417]">Tests</Link>
    <Link to="/candidates" className="text-[#121417]">Candidates</Link>
    <Link to="/QuizCreationFlow" className="text-[#121417]">Create a Test</Link>
                    <button className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                    <ProfileDropdown />
                </nav>
            </header>*/}
            <NavBar />
            {/* Main Content */}
            <main className="p-10 max-w-7xl mx-auto">
                <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin/ Teacher Profile & Settings</h1>
                
                <form onSubmit={handleSubmit}>
<div className="space-y-8">
    {/* Section 1: Profile Info */}
    <div>
        <h2 className="text-lg font-semibold text-black mb-4">Profile Picture & Basic Info</h2>

        {/* --- THE IMAGE UPLOAD IS NOW HERE --- */}
        <div className="text-center mb-8">
            <div className="relative w-56 h-56 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden mb-2 mx-auto">
                {imagePreview ? (
                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400"></span>
                )}
                <label htmlFor="profile-upload" className="absolute bottom-2 cursor-pointer bg-white bg-opacity-80 px-3 py-1 text-xs rounded-md shadow-sm hover:bg-gray-50">
                    Upload Image
                </label>
                <input id="profile-upload" ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="First Name" name="firstName" type="text" value={formData.firstName} onChange={handleChange} />
            <InputField label="Last Name" name="lastName" type="text" value={formData.lastName} onChange={handleChange} />
        </div>
    </div>
    
    {/* Section 2: Contact Info */}
    <div>
        <h2 className="text-lg font-semibold text-black mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
    </div>
    
    {/* Section 3: Company Info */}
    <div>
        <h2 className="text-lg font-semibold text-black mb-4">Company Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="Company Name" name="companyName" type="text" value={formData.companyName} onChange={handleChange} />
            <InputField label="Company Website" name="companyWebsite" type="url" value={formData.companyWebsite} onChange={handleChange} />
        </div>
    </div>

    {/* Section 4: Password Update */}
    <div>
        <h2 className="text-lg font-semibold text-black mb-4">Update Password</h2>
        <div className="space-y-4">
            <InputField label="Current Password" name="currentPassword" type="password" placeholder="Enter current password" value={formData.currentPassword} onChange={handleChange} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* REPLACEMENT for New Password field */}
<InputField 
    label="New Password" 
    name="newPassword" 
    type={passwordVisibility.new ? "text" : "password"} 
    placeholder="Enter new password" 
    value={formData.newPassword} 
    onChange={handleChange}
>
    <button 
        type="button" 
        onClick={() => setPasswordVisibility(prev => ({ ...prev, new: !prev.new }))}
        className="text-gray-500 hover:text-gray-700"
    >
        {passwordVisibility.new ? <EyeOffIcon /> : <EyeIcon />}
    </button>
</InputField>
                {/* REPLACEMENT for Confirm New Password field */}
<InputField 
    label="Confirm New Password" 
    name="confirmNewPassword" 
    type={passwordVisibility.confirm ? "text" : "password"} 
    placeholder="Confirm new password" 
    value={formData.confirmNewPassword} 
    onChange={handleChange}
>
    <button 
        type="button" 
        onClick={() => setPasswordVisibility(prev => ({ ...prev, confirm: !prev.confirm }))}
        className="text-gray-500 hover:text-gray-700"
    >
        {passwordVisibility.confirm ? <EyeOffIcon /> : <EyeIcon />}
    </button>
</InputField>
            </div>
            <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">Password Strength</label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">Medium</span>
            </div>
        </div>
    </div>
</div>
                    <div className="mt-10 flex items-center gap-4">
                        <button type="submit" className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-colors">
                            Save Changes
                        </button>
                        <button type="reset" className="px-6 py-2 bg-gray-200 text-black  font-semibold rounded-full hover:bg-gray-300 transition-colors">
                            Cancel / Reset
                        </button>
                    </div>
                </form>
                </div>
            </main>
        </div>
    );
};

export default ProfileSettings;