import {create} from 'zustand';
import axiosInstance from './axiosInstance';

const useUploadStore = create((set) => ({
    imageUrl: null,
    loading: false,
    error: null,

    uploadImage: async (imageFile) => {
        set({ loading: true, error: null });

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axiosInstance.post('/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                set({ imageUrl: response.data.imageUrl, loading: false });
            } else {
                set({ error: 'Lỗi tải ảnh lên', loading: false });
            }
        } catch (err) {
            console.error('Upload error:', err);
            set({ error: 'Lỗi tải ảnh lên', loading: false });
        }
    },
}));

export default useUploadStore;
