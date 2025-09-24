import React from "react";
import { useSelector } from "react-redux";

import avatar_IMG from "../assets/joePeach.png";
import learning_IMG from "../assets/traits/icon_learning.png";
import achievements_IMG from "../assets/traits/Saoshyant.png";
import rating_IMG from "../assets/traits/Event_trigger.png";
import "../styles/Profile.css";

const Profile = () => {
  const allExp = useSelector((state) => state.tasks.generalExperience);

  return (
    <div className="profile-card ">
      <img src={avatar_IMG} className="profile-card__img"></img>
      <h3>@sooalm</h3>
      <p className="profile-jobTitle">Administraitor</p>
      <div className="profile-stats">
        <div className="profile-row">
          <img src={learning_IMG} className="profile-row__img"></img>
          <span className="profile-row__line">Опыт:</span>
          <span className="profile-row__line"> {allExp} exp</span>
        </div>
        <div className="profile-row">
          <img
            src={achievements_IMG}
            className="profile-row__img profile-row__img--small "
          ></img>
          <span className="profile-row__line">Достижений:</span>
          <span className="profile-row__line"> 0</span>
        </div>
        <div className="profile-row">
          <img
            src={rating_IMG}
            className="profile-row__img profile-row__img--small "
          ></img>
          <span className="profile-row__line">Рейтинг:</span>
          <span className="profile-row__line"> 1</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
