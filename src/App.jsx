import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Home from './Pages/Home';
import Create from './Pages/Create';
import Recipe from './Pages/Recipe';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import SmartKitchen from './Pages/Smartkitchen';
import SavedRecipe from './Pages/SavedRecipe';
import RecipePage from './Pages/RecipePage';
import MealPlanPage from './pages/MealPlanPage';

import './index.css';

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/savedrecipe" element={<SavedRecipe />} />
        <Route path="/smartkitchen" element={<SmartKitchen />} />
        <Route path="/recipe" element={<Recipe />} />
<Route path="/recipe/:id" element={<RecipePage />} />
       <Route path="/meal-result" element={<MealPlanPage />} />
        
        
      </Routes>
    </>
  );
};

export default App;






