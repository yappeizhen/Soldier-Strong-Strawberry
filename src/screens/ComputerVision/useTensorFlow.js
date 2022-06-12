import React from "react";

import * as tf from "@tensorflow/tfjs";

export function useTensorFlowModel(modelKind) {
  const [model, setModel] = React.useState(null);

  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  React.useEffect(() => {
    tf.setBackend('rn-webgl').then(() => {
      modelKind.load().then((model) => {
        console.error(model);
        if (isMounted.current) {
          setModel(model);
        }
      })
    }).catch(err => console.log(err.message));
  }, [modelKind]);

  return model;
}

export function useTensorFlowLoaded() {
  const [isLoaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    tf.ready().then(() => {
      if (isMounted) {
        setLoaded(true);
      }
    });
    return () => (isMounted = false);
  }, []);

  return isLoaded;
}
