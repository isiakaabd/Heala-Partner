import React, { useEffect } from "react";

import { useLocation } from "react-router-dom";

const ScrollToView = (props) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return <main>{props.children}</main>;
};

export default ScrollToView;
