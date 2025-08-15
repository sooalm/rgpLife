import React from "react";

import avatar_IMG from "../assets/joePeach.png";
import "../styles/Profile.css";

const Profile = () => {
  return (
    <div className="profile-card ">
      <img src={avatar_IMG} className="card__img"></img>
      <h3>@sooalm</h3>
      <p>Administraitor</p>
      <div className="profile-stats">
        <div className="">
          <span>Целей:</span>
          <span> 3</span>
        </div>
        <div className="">
          <span>Достижений:</span>
          <span> 0</span>
        </div>
        <div className="">
          <span>Рейтинг:</span>
          <span> 1</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
