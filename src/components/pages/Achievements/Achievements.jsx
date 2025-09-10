import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import "/src/styles/Achievements.css";
import trophy from "/src/assets/trophy.svg";

const Achievements = () => {
  const currentPageRef = useRef(1);

  const itemsRef = useRef([]);

  const observer = useRef();
  const lastItemRef = useRef([]);
  const isLoadingRef = useRef(false);

  const scrollRef = useRef();
  const [topSpacerHeight, setTopSpacerHeight] = useState(0);
  const [bottomSpacerHeight, setbottomSpacerHeight] = useState(0);

  const [visibleItems, setVisibleItems] = useState([...itemsRef.current]);
  const animationFrameId = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        virtualisation();
      });
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      virtualisation(); // Initial call
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [itemsRef.current]);

  const isLoadingVirtualise = useRef(false);

  function virtualisation() {
    const scrollTop = Math.floor(scrollRef.current.scrollTop);
    const visibleHeight = Math.floor(scrollRef.current.clientHeight);
    const visibleWidth = Math.floor(scrollRef.current.clientWidth);

    const itemHeight = 180; // Высота одного элемента (примерно)
    const itemsGap = 8;
    const itemsPerRow = Math.floor(visibleWidth / (itemHeight+itemsGap)); // Высота одного элемента (примерно)

    // if(!isLoadingVirtualise.current){
      isLoadingVirtualise.current=true;
    // Вычисляем индексы видимых элементов
    const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + itemsGap)) - 2);
    const visibleRowCount = Math.ceil(visibleHeight / (itemHeight + itemsGap)) + 4;

    const startIndex = Math.min(
      Math.max(0, startRow * itemsPerRow),
      Math.max(0, itemsRef.current.length - 1)
    );
    
    const endIndex = Math.min(
      startIndex + visibleRowCount * itemsPerRow,
      itemsRef.current.length
    );
    
    const totalHeight = Math.floor(scrollRef.current.scrollHeight);
    const bottomScroll = totalHeight - scrollTop - visibleHeight;
        
    // console.log(bottomScroll)
    // if (bottomScroll <= 100) {  // Increased from 5 to 100 for better UX
    //   requestAnimationFrame(() => {
    //     scrollRef.current.scrollTo({
    //       top: scrollRef.current.scrollHeight,
    //       behavior: 'auto'
    //     });
    //   });
    // }
    
       // Вычисляем отступы
     const topPadding = Math.max(0, startRow * (itemHeight + itemsGap));
    
     // Обновляем отступы и видимые элементы в одном состоянии
     setTopSpacerHeight(prevTop => {
       if (Math.abs(prevTop - topPadding) > 10 ) {
         return topPadding;
       }
       return prevTop;
     });

     if (startIndex !== endIndex) {
      setVisibleItems(itemsRef.current.slice(startIndex, endIndex));
    }

    const totalItems = itemsRef.current.length;
    const totalRows = Math.ceil(totalItems / itemsPerRow);
    setbottomSpacerHeight(Math.max(0, 
      totalRows * (itemHeight + itemsGap * 2) - 
      (topSpacerHeight + (endIndex - startIndex) / itemsPerRow * (itemHeight + itemsGap * 2)))
    );
    isLoadingVirtualise.current=false;
  // }
    // setMainContainerHeight(Math.floor(
    //   (endIndex - startIndex) / itemsPerRow * (itemHeight + itemsGap * 2)*1.2
    // ));
        
