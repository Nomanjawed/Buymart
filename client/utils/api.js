import api from './axios';
import axios from 'axios';
import Cookies from 'js-cookie';

// Authentication
export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const result = data?.data ;
    const token = result?.token 

    if (typeof token === 'string' && token.length > 0) {
        Cookies.set('token', token, { expires: 7 });
    }

    return result?.user ?? result;
};

export const registerUser = async (username, fullname, email, password) => {
   const { data } = await api.post('/auth/register', { email, password, username, fullname });
    const result = data?.data ;

    return result?.user ?? result;
};



export const getMe = async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
};


// Blogs
export const getBlogs = async () => {
    const { data } = await api.get('/blogs');
    return { data };
};

export const getAllBlogs = async () => {
    try {
        const { data } = await api.get('/blogs/all');
        return { data };
    } catch (error) {
        console.error('Error fetching all blogs:', error.message);
        throw error;
    }
};

export const getBlogBySlug = async (slug) => {
    const { data } = await api.get(`/blogs/${slug}`);
    return { data };
};




// Upload Helper (Signature + Cloudinary)
const getSignature = async () => {
    const { data } = await api.get('/upload/signature');
    return data.data; // { signature, timestamp, apiKey, cloudName }
};

const uploadImage = async (file) => {
    const sigData = await getSignature();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', 'blogs');

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        formData
    );
    return res.data.secure_url;
};


// Create Blog
export const createBlog = async (blogData, imageFile) => {
    let imageUrl = '';
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    await api.post('/blogs', {
        ...blogData, // title, content, category (id), status
        image: imageUrl
    });
};