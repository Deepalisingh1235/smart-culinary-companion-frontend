import React, { useEffect, useState } from 'react';
import RecipeModal from './RecipeModal';
import api from '../api';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

 
  const fetchSavedRecipes = async () => {
  try {
    const res = await api.get('/api/recipes/saved'); 
    const data = res.data;
    if (!data.success) throw new Error(data.message);
    setRecipes(data.recipes || []);
  } catch (err) {
    console.error('❌ Saved recipes fetch error:', err);
    setError('Failed to load saved recipes.');
  }
};


  
  const fetchSavedMealPlans = async () => {
  try {
    const res = await api.get('/api/mealplanner/saved');
    const data = res.data;
    if (!data.success) throw new Error(data.message);
    setMealPlans(data.meals || []);
  } catch (err) {
    console.error('❌ Saved meal plans fetch error:', err);
    setError('Failed to load saved meal plans.');
  }
};


  const handleDeleteRecipe = async (id) => {
  try {
    const res = await api.delete(`/api/recipes/delete/${id}`);
    const data = res.data;
    if (data.success) {
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } else {
      alert(data.message || 'Failed to delete recipe.');
    }
  } catch (err) {
    console.error('❌ Recipe delete error:', err);
  }
};


  const handleDeleteMealPlan = async (id) => {
  try {
    const res = await api.delete(`/api/mealplanner/delete/${id}`);
    const data = res.data;
    if (data.success) {
      setMealPlans((prev) => prev.filter((m) => m._id !== id));
    } else {
      alert(data.message || 'Failed to delete meal plan.');
    }
  } catch (err) {
    console.error('❌ Meal plan delete error:', err);
  }
};


  
 const handleLikeMealPlan = async (id) => {
  try {
    const res = await api.post('/api/mealplanner/like', { id });
    const data = res.data;
    if (data.success) {
      setSelectedMealPlan((prev) => ({ ...prev, liked: data.liked }));
    } else {
      alert(data.message || 'Failed to like meal plan.');
    }
  } catch (err) {
    console.error('❌ Like error:', err);
  }
};

  const handleSaveMealPlan = async (id) => {
  try {
    const res = await api.post('/api/mealplanner/save', { id });
    const data = res.data;
    if (data.success) {
      setSelectedMealPlan((prev) => ({ ...prev, saved: !prev.saved }));
    } else {
      alert(data.message || 'Failed to save meal plan.');
    }
  } catch (err) {
    console.error('❌ Save error:', err);
  }
};


  useEffect(() => {
    if (!token) {
      setError('🔐 Please login first.');
      setTimeout(() => (window.location.href = '/login'), 1500);
      return;
    }
    fetchSavedRecipes();
    fetchSavedMealPlans();
  }, []);

  return (
    <div className="min-h-screen bg-rose-50 py-20 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-black-600">Your Saved Recipes & Meal Plans</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

    
      <section>
        <h2 className="text-2xl font-semibold text-center  mb-4 text-rose-700">Saved Recipes</h2>
        {recipes.length === 0 && <p className="text-gray-600 mb-6">You haven't saved any recipes yet.</p>}

        <div className="grid gap-4 max-w-3xl mx-auto mb-10">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition relative">
              <button
                onClick={() => handleDeleteRecipe(recipe._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                ❌
              </button>
              <div onClick={() => setSelectedRecipe(recipe)} className="cursor-pointer">
                <h3 className="text-lg font-semibold text-rose-600">{recipe.title}</h3>
                <p className="text-gray-700 mt-1 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

     
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-center  text-rose-700">Saved Meal Plans</h2>
        {mealPlans.length === 0 && <p className="text-gray-600">You haven't saved any meal plans yet.</p>}

        <div className="max-w-3xl mx-auto space-y-6">
          {mealPlans.map((plan) => (
            <div key={plan._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition relative">
              <button
                onClick={() => handleDeleteMealPlan(plan._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                ❌
              </button>
              <div onClick={() => setSelectedMealPlan(plan)} className="cursor-pointer">
                <h3 className="text-lg font-semibold text-rose-600 mb-1">{plan.goal}</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Duration: {plan.duration} days | Start: {new Date(plan.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm italic">Click to view daily meal plan details.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

     
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          image={selectedRecipe.imageUrl}
          isLiked={false}
          isSaved={true}
          onClose={() => setSelectedRecipe(null)}
          onLike={() => {}}
          onSave={() => {}}
          onShare={() => {}}
        />
      )}

      
      {selectedMealPlan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start p-4 z-50 overflow-auto"
          onClick={() => setSelectedMealPlan(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMealPlan(null)}
              className="absolute top-4 right-4 text-2xl text-rose-600 hover:text-rose-800"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-4 text-rose-700">{selectedMealPlan.goal}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Duration: <span className="font-semibold">{selectedMealPlan.duration} days</span> | Start Date:{' '}
              <span className="font-semibold">{new Date(selectedMealPlan.startDate).toLocaleDateString()}</span>
            </p>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {selectedMealPlan.plan.map((day, idx) => (
                <div key={idx} className="bg-rose-50 rounded-lg border border-rose-200 p-4 shadow">
                  <h3 className="text-xl font-semibold text-rose-600 mb-2">{day.day}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium text-gray-700">Breakfast:</span> {day.breakfast}</div>
                    <div><span className="font-medium text-gray-700">Lunch:</span> {day.lunch}</div>
                    <div><span className="font-medium text-gray-700">Dinner:</span> {day.dinner}</div>
                    <div><span className="font-medium text-gray-700">Snacks:</span> {day.snacks}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedMealPlan.nutritionTips?.length > 0 && (
              <div className="mt-6 bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                <h3 className="text-lg font-bold text-orange-700 mb-2">💡 Nutrition Tips</h3>
                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                  {selectedMealPlan.nutritionTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handleLikeMealPlan(selectedMealPlan._id)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md font-semibold ${
                  selectedMealPlan.liked ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-gray-300'
                } hover:bg-pink-50`}
              >
                ❤️ {selectedMealPlan.liked ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={() => handleSaveMealPlan(selectedMealPlan._id)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md font-semibold ${
                  selectedMealPlan.saved ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-gray-300'
                } hover:bg-pink-50`}
              >
                💾 {selectedMealPlan.saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;

