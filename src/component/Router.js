import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../route/Home";
import List from "../route/List";
import Profile from "../route/Profile";
import Navigation from "./Navigation";

const AppRouter=()=>{
    return(
        <Router>
            <Navigation />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
            <Switch>
                <Route exact path="/profile">
                    <Profile />
                </Route>
            </Switch>
            <Switch>
                <Route exact path="/list">
                    <List />
                </Route>
            </Switch>

        </Router>
    );
}
export default AppRouter;