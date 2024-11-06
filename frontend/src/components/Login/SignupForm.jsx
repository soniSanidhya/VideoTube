import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { login } from '../../Utils/functionalties/isLoginSlice';
import api from '../../Utils/axiosHelper';

const postRegister = (form) => api.post('/api/users/register', form);

function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: '',
    coverImage: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0]
    });

    console.log(formData);
    
   

    // Show a preview of the avatar if it's the avatar field
    if (name === 'avatar') {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setAvatarPreview(fileReader.result);
      };
      fileReader.readAsDataURL(files[0]);
    }
  };


  const {mutate } = useMutation({
    mutationFn: (form)=> postRegister(form),
    onSuccess: (newData)=>{

      dispatch(login());
      toast.success("User Registered Successfully");
      console.log("SUCCESS", newData);
      navigate("/login");
      console.log("SUCCESS");
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      console.log(key);
      form.append(key, formData[key]);
      
    }
    console.log(formData);
    console.log(form);
    // Add registration logic here
    mutate(form);
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1e1e1e] rounded-lg shadow-md">
        <div className="mx-auto w-full justify-center flex">
          <div className=" w-16">
          <svg
            style={{ width: "100%" }}
            viewBox="0 0 63 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M47.25 47.458C55.9485 38.7595 55.9485 24.6565 47.25 15.958C38.5515 7.25952 24.4485 7.25952 15.75 15.958C7.05151 24.6565 7.05151 38.7595 15.75 47.458C24.4485 56.1565 38.5515 56.1565 47.25 47.458Z"
              stroke="#E9FCFF"
              strokeWidth="1.38962"
              stroke-miterlimit="10"
            ></path>
            <path
              d="M10.5366 47.7971V17.5057C10.5366 16.9599 11.1511 16.6391 11.599 16.9495L33.4166 32.0952C33.8041 32.3639 33.8041 32.9368 33.4166 33.2076L11.599 48.3533C11.1511 48.6657 10.5366 48.3429 10.5366 47.7971Z"
              stroke="url(#paint0_linear_53_10115)"
              strokeWidth="6.99574"
              stroke-miterlimit="10"
              strokeLinecap="round"
            ></path>
            <path
              d="M18.1915 27.6963C20.1641 27.6963 21.7285 28.7066 21.7285 30.9021C21.7285 33.0976 20.1621 34.2433 18.1915 34.2433H16.8854V37.8677H14.1733V27.6984H18.1915V27.6963Z"
              fill="#E9FCFF"
            ></path>
            <path
              d="M25.2053 27.6963V35.4868H28.484V37.8657H22.4932V27.6963H25.2053Z"
              fill="#E9FCFF"
            ></path>
            <path
              d="M35.3142 27.6963L39.4553 37.8657H36.5328L35.9162 36.1763H32.1939L31.5773 37.8657H28.6548L32.7959 27.6963H35.3101H35.3142ZM34.9143 33.5663L34.2144 31.7832C34.1582 31.6395 33.954 31.6395 33.8978 31.7832L33.1979 33.5663C33.1541 33.6767 33.2354 33.7975 33.3562 33.7975H34.756C34.8747 33.7975 34.958 33.6767 34.9143 33.5663Z"
              fill="#E9FCFF"
            ></path>
            <path
              d="M40.9491 27.6963L42.8592 30.5188L44.7694 27.6963H48.0355L44.2132 33.2559V37.8657H41.5011V33.2559L37.6787 27.6963H40.9449H40.9491Z"
              fill="#E9FCFF"
            ></path>
            <path
              d="M16.894 32.1396V29.9129C16.894 29.8212 16.9982 29.7671 17.0732 29.8191L18.6771 30.9315C18.7417 30.9773 18.7417 31.0731 18.6771 31.1189L17.0732 32.2313C16.9982 32.2834 16.894 32.2313 16.894 32.1375V32.1396Z"
              fill="#232323"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_53_10115"
                x1="2.23416"
                y1="20.3361"
                x2="26.863"
                y2="44.9649"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#007EF8"></stop>
                <stop offset="1" stopColor="#FF4A9A"></stop>
              </linearGradient>
            </defs>
          </svg>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#ae7aff]">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-[#121212] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
              required
            />
          </div>
          <div>
            <label className="block text-[#ae7aff]">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-[#121212] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
              required
            />
          </div>
          <div>
            <label className="block text-[#ae7aff]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-[#121212] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
              required
            />
          </div>
          <div>
            <label className="block text-[#ae7aff]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-[#121212] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
              required
            />
          </div>
          <div>
            <label className="block text-[#ae7aff]">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 mt-1 text-white bg-[#121212] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 mt-2 rounded-full"
              />
            )}
          </div>
          <div>
            <label className="block text-[#ae7aff]">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              className="w-full p-2 mt-1 text-white bg-[#121212] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
            />
          </div>
          <button
          
            type="submit"
            className="w-full py-2 mt-4 font-bold text-white bg-[#ae7aff] rounded-lg hover:bg-purple-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    transition: Bounce
    />
    </>
  );
}

export default SignupForm;
