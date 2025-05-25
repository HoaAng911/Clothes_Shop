import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore"; // Import useAuthStore
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const { user, updateUser, isUpdating } = useAuthStore(); // Lấy user và updateUser từ store
    const [name, setName] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [address, setAddress] = useState(user?.address || { street: "", city: "", district: "", ward: "", zipCode: "" });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Khi component được mount, kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng đến trang login
    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            // Cập nhật địa chỉ nếu có, tránh việc undefined
            setAddress(user.address || { street: "", city: "", district: "", ward: "", zipCode: "" });
        }
    }, [user, navigate]);

    // Theo dõi sự thay đổi của user trong store và cập nhật lại các state
    useEffect(() => {
        if (user) {
            setName(user.username || "");
            setEmail(user.email || "");
            setAvatar(user.avatar || "");
            setPhone(user.phone || "");
            setAddress(user.address || { street: "", city: "", district: "", ward: "", zipCode: "" });
        }
    }, [user]);

    const handleSave = () => {
        // Log dữ liệu trước khi gửi yêu cầu cập nhật
        console.log("Dữ liệu cần cập nhật:", { username: name, email, avatar, phone, address });

        // Cập nhật thông tin người dùng
        updateUser({ username: name, email, avatar, phone, address });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(user?.username || "");
        setEmail(user?.email || "");
        setAvatar(user?.avatar || "");
        setPhone(user?.phone || "");
        setAddress(user?.address || { street: "", city: "", district: "", ward: "", zipCode: "" });
        setIsEditing(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file)); // Tạo URL tạm thời cho ảnh
        }
    };

    return (
        <div className="profile-container">
            <h2>Thông tin cá nhân</h2>
            <div className="profile-card">
                <div className="avatar-section">
                    <img
                        src={avatar || "https://via.placeholder.com/150"} // Ảnh mặc định nếu chưa có avatar
                        alt="User Avatar"
                        className="avatar"
                    />
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    )}
                </div>
                <div className="profile-info">
                    <label>
                        Tên:
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        ) : (
                            <p>{name}</p>
                        )}
                    </label>
                    <label>
                        Email:
                        {isEditing ? (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        ) : (
                            <p>{email}</p>
                        )}
                    </label>
                    <label>
                        Số điện thoại:
                        {isEditing ? (
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        ) : (
                            <p>{phone}</p>
                        )}
                    </label>
                    <label>
                        Địa chỉ:
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    placeholder="Đường"
                                />
                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    placeholder="Thành phố"
                                />
                                <input
                                    type="text"
                                    value={address.district}
                                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                    placeholder="Quận"
                                />
                                <input
                                    type="text"
                                    value={address.ward}
                                    onChange={(e) => setAddress({ ...address, ward: e.target.value })}
                                    placeholder="Phường"
                                />
                                <input
                                    type="text"
                                    value={address.zipCode}
                                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                    placeholder="Mã bưu chính"
                                />
                            </div>
                        ) : (
                            <p>{`${address.street}, ${address.city}, ${address.district}, ${address.ward}, ${address.zipCode}`}</p>
                        )}
                    </label>

                    <div className="buttons">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} disabled={isUpdating}>
                                    {isUpdating ? "Đang cập nhật..." : "Lưu"}
                                </button>
                                <button onClick={handleCancel}>Hủy</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
