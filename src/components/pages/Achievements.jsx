import React from "react";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "../../styles/Achievements.css";
import trophy from "../../assets/trophy.svg";

const Achievements = () => {
  const [items, setItems] = useState(
    Array.from({ length: 20 }, (_, i) => {
      return (
        <img
          key={uuidv4()}
          src={trophy}
          className="achievements-list__trophy"
        />
      );
    })
  );
  // const [page, setPage] = useState(1);
  const observer = useRef();
  const lastItemRef = useRef();

  const loadMoreItems = () => {
    const newItems = Array.from({ length: 20 }, (_, i) => {
      return (
        <img
          key={uuidv4()}
          src={trophy}
          className="achievements-list__trophy"
        />
      );
    });
    setItems((prev) => [...prev, ...newItems]);

    // console.log("last ref: ", lastItemRef.current);
    // lastItemRef.current.style.border = "5px solid red";
  };

  const handleObserver = (entries) => {
    const lastEntry = entries[0];
    // console.log("observer target: ", lastEntry.target);

    if (lastEntry.isIntersecting) {
      loadMoreItems();
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver);
    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
      // console.log("наблюдаю за:", lastItemRef.current);
    } else console.log("else: ", lastItemRef.current);
    // console.log("USE EFFECT");
    return () => {
      if (lastItemRef.current) {
        observer.current.unobserve(lastItemRef.current);
      }
    };
  }, [lastItemRef.current]);
  return (
    <div className="achievments">
      <div className="achievements-list">
        {items.map((item, index) => (
          <div
            className="achievements-list__elements"
            key={index}
            ref={lastItemRef}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
