import React from "react";
import styles from "./card.module.css";

const Card = ({ item }) => {
  return (
    <div className={styles.container}>
      {item.img && (
        <div className={styles.imageContainer}>
          <img src={item.img} alt="" className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          {item.createdAt && (
            <span className={styles.date}>
              {item.createdAt.substring(0, 10)} -{" "}
            </span>
          )}
          {item.catSlug && (
            <span className={styles.category}>{item.catSlug}</span>
          )}
        </div>
        {item.title && (
          <div>
            <a href={`/posts/${item.slug}`}>
              <h1>{item.title}</h1>
            </a>
          </div>
        )}
        {item.desc && (
          <div
            className={styles.desc}
            dangerouslySetInnerHTML={{ __html: item?.desc?.substring(0, 60) }}
          />
        )}
        {item.title && (
          <a href={`/posts/${item.slug}`} className={styles.link}>
            Read More
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
