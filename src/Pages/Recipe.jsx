import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

import api from '../api'; 
const imageBaseUrl = import.meta.env.VITE_API_URL;

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/generated/all')
      .then(res => setRecipes(res.data.data || []))
      .catch(err => console.error('❌ Error fetching recipes:', err));
  }, []);

  const handleLike = async (id) => {
    const isLiked = liked[id];
    try {
      const res = await api.patch(`/api/generated/${id}/toggle-like`, {
        action: isLiked ? 'unlike' : 'like',
      });
      setRecipes(prev =>
        prev.map(r => r._id === id ? { ...r, likes: res.data.likes } : r)
      );
      setLiked(prev => ({ ...prev, [id]: !isLiked }));
    } catch (err) {
      console.error('❌ Like toggle failed:', err.message);
    }
  };

  const handleSave = (id) => {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  

  return (
    <div className="px-6 py-20">
      <h2 className="text-3xl font-bold text-rose-700 mb-6 text-center"> Explore Healthy Recipes</h2>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
            <div onClick={() => navigate(`/recipe/${recipe._id}`)} className="cursor-pointer">
              <img
                src={`${imageBaseUrl}${recipe.imageUrl}`}
                alt={recipe.title}
                className="w-full h-60 object-cover rounded-lg mb-3"
              />
              <h3 className="text-xl font-bold text-rose-600">{recipe.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{recipe.description}</p>
            </div>

            <div className="mt-3 flex items-center gap-4 px-2">
              <button
                onClick={() => handleLike(recipe._id)}
                className="text-xl flex items-center gap-1 text-rose-500"
              >
                {liked[recipe._id] ? <AiFillHeart /> : <AiOutlineHeart />}
                <span>{recipe.likes || 0}</span>
              </button>

              <button
                onClick={() => handleSave(recipe._id)}
                className="text-xl text-gray-600 hover:text-rose-600"
              >
                {saved[recipe._id] ? <BsBookmarkFill /> : <BsBookmark />}
              </button>

             
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;


