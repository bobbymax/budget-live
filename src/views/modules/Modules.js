/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModuleCard from "../../components/commons/widgets/ModuleCard";
import { collection } from "../../services/utils/controllers";
import { canAccessModule } from "../../services/utils/access";
import Loading from "../../components/commons/Loading";
import "./dashboard.css";

const Modules = () => {
  const auth = useSelector((state) => state.auth.value.user);

  const [modules, setModules] = useState([]);
  const [accessible, setAccessible] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNav = (data) => {
    //
  };

  useEffect(() => {
    collection("modules")
      .then((res) => {
        const data = res.data.data;
        setModules(data);
        setLoading(false);
      })
      .catch((err) => console.log(err.message));
  }, []);

  // console.log(modules);

  useEffect(() => {
    if (auth !== null && modules.length > 0) {
      if (auth.administrator) {
        setAccessible(modules);
      } else {
        setAccessible(modules.map((mod) => canAccessModule(mod, auth) && mod));
      }
    }
  }, [auth, modules]);

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        {accessible.map(
          (module) =>
            module.type === "application" && (
              <div className="col-md-3" key={module.id}>
                <ModuleCard
                  name={module.name}
                  path={`/applications${module.path}`}
                  icon={module.icon}
                  children={module.children}
                  entity={module}
                  handleNav={handleNav}
                />
              </div>
            )
        )}
      </div>
    </>
  );
};

export default Modules;
