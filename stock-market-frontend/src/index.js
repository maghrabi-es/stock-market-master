import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePortfolioPage from './pages/CreatePortfolioPage';
import PortfolioPage from './pages/PortfolioPage';
import CreateStockPage from './pages/CreateStockPage';
import ViewStockPage from './pages/ViewStockPage';
import AddTransactionPage from './pages/AddTransactionPage';
import AddWatchListPage from './pages/AddWatchListPage';
import ViewWatchList from './pages/ViewWatchList';
import Reports from "./pages/Reports";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/createPortfolio" component={CreatePortfolioPage} exact />
        <Route path="/portfolio/:id" component={PortfolioPage} exact />
        <Route path="/portfolio/:id/addStock" component={CreateStockPage} exact />
        <Route path="/stocks/:id" component={ViewStockPage} exact />
        <Route path="/stocks/:id/addTransaction" component={AddTransactionPage} exact />
        <Route path="/portfolio/:id/addWatchList" component={AddWatchListPage} exact />
        <Route path="/watchList/:id" component={ViewWatchList} exact />
        <Route path="/reports" component={Reports} exact />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
