import React from "react";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "/src/styles/Achievements.css";
import trophy from "/src/assets/trophy.svg";

const Achievements = () => {
  const currentPageRef = useRef(1);

  const [items, setItems] = useState(
    Array.from({ length: 1 }, (_, i) => {
      return (
        <>
          <img
            key={uuidv4()}
            src={trophy}
            className="achievements-list__trophy "
          />
          <div className="item">
            <span className="item__name">Новичок</span>
          </div>
        </>
      );
    })
  );
  const observer = useRef();
  const lastItemRef = useRef([]);
  const isLoadingRef = useRef(false);

  async function fetchData(page = 1, limit = 20) {
    let newData = [];
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

      paginatedData.forEach((item) => {
        newData.push(
          <>
            <img
              key={uuidv4()}
              src={trophy}
              className="achievements-list__trophy "
            />
            <div className="item">
              <div className="item__name">{item.name}</div>
              <div className="item__description">{item.description}</div>
              <div className="item__rarity">{item.rarity}</div>
            </div>
          </>
        );
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
    return newData;
  }

  const loadMoreItems = () => {
    fetchData(currentPageRef.current).then((newData) => {
      setItems((prev) => {
        // Проверяем лимит с актуальным состоянием
        if (prev.length >= 120) {
          console.log("Достигнут лимит в 120 элементов");
          // Отключаем observer для последнего элемента
          if (observer.current && lastItemRef.current.length > 0) {
            const lastElement =
              lastItemRef.current[lastItemRef.current.length - 1];
            if (lastElement) {
              observer.current.unobserve(lastElement);
              console.log("Observer отключен для последнего элемента");
            }
          }
          return prev; // Возвращаем старое состояние без изменений
        }

        const newArray = [...prev, ...newData];
        // Здесь newArray уже содержит обновленные данные
        // console.log("Новая длина:", newArray.length);

        // Увеличиваем страницу только если получили данные
        if (newData.length > 0) {
          currentPageRef.current += 1;
          // console.log("Updated page to:", currentPageRef.current);
        } else {
          console.log("No more data, page remains:", currentPageRef.current);
        }

        return newArray;
      });

      isLoadingRef.current = false;
    });
    // const newItems = Array.from({ length: 20 }, (_, i) => {
    //   return (
    //     <img
    //       key={uuidv4()}
    //       src={trophy}
    //       className="achievements-list__trophy"
    //     />
    //   );
    // });
  };

  const handleObserver = (entries) => {
    const lastEntry = entries[0];

    // console.log("observer target: ", lastEntry.target);

    if (lastEntry.isIntersecting && !isLoadingRef.current) {
      isLoadingRef.current = true;
      loadMoreItems();
    }
  };
  const setLastItemRef = (node) => {
    if (node) {
      if (!lastItemRef.current.includes(node)) {
        lastItemRef.current.push(node);

        // console.log("node: ", node);
        let last = lastItemRef.current.length - 1;
        // console.log("последний: ", last);

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
      }
    } //else console.log("NODE == 0   ----> ", node);
  };
  useEffect(() => {
    // console.log("++++++++++++++++++запущен обсервер");
    // if (items.length === 0) {
    //   loadMoreItems(); // Загружаем только если данных еще нет
    // }

    if (lastItemRef.current[0]) {
      observer.current = new IntersectionObserver(handleObserver);
      observer.current.observe(lastItemRef.current[0]);
    }

    return () => {
      if (lastItemRef.current[0]) {
        observer.current.unobserve(lastItemRef.current[0]);
        observer.current.disconnect();
      }
      // console.log("--------------------дисконект обсервер");
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
