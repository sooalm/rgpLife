import React, { useState, useRef, useEffect,useCallback,memo,useMemo} from "react";
import { v4 as uuidv4 } from "uuid";

import "/src/styles/Achievements.css";
import trophy from "/src/assets/trophy.svg";

  async function fetchData(page = 1, limit = 40) {
    console.log("Fetching page:", page);
    // if(page==1) limit =40;
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
  
function InfiniteWrapper({children,fetchData,handleFetchData,paginationPage,virtualizerRef,scrollref,setItems,setIsLoading,items,itemHeight,startIndex,numberPerLine,visibleItems}){
      virtualizerRef.current =  useCallback(
          (event) => {
            if (event.target.scrollTop >= (visibleItems.length/numberPerLine.current) * itemHeight ) { // calculate when to fetch new data
             handleFetchData();
            //  console.log("работаем")
            }
          },
          [startIndex, setItems] //setIsFinished
        );
  return <>{children}</>;
}
function VirtualWrapper({children,itemHeight,scrollref,setStartIndex,virtualizerRef,numberPerLine}){
  
  const perLIne = numberPerLine.current;
  // console.log(perLIne,numberPerLine.current)
  const handleVirtualScroll = useCallback((event) => {
   
    const newStartIndex = Math.floor(event.target.scrollTop / itemHeight);
    setStartIndex(newStartIndex);
    virtualizerRef.current(event); //Initialize infinity scroll wrapper

   
  }, [setStartIndex,itemHeight,perLIne]);

  useEffect(() => {
    const scrollElement = scrollref.current;
    if (!scrollElement) return;
    
    scrollElement.addEventListener("scroll", handleVirtualScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleVirtualScroll);
    };
  }, [handleVirtualScroll]);
  return <>{children}</>;
}


function VirtualisedInfiniteList(){

  const virtualizerRef = useRef(null);
  // const handleFetchData = useRef(null);
  const scrollref = useRef(null);
  const paginationPage = useRef(1);

  // const [isLoading, setIsLoading] =useState(false);
  const isLoading = useRef(false);

  const [startIndex, setStartIndex] =useState(0);
  const [items, setItems] = useState([]);



  const handleFetchData = useCallback(() => {
    if(isLoading.current) return;
    
   
    const currentPage = paginationPage.current; // Сохраняем текущую страницу
    // console.log(`Начинаем загрузку страницы: ${currentPage}`);
    isLoading.current=true;

    fetchData(currentPage).then((newItems) => {
      if (!newItems.length) {
        console.log("No more data");
        isLoading.current=false;
        return;
      }
      setItems(prevItems => {
        const uniqueNewItems = newItems.filter(newItem => 
          !prevItems.some(item => item.id === newItem.id)
        );
      if (uniqueNewItems.length > 0) {
        paginationPage.current =currentPage+ 1;
        // console.log(`Успешно загружена страница: ${currentPage}, следующая: ${paginationPage.current}`);
      }
      isLoading.current=false;
      return [...prevItems, ...uniqueNewItems];
      });
     
      }).catch(error => {
        console.error("Ошибка при загрузке данных:", error);
        isLoading.current = false;
      });
    },[]);

    const firstItem = useRef(null);
    const itemHeight = firstItem.current ? firstItem.current.offsetHeight : 175;
    const itemWidth = firstItem.current ? firstItem.current.offsetWidth : 165;;

    const numberPerLine = useRef(5);

      const visibleItems = useMemo(() => {
      
        return items.slice(Math.floor(startIndex*numberPerLine.current), Math.floor(startIndex*numberPerLine.current) + 5*numberPerLine.current);
      }, [startIndex, items]);

    useEffect(() => {
      numberPerLine.current = Math.ceil(scrollref.current.clientWidth / itemWidth);
      handleFetchData();
    }, []);

    
return(
  <>  
  <InfiniteWrapper 
      handleFetchData={handleFetchData}
      items={items}  setItems={setItems} 
      paginationPage={paginationPage}
   
      scrollref={scrollref}
      
      virtualizerRef={virtualizerRef}
      itemHeight={itemHeight}
      numberPerLine={numberPerLine}
      visibleItems={visibleItems}
      startIndex={startIndex}
      >
    <VirtualWrapper 
        itemHeight={itemHeight} 
        scrollref={scrollref} 
        setStartIndex={setStartIndex}
        virtualizerRef={virtualizerRef}
        numberPerLine={numberPerLine}
        >
      <List
          items = {visibleItems}
          itemHeight={itemHeight}
          scrollref={scrollref}
          startIndex={startIndex}
          numberPerLine={numberPerLine}
          firstItem= {firstItem}
          numItems={items.length}
      />
    </VirtualWrapper>
  </InfiniteWrapper>
  </>
);
}
// style={{ height: `${(startIndex + 20)/numberPerLine * itemHeight}px` }}>
function List({items,itemHeight,scrollref,startIndex,numberPerLine,firstItem,numItems}) {

  return (
    <div className="achievments" ref={scrollref}>
      <div   style={{
            height: `${(Math.ceil(items.length/numberPerLine.current))* itemHeight}px`
          }}>
        <div className="achievements-list" style={{
            position: "relative",
            top: `${Math.floor(startIndex) * itemHeight}px`, }}>
          {items.map((item,i) => (
            <ListItem 
             key={uuidv4()} 
             item={item}
             ref={i===0 ? firstItem : null}
           />
          ))}
        </div>
      </div>
    </div>
  );
};
const ListItem = memo(({ item }) => {
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
          {item.name} 
        </p>
        <p
          className="item__description"
          style={{ color: "black" }}
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

export default VirtualisedInfiniteList;
