import React, { useState, useRef, useEffect,useLayoutEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "/src/styles/Achievements.css";
import trophy from "/src/assets/trophy.svg";

const Achievements = () => {
  const [startVisibleItems, setStartVisibleItems] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);
  const items = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [top, setTop] = useState(0);

  const paginationPage = useRef(1);

  const containerRef = useRef(null);
  const scrollref = useRef(null);
  const numItemsPerRow = useRef(0);
  const numVisibleRows = useRef(4);
  const itemHeight = useRef(0);
  const itemWidth = useRef(0);

  async function fetchDataIncrementally(page=1 , limit = 20) {
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
    if (isLoading) return; // Prevent multiple simultaneous fetches
    setIsLoading(true);

    const currentPage = paginationPage.current;
    fetchDataIncrementally(currentPage).then((newItems) => {
     if (newItems.length === 0) {
      console.log('No more items to load');
      return;
       }
       newItems.forEach(item => {
      if( !items.current.some(existingItem => existingItem.id === item.id)){
        paginationPage.current = currentPage + 1;
        setIsLoading(false);
        items.current = [...items.current, ...newItems];
     
      }else setIsLoading(false);
    });
    }).catch(error => {
      console.error('Error loading items:', error);
      setIsLoading(false);
    });
}
  function virtualizer() {
    const scroll = scrollref.current;
      if(scroll){
        const height = itemHeight.current|| 180;
        const width = itemWidth.current || 170;
        // console.log(height,width)
        
        numItemsPerRow.current = Math.floor(scroll.clientWidth / width);
        numVisibleRows.current = Math.ceil(scroll.clientHeight / height)+2;
       
        // console.log(   numItemsPerRow.current,numVisibleRows.current);

        const scrollTop= scroll.scrollTop; 
        setTop(prev=>prev!=scrollTop?scrollTop:prev);
        const totalVisibleItems = numItemsPerRow.current * numVisibleRows.current;
     
        let start = scrollTop === 0 ? 0 : Math.min(Math.floor(scrollTop / height) * numItemsPerRow.current,
        items.current.length - Math.floor(scroll.clientWidth / width)*Math.ceil(scroll.clientHeight / height));
        
        const end = Math.min(items.current.length, start + totalVisibleItems);

        const data = items.current.slice(start, end);
        console.log("ВЫЗООООООВ: ",items.current.length,start, end)
        setVisibleItems(data);
        setStartVisibleItems(start);
    } 
  }

  useEffect(() => {
  //  console.log("virt: ",items.current.length)
      
      requestAnimationFrame(() => {
        virtualizer();
      });
    // console.log("Items updated, length:", items.length,visibleItems);
  }, [isLoading,top]);

  // Initial data load
  useEffect(() => {
   
    if (items.current.length === 0) {
      console.log('Initial data loading...');
  
      requestAnimationFrame(() => {
        infinityScroll();
      });
     
    }
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollref.current;
      // Load more when scrolled to 70% of the container
      const scrollThreshold = 0.7;
      requestAnimationFrame(virtualizer);
      if (scrollTop + clientHeight >= scrollHeight * scrollThreshold 
       ) {
        requestAnimationFrame(() => {
          infinityScroll();
          // virtualizer();
        });
      }
    };
  
    const scroll = scrollref.current;
    if (scroll) {
      // Using passive: true for better performance
      scroll.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scroll.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
 

  const handleFirstItemRef = (node) => {
    if (node !== null) {
      const { height,width } = node.getBoundingClientRect();
      itemHeight.current = height;
      itemWidth.current = width;  
    }
  };
  
  return (
    <div className="achievments" ref={scrollref}>
      <div
        className="spacer"
        style={{
          height: `${Math.floor(startVisibleItems/numItemsPerRow.current)* (itemHeight.current || 170)}px`,
          width: "100%",
          pointerEvents: "none",
        }}
      ></div>
      <div className="achievements-list" ref={containerRef}>
        {visibleItems.map((item, index) => (
          <Achievement 
            key={uuidv4()} 
            item={item} 
            ref={index === 0 ? handleFirstItemRef : null} 
          />
        ))}
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
      className="achievements-list__elements"
      style={{ padding: "20px", borderColor: rarityColor }}
    >
      <img src={trophy} className="achievements-list__trophy " />
      <div className="item" >
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