// console.log(startIndex,endIndex,scrollTop)

        // setVisibleItems((prev) => {
        //   //const amountItems = items.length;
        //   if (itemsRef.current.length === 0) return prev;
          
         
        //   setTopSpacerHeight((pre) => {
         
        //       isLoadingVirtualise.current = true;
        //     const newPadding = Math.max(0,Math.floor(((startIndex / itemsPerRow) * itemHeight) ));
        //     console.log(":::",startIndex,newPadding,scrollTop)
        //     // if(newPadding > scrollTop) return (scrollTop);
          
            
        //     // if(bottomScroll<itemHeight){
        //     //   startIndex-=itemsPerRow;
        //     //   endIndex +=itemsPerRow;
             
        //     //   return pre
        //     //  }
        //     // else
          
        //      if ( Math.abs(newPadding - pre) > 10 ) {
           
             
        //       return newPadding;
        //     }
        //     // return pre;
         
        //   return pre;
        //   });

        //   isLoadingVirtualise.current = false;
        //   return itemsRef.current.slice(startIndex, endIndex);
        // });
        

    
  }
  async function fetchData(page = 1, limit = 30) {
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
              <div className="item__name">
                {item.name} {item.id}
              </div>
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

    //  if(newData.length<0) currentPageRef.current -= 1;

    if (newData.length > 0) {
      currentPageRef.current += 1;
      console.log(
        "newData.length: ",
        newData[0].props.children[1].props.children[0].props.children
      );
    } else {
      currentPageRef.current += 1;
      for (let i = 0; i < 20; i++) {
        // Add 5 elements
        newData.push(
          <img
            key={uuidv4()}
            src={trophy}
            className="achievements-list__trophy "
          />
        );
      }
      // virtualisation();
    }
    return newData;
  }

  const loadMoreItems = () => {
    if (!isLoadingRef.current) {
      isLoadingRef.current = true;

      console.log("current: ", currentPageRef.current);
      

      fetchData(currentPageRef.current).then((newData) => {
        // Update the ref with new data
        const isFirstLoad = itemsRef.current.length === 0;
        itemsRef.current = [...itemsRef.current, ...newData];

        // Update visible items for the first load
        if (isFirstLoad) {
          setVisibleItems(itemsRef.current);
        }

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
    }
  };

  const handleObserver = (entries) => {
    const lastEntry = entries[0];

    // console.log("observer target: ", lastEntry.target);

    if (lastEntry.isIntersecting) {
      loadMoreItems();
      // virtualisation();
    }
  };
  const setLastItemRef = (node) => {
    // console.log(node);
    // if (node) {
    if (node && !lastItemRef.current.includes(node)) {
      lastItemRef.current.push(node);

      // console.log("node: ", node);
      let last = lastItemRef.current.length - 1;
      // console.log("последний: ", last);

      lastItemRef.current[last].style.border = "5px solid red";
      if (observer.current) observer.current.observe(lastItemRef.current[last]);
    }

    if (
      lastItemRef.current.length - 2 >= 0 &&
      lastItemRef.current[lastItemRef.current.length - 2]
    ) {
      lastItemRef.current[lastItemRef.current.length - 2].style.border =
        "5px solid black";
      if (observer.current) {
        observer.current.unobserve(
          lastItemRef.current[lastItemRef.current.length - 2]
        );
        lastItemRef.current[0].style.border = "5px solid purple";
        lastItemRef.current.shift();
      }
    }
    //else console.log("NODE == 0   ----> ", node);
  };
  useEffect(() => {
    // console.log("++++++++++++++++++запущен обсервер");
    observer.current = new IntersectionObserver(handleObserver);
    if (itemsRef.current.length === 0) {
      loadMoreItems(); // Загружаем только если данных еще нет
      // setLastItemRef(null); // Инициализируем lastItemRef
    }

    if (lastItemRef.current[0]) {
      console.log("lastItemRef.current[0]: ", lastItemRef.current[0]);

      observer.current.observe(lastItemRef.current[0]);
    }
    // scrollRef.current.addEventListener("scroll", virtualisation);
    return () => {
      // if (scrollRef.current)
      // scrollRef.current.removeEventListener("scroll", virtualisation);
      if (lastItemRef.current[0] && observer.current) {
        observer.current.unobserve(lastItemRef.current[0]);
      }
      observer.current.disconnect();
      // console.log("--------------------дисконект обсервер");
    };
  }, []); //lastItemRef.current
  return (
    <div className="achievments" ref={scrollRef}>
      <div style={{ height: `${topSpacerHeight}px`,
          width: '100%',
          pointerEvents: 'none' }}></div>
      <div className="achievements-list" >
        {visibleItems.map((item, index) => {
          return (
            <div
              className="achievements-list__elements"
              key={index}
              ref={
                 index  === visibleItems.length - 1 ? setLastItemRef : null
              }
            >
              {item}
            </div>
          );
        })}
      
        {/* <span ref={setLastItemRef} style={{marginTop:`112rem`,position:`absolute`}}></span> */}
      </div>
      {/* {bottomSpacerHeight > 0 && (
        <div  style={{ 
          height: `${bottomSpacerHeight}px`,
          width: '100%',
          pointerEvents: 'none'
        }} />
      )} */}
    </div>
  );
};

export default Achievements;
