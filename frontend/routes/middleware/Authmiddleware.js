import React, { lazy, Suspense } from 'react';
// import { Spin } from 'antd';
import { Switch, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('../../pages/index'));


const Authmiddleware = () => {
  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            {/* <Spin /> */}
          </div>
        }
      >
        <Route exact  path="/" component={Dashboard} />
        {/* <Route exact path="*" component={NotFound} /> */}
      </Suspense>
    </Switch>
  );
};

export default Authmiddleware;