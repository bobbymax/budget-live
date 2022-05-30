import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../assets/animations/loader-one.json";

const Loading = () => {
  return (
    <>
      <style jsx="true">
        {`
          .container {
            max-width: 100%;
            width: 100%;
            height: 100vh;
            background-color: rgb(0, 0, 0, 0.2);
            position: fixed;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>

      <div className="container">
        <Lottie
          animationData={loaderAnimation}
          style={{
            width: 500,
          }}
          loop
          autoplay
        />
      </div>
    </>
  );
};

export default Loading;
