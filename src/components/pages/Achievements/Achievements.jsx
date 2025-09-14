import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "/src/styles/Achievements.css";
import trophy from "/src/assets/trophy.svg";

const Achievements = () => {
  const [startVisibleItems, setStartVisibleItems] = useState(0);
  const [itemHeight, setItemHeight] = useState(180); // Default height, will be updated
  const [visibleItems,setVisibleItems] = useState([]);
  const [top,setTop] = useState(0);
  const [isLoading,setLoading] = useState(false);
  const items = useRef([]);
  const paginationPage = useRef(1);

  const containerRef = useRef(null);
  const scrollref = useRef(null);
  const numItemsPerRow = useRef(0);
  const numVisibleRows = useRef(4);

  async function fetchDataIncrementally(page = 1, limit = 40) {
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
    fetchDataIncrementally(paginationPage.current).then((newItems) => {
      if (newItems.length > 0) {
        let oldItems = items.current.length;
        newItems.forEach((item) => {
          if (!items.current.some(existingItem => existingItem.id === item.id)) {
            items.current.push(item);
          
          }else console.log("same item")
        });
        console.log("items length: ", items.current.length);
        if(oldItems < items.current.length){ 
          paginationPage.current += 1;
        }
        virtualizer();
      }else{
        console.log("No more data");
        
      }
    
    });
    // console.log("infinityScroll");
  }

  function virtualizer() {
    if (!scrollref.current) return;

    const scroll = scrollref.current;
    numItemsPerRow.current = Math.floor(scroll.clientWidth / itemHeight);
    numVisibleRows.current = Math.ceil(scroll.clientHeight / (itemHeight-10));
    
    if(scrollref.current.scrollTop >=0 ){
      const start = Math.floor(scrollref.current.scrollTop/itemHeight);
      setStartVisibleItems(start);
    }
   
    const endVisibleItems = startVisibleItems + numItemsPerRow.current * numVisibleRows.current*2;

      setVisibleItems(items.current.slice(
        startVisibleItems,
        endVisibleItems
      ));
  //  console.log("vis ===",visibleItems)
  }
 
  useEffect(() => {
  //  console.log("AAAAAAAAAAAAAAA, startVisibleItems: ", startVisibleItems);
    
   infinityScroll();
   virtualizer();
 
    const scroll = scrollref.current; 
    if(scroll){
      scroll.addEventListener("scroll",()=>{
        if(scroll.scrollTop!=top){
          setTop(scroll.scrollTop)
          
        }
    })
    return () => {
        scroll.removeEventListener("scroll", ()=>{
          if(scroll.scrollTop!=top){
            setTop(scroll.scrollTop)
          
          }
      });
    };
  }
  }, [top]);


  // Create a ref to measure the first rendered Achievement
  const firstItemRef = useRef(null);

  // Measure the height of the first rendered item
  useEffect(() => {
    if (firstItemRef.current && visibleItems.length > 0) {
      const height = firstItemRef.current.getBoundingClientRect().height;
      setItemHeight(height);
      // console.log('Achievement item height:', height);
    }
  }, [visibleItems]);

  return (
    <div className="achievments" ref={scrollref}>
      <div
        className="spacer"
        style={{
          height: `${top < startVisibleItems*itemHeight ? top : startVisibleItems*itemHeight}px`,
          width: "100%",
          pointerEvents: "none",
        }}
      ></div>
      <div className="achievements-list" ref={containerRef}>
        {visibleItems.map((item, index) => {
          // Only measure the first item
          const ref = index === 0 ? firstItemRef : null;
          return <Achievement key={uuidv4()} ref={ref} item={item} />;
        })}
      </div>
    </div>
  );
};

const Achievement = React.forwardRef(({ item }, ref) => {
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
      ref={ref}
      className="achievements-list__elements"
      style={{ padding: "20px", borderColor: rarityColor }}
    >
      <img src={trophy} className="achievements-list__trophy " />
      <div className="item">
        <p className="item__name" style={{ color: "black" }}>
          {item.name} {item.id}
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
});
export default Achievements;
