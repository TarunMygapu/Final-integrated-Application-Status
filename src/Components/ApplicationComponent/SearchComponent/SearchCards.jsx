import React from "react";
import styles from "./SearchCards.module.css";
import DivisionDesign from "../../../Asserts/ApplicationStatus/DivisionDesign.svg";
import Statusbar from "../../../Widgets/StatusBar/Statusbar";
 
const SearchCards = ({ data, maxResults = 5, onCardClick }) => {
  const displayData = (data || []).filter(
    (item) => item.displayStatus && item.displayStatus !== "Damaged"
  );
  const filteredData = displayData.slice(0, maxResults);
  // Filter out "Damaged" status and limit to maxResults
  console.log("SearchCards Data:", filteredData); // Debugging
  return (
    <div className={styles.Search_Cards_recent_search}>
      <h3 className={styles.Search_Cards_recent_search__title}>Search Result</h3>
      <div className={styles.Search_Cards_recent_search__cards}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id || item.applicationNo} // Use applicationNo as fallback
              className={styles.Search_Cards_recent_search__card}
              onClick={() => onCardClick && onCardClick(item)}
            >
              <figure className={styles.Search_Cards_recent_search__image}></figure>
              <p className={styles.Search_Cards_recent_search__id}>
                {item.applicationNo}
              </p>
              <p className={styles.Search_Cards_recent_search__Campus}>
                {item.campus}
              </p>
              <p className={styles.Search_Cards_recent_search__Zone}>
                {item.zone}
              </p>
              <figure className={styles.Search_Cards_recent_search__division}>
                <img src={DivisionDesign} alt="Division Design Icon" />
              </figure>
              <div className={styles.Search_Cards_recent_search__status}>
                <Statusbar
                  isSold={item.displayStatus === "Sold" || item.displayStatus === "Confirmed"}
                  isConfirmed={item.displayStatus === "Confirmed"}
                />
              </div>
            </div>
          ))
        ) : (
          <p className={styles.Search_Cards_recent_search__no_results}>
            No results found
          </p>
        )}
      </div>
    </div>
  );
};
 
export default SearchCards;