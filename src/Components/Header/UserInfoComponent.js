import React from "react";
import profileimg from "../../Asserts/Header/topuserimg.svg";
import './Userinfo.css';

const UserInfoComponent = () => {
  return (
    <div className="user-info d-flex align-items-center justify-content-end p-2">
      {/* Notification Bell SVG */}
      <div className="me-3 bell-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="26"
          viewBox="0 0 25 26"
          fill="none"
        >
          <path
            d="M5 17.4791H9.63539H15.1979H19.8333L18.5308 16.1766C18.1775 15.8234 17.9791 15.3443 17.9791 14.8448V11.9166C17.9791 9.4947 16.4312 7.43428 14.2708 6.67068V6.35416C14.2708 5.33013 13.4406 4.5 12.4166 4.5C11.3926 4.5 10.5625 5.33013 10.5625 6.35416V6.67068C8.40202 7.43428 6.85416 9.4947 6.85416 11.9166V14.8448C6.85416 15.3443 6.65571 15.8234 6.30248 16.1766L5 17.4791Z"
            fill="white"
          />
          <path
            d="M15.1979 17.4791H19.8333L18.5308 16.1766C18.1775 15.8234 17.9791 15.3443 17.9791 14.8448V11.9166C17.9791 9.4947 16.4312 7.43428 14.2708 6.67068V6.35416C14.2708 5.33013 13.4406 4.5 12.4166 4.5C11.3926 4.5 10.5625 5.33013 10.5625 6.35416V6.67068C8.40202 7.43428 6.85416 9.4947 6.85416 11.9166V14.8448C6.85416 15.3443 6.65571 15.8234 6.30248 16.1766L5 17.4791H9.63539M15.1979 17.4791V18.4062C15.1979 19.9422 13.9527 21.1874 12.4166 21.1874C10.8806 21.1874 9.63539 19.9422 9.63539 18.4062V17.4791M15.1979 17.4791H9.63539"
            stroke="#3F3F46"
            strokeWidth="1.06799"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Profile Image + Info */}
      <div className=" userinfo d-flex align-items-center">
        <img
          src={profileimg}
          alt="Profile"
          className="profile-img me-2"
        />
        <div className="user-details text-start">
          <div className="username">Teja</div>
          <div className="role">role</div>
        </div>

        {/* Dropdown Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
  <path d="M5.5 7.5L10.5 12.5L15.5 7.5" stroke="#344054" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </div>
    </div>
  );
};

export default UserInfoComponent;
