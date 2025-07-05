import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const imageBaseUrl = import.meta.env.VITE_API_URL;
import api from '../api';

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/api/generated/static-full/${id}`);
      setRecipe(res.data.data);
    } catch (err) {
      console.error('❌ Error fetching full recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchRecipe();
}, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-rose-600 border-solid"></div>
      </div>
    );
  }

  if (!recipe) {
    return <div className="p-6 text-center text-red-500">❌ Recipe not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <button
        onClick={() => navigate('/recipes')}
        className="text-rose-600 underline text-sm mb-4"
      >
        ← Back to Recipes
      </button>

      <h1 className="text-3xl font-bold text-rose-700 mb-5 mt-5 text-center">{recipe.title}</h1>

      <div className="flex justify-center items-center w-full max-h-[300px] bg-white mb-4">
        <img
  src={`${imageBaseUrl}${recipe.imageUrl}`}
  alt={recipe.title}
/>

      </div>

      <p className="text-gray-700 mb-4">{recipe.description}</p>

      <div className="mt-6 text-sm text-gray-600">
        {recipe.cookTime && <p><strong>⏱️ Cook Time:</strong> {recipe.cookTime}</p>}
        {recipe.servingSize && <p><strong>🍽 Serving:</strong> {recipe.servingSize}</p>}
      </div>

      <h2 className="text-xl font-semibold text-rose-600 mt-6">🧂 Ingredients</h2>
      <ul className="list-disc list-inside text-gray-700">
        {recipe.ingredients?.map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      <h2 className="text-xl font-semibold text-rose-600 mt-6">👩‍🍳 Steps</h2>
      <ol className="list-decimal list-inside text-gray-700">
        {recipe.steps?.map((step, i) => <li key={i}>{step}</li>)}
      </ol>

      {recipe.healthInfo && (
        <div className="mt-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold text-rose-600 mb-2">⚕️ Health Info</h4>
            <p>Calories: {recipe.healthInfo.calories}</p>
            <p>Protein: {recipe.healthInfo.protein}</p>
            <p>Fat: {recipe.healthInfo.fat}</p>
            <p>Carbs: {recipe.healthInfo.carbs}</p>
            <p>Tags: {recipe.healthInfo.dietary?.join(', ')}</p>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate('/recipe')}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full shadow-md transition duration-300"
            >
              ⬅️ Back to Recipes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;






