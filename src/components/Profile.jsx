import React from "react";

const Profile = () => {
  return (
    <div className="card">
      <img className="card__img"></img>
      <h2>@sooalm</h2>
      <p>Administraitor</p>
      <div className="card__stats">
        <div className="card-stat-row --flex-jb">
          <span>Целей:</span>
          <span>Число с сервера</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
