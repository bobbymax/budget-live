import React from "react";
import "./custom-card.css";

const CustomCard = ({ color = "white", count = 0, title = "", path = "" }) => {
  return (
    <div>
      <div className={`card budget-card`}>
        <div className="card-body">
          <div className="media align-items-center">
            <div className="media-body mr-3">
              <h2 className="fs-36 text-white font-w600">{count}</h2>
              <p className="fs-18 mb-0 text-white font-w500">{title}</p>
            </div>

            {/* <div className="d-inline-block position-relative donut-chart-sale">
              <span
                className="donut1"
                data-peity='{ "fill": ["rgb(60, 76, 184)", "rgba(236, 236, 236, 1)"],   "innerRadius": 38, "radius": 10}'
                style={{ display: "none" }}
              >
                5/8
              </span>
              <svg className="peity" height="90" width="90">
                <path
                  d="M 45 0 A 45 45 0 1 1 13.180194846605364 76.81980515339464 L 18.129942314911197 71.87005768508881 A 38 38 0 1 0 45 7"
                  data-value="5"
                  fill="rgb(60, 76, 184)"
                ></path>

                <path
                  d="M 13.180194846605364 76.81980515339464 A 45 45 0 0 1 44.99999999999999 0 L 44.99999999999999 7 A 38 38 0 0 0 18.129942314911197 71.87005768508881"
                  data-value="3"
                  fill="rgba(236, 236, 236, 1)"
                ></path>
              </svg>
              <small className="text-primary">71%</small>
              <span className="circle bgl-primary"></span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
