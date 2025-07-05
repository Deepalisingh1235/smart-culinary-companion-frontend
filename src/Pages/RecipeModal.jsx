import React from 'react';
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

import { createPortal } from 'react-dom';

const RecipeModal = ({
  recipe,
  image,
  onClose,
  isLiked,
  isSaved,
  onLike,
  onSave,
  
  actionLoading, 
}) => {
  if (!recipe) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 text-xl"
        >
          <AiOutlineClose />
        </button>

        <h3 className="text-2xl font-bold text-rose-700 mb-2">✨ {recipe.title}</h3>

        {image && (
          <img
            src={image}
            alt="Recipe"
            className="rounded-lg max-w-md w-full h-64 mx-auto object-cover mb-4 shadow"
          />
        )}

        <p className="text-sm text-gray-700 mb-4">{recipe.description}</p>

        
        <div className="flex items-center justify-center gap-6 bg-rose-50 border border-rose-200 rounded-lg px-6 py-4 text-sm text-gray-700 shadow mb-4">
          <p>⏱ <b className="text-rose-500">Cook Time:</b> {recipe.cookTime}</p>
          <p>🍽 <b className="text-rose-500">Serving Size:</b> {recipe.servingSize}</p>
        

        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-rose-600">🧠 Additional Info:</h4>
          <p className="text-sm text-gray-700">{recipe.additionalInfo}</p>
        </div>

        <h4 className="mt-4 font-semibold text-rose-600">🥕 Ingredients:</h4>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          {recipe.ingredients?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h4 className="mt-4 font-semibold text-rose-600">👨‍🍳 Steps:</h4>
        <ol className="list-decimal ml-6 text-sm text-gray-700">
          {recipe.steps?.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        {recipe.healthInfo && (
          <div className="flex justify-center">
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-300 max-w-sm text-left">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">⚕️ Health Info</h4>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <div><span className="font-medium">Calories:</span> {recipe.healthInfo.calories}</div>
                <div><span className="font-medium">Protein:</span> {recipe.healthInfo.protein}</div>
                <div><span className="font-medium">Fat:</span> {recipe.healthInfo.fat}</div>
                <div><span className="font-medium">Carbs:</span> {recipe.healthInfo.carbs}</div>
              </div>
            </div>
          </div>
        )}

        {recipe.healthInfo?.dietary?.length > 0 && (
          <div className="mt-3">
            <h4 className="font-semibold text-rose-600 mb-1">🌱 Dietary Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.healthInfo.dietary.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {recipe.chefTip && (
          <div className="mt-4">
            <h4 className="font-semibold text-rose-600">👨‍🍳 Chef’s Tip:</h4>
            <p className="text-sm text-gray-700">{recipe.chefTip}</p>
          </div>
        )}

        {recipe.servingTip && (
          <div className="mt-4">
            <h4 className="font-semibold text-rose-600">🍽️ Serving Tip:</h4>
            <p className="text-sm text-gray-700">{recipe.servingTip}</p>
          </div>
        )}

        
        <div className="flex justify-end gap-4 mt-6">
         <button
  onClick={onLike}
  disabled={actionLoading}
  className={`px-4 py-2 rounded-full flex items-center gap-2 ${isLiked ? 'bg-pink-500 text-white' : 'bg-gray-300 text-black'}`}
>
  {isLiked ? '💖 Liked' : '🤍 Like'}
</button>

         
<button
  onClick={onSave}
  disabled={actionLoading}
  className={`px-4 py-2 rounded-full ${
    isSaved ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
  }`}
>
  {isSaved ? '💾 Saved' : '📥 Save'}
</button>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default RecipeModal; 
          
          

       

