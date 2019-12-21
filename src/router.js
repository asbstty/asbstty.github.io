import { Switch, Route } from 'react-router-dom';
import React from 'react';
import Home from '@/pages/home';
import Snake from '@/pages/snake';
import Els from '@/pages/els';

export default function() {
  return(
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route path="/snake" component={Snake}></Route>
      <Route path="/els" component={Els}></Route>
    </Switch>
  )
}