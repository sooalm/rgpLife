import React from "react";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "../../../styles/Achievements.css";
import trophy from "../../../assets/trophy.svg";

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
    if (lastItemRef) lastItemRef.current.style.border = "5px solid red";
  };

  const handleObserver = (entries) => {
    const lastEntry = entries[0];

    console.log("observer target: ", lastEntry.target);

    if (lastEntry.isIntersecting) {
      console.log(items.length);
      loadMoreItems();
    }
  };
  const setLastItemRef = (node) => {
    if (lastItemRef.current) {
      console.log("observed: ", lastItemRef.current);
      observer.current.unobserve(lastItemRef.current);
    }

    lastItemRef.current = node;

    if (lastItemRef.current && observer.current) {
      console.log("observes: ", lastItemRef.current);
      observer.current.observe(lastItemRef.current);
      // lastItemRef.current = null;
    }
  };
  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver);

    return () => {
      observer.current.disconnect();
    };
  }, []); //lastItemRef.current
  return (
    <div className="achievments">
      <div className="achievements-list">
        {items.map((item, index) => {
          console.log("ВСЕГО:", items.length);
          return (
            <div
              className="achievements-list__elements"
              key={index}
              ref={index === items.length - 1 ? setLastItemRef : null}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
