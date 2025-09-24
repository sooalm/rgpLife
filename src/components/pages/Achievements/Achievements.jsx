import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "/src/styles/Achievements.css";
import trophy from "/src/assets/trophy.svg";

const Achievements = () => {
  const [startVisibleItems, setStartVisibleItems] = useState(0);
  const visibleItems = useRef([]);
  const items = useRef([]);
  const page = useRef(1);

  const containerRef = useRef(null);
  const scrollref = useRef(null);
  const numItemsPerRow = useRef(0);
  const numVisibleRows = useRef(4);

  async function fetchDataIncrementally(page = 1, limit = 20) {
    console.log("Fetching page:", page);

    try {
      const response = await fetch("/src/assets/data/achievements.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Пагинация: вычисляем начальный и конечный индексы
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedData = data.slice(startIndex, endIndex);

      return paginatedData;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  }
  function infinityScroll() {
    fetchDataIncrementally(page.current).then((newItems) => {
      if (newItems.length > 0) {
        items.current.push(newItems);
        page.current += 1;
      }
    });
  }
  function virtualizer() {
    const container = containerRef.current;
    numItemsPerRow.current = Math.floor(container.clientWidth / 188);
    numVisibleRows.current = Math.ceil(container.clientHeight / 168);
    const totalVisibleItems = numItemsPerRow.current * numVisibleRows.current;
  }

  useEffect(() => {
    if (scrollref.current.scrollTop > containerRef.current.clientHeight / 2)
      infinityScroll();
    virtualizer();
  }, [startVisibleItems]);

  return (
    <div className="achievments" ref={scrollref}>
      <div
        className="spacer"
        style={{
          height: `${startVisibleItems * 188}px`,
          width: "100%",
          pointerEvents: "none",
        }}
      ></div>
      <div className="achievements-list" ref={containerRef}>
        {visibleItems.map((item, index) => {
          return <Achievement key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

function Achievement({ item }) {
  //item dimensions:
  //width: 120 + 40 + 6 = 166, and a margin of 50px.
  //height: 130 + 40 + 6 = 176, and a margin of 50px.
  let rarityColor = 0;
  switch (item.rarity) {
    case "common":
      rarityColor = "dimgray";
      break;
    case "uncommon":
      rarityColor = "darkgreen";
      break;
    case "rare":
      rarityColor = "royalblue";
      break;
    case "epic":
      rarityColor = "mediumvioletred";
      break;
    case "legendary":
      rarityColor = "darkorange";
      break;
    default:
      rarityColor = "black";
  }
  return (
    <div
      className="achievements-list__elements"
      style={{ padding: "20px", borderColor: rarityColor }}
    >
      <img src={trophy} className="achievements-list__trophy " />
      <div className="item">
        <p className="item__name" style={{ color: "black" }}>
          {item.name}
        </p>
        <p
          className="item__description"
          style={{ color: "black", textOverflow: "ellipsis" }}
        >
          {item.description}
        </p>
        <p className="item__rarity" style={{ color: rarityColor }}>
          {item.rarity}
        </p>
      </div>
    </div>
  );
}
export default Achievements;
