import { Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

function App() {
  return (
    <div className="font-['Open_Sans'] min-h-screen bg-[#F8F9FA]">
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
