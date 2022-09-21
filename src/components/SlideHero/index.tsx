import { CSSProperties } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./SlideHero.module.scss";
function SlideHero(props: { title: string; img?: string; loading?: boolean }) {
  return props.loading ? (
    <Skeleton
      className={styles.container}
      style={{
        height: "680px !important",
        width: "100%",
      }}
    />
  ) : (
    <div
      className={styles.container}
      style={{ "--img": `url(${props.img})` } as CSSProperties}
    >
      <span className={styles.filler}></span>
      <h1 className={styles.text}>{props.title}</h1>
    </div>
  );
}

export default SlideHero;
