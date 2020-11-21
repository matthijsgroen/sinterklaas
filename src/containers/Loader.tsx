import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loading from "src/components/Loading";
import { Doll } from "src/content/dolls";
import loader, { DollQueueItem } from "src/state/loader";
import { RootState } from "src/state/store";
import styles from "./Loader.module.scss";

type LoaderProps = {
  isLoading: boolean;
  dollPoses: DollQueueItem[];
  imageLoadingDone: () => void;
};

const Loader: React.FC<LoaderProps> = ({
  isLoading,
  dollPoses,
  imageLoadingDone,
}) => {
  const [queue, updateQueue] = useState(dollPoses);
  useEffect(() => {
    updateQueue(dollPoses);
  }, [dollPoses]);

  const [head, ...tail] = queue;

  useEffect(() => {
    head
      ? window.requestAnimationFrame(() => {
          updateQueue(tail);
        })
      : imageLoadingDone();
  }, [head, imageLoadingDone, updateQueue, tail]);

  return (
    <>
      {head && (
        <div className={styles.hidden}>
          <Doll doll={head.doll} settings={head.settings} />
        </div>
      )}
      {isLoading && <Loading />}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isLoading: state.loader.isLoading,
  dollPoses: state.loader.dollPreloading,
});

const mapDispatchToProps = {
  imageLoadingDone: loader.actions.imageLoadingDone,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
