/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ModuleCard from "../../components/commons/widgets/ModuleCard";
import { canAccessModule } from "../../services/utils/access";

const Module = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const location = useLocation();
  const { module } = location.state;

  const [accessible, setAccessible] = useState([]);

  useEffect(() => {
    if (auth !== null && module && module.children.length > 0) {
      if (auth.administrator) {
        setAccessible(module.children);
      } else {
        const newModules = module.children.filter(
          (child) => canAccessModule(child, auth) && child
        );

        setAccessible(newModules);

        // setAccessible(
        //   module.children.map((mod) => {
        //     if (canAccessModule(mod, auth)) {
        //       return mod;
        //     }

        //     return null;
        //   })
        // );
      }
    }
  }, [auth, module]);

  // console.log(accessible);

  return (
    <>
      <div className="row">
        {accessible.length > 0 &&
          accessible.map((child) => (
            <div className="col-md-3" key={child.id}>
              <ModuleCard
                name={child.name}
                path={child.path}
                icon={child.icon}
                children={child.children}
                entity={child}
                color="warning"
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default Module;
