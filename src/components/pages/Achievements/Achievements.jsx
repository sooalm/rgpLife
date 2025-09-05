import React from "react";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "../../../styles/Achievements.css";
import trophy from "../../../assets/trophy.svg";

const Achievements = () => {
  const [isLoading, setIsLoading] = useState(false);

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
  const lastItemRef = useRef([]);

  const loadMoreItems = () => {
    console.log("LOADING");
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

    setIsLoading(false);
    // setLastItemRef(items[items.length - 1]);

    // console.log("last ref: ", lastItemRef.current);
  };

  const handleObserver = (entries) => {
    const lastEntry = entries[0];
    console.log("is it? ===", isLoading, "||||| entry--->", entries[0]);

    // console.log("observer target: ", lastEntry.target);

    if (lastEntry.isIntersecting) {
      if (!isLoading) {
        setIsLoading(true);
        loadMoreItems();
      }
    }
  };
  const setLastItemRef = (node) => {
    if (node) {
      if (!lastItemRef.current.includes(node)) {
        lastItemRef.current.push(node);

        console.log("node: ", node);
        let last = lastItemRef.current.length - 1;
        console.log("последний: ", last);

        lastItemRef.current[last].style.border = "5px solid red";
        if (observer.current)
          observer.current.observe(lastItemRef.current[last]);
      }

      if (
        lastItemRef.current.length - 2 >= 0 &&
        lastItemRef.current[lastItemRef.current.length - 2] &&
        observer.current
      ) {
        lastItemRef.current[lastItemRef.current.length - 2].style.border =
          "5px solid black";
        observer.current.unobserve(
          lastItemRef.current[lastItemRef.current.length - 2]
        );
        console.log("предПоследний: ", lastItemRef.current.length - 2);
      }
    } else
      console.log(
        "wtfak NODE == 0   ----> ",
        node
        // lastItemRef.current[lastItemRef.current.length - 1]
      );
  };
  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver);
    console.log("++++++++++++++++++запущен обсёр");
    observer.current.observe(lastItemRef.current[0]);

    return () => {
      observer.current.unobserve(lastItemRef.current[0]);
      observer.current.disconnect();
      console.log("--------------------опущен обсёр");
    };
  }, []); //lastItemRef.current
  return (
    <div className="achievments">
      <div className="achievements-list">
        {items.map((item, index) => {
          return (
            <div
              className="achievements-list__elements"
              key={index}
              ref={index === items.length - 1 ? setLastItemRef : null}
              // {index === items.length - 1 ? setLastItemRef : null}
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
