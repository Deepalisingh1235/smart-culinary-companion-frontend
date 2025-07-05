import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineSave,
  AiFillSave,
  AiOutlineClose,
} from 'react-icons/ai';

const MealPlanResult = ({
  plans = [],
  nutritionTips = [],
  liked = false,
  saved = false,
  
  planId, 
  onClose,
  onLike,
  onSave,
}) => {

  
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleLikeClick = async () => {
    setLikeLoading(true);
    await onLike();
    setLikeLoading(false);
  };

  const handleSaveClick = async () => {
    setSaveLoading(true);
    await onSave();
    setSaveLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 space-y-6 border border-pink-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-pink-600">
          🥗 Your Smart Meal Plan & Tips
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 text-xl"
          aria-label="Close"
        >
          <AiOutlineClose />
        </button>
      </div>

      {plans.length > 0 ? (
        plans.map((day, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-pink-500">{day.day}</h3>
            <ul className="text-gray-700 mt-2 space-y-1">
              <li><strong>Breakfast:</strong> {day.breakfast}</li>
              <li><strong>Lunch:</strong> {day.lunch}</li>
              <li><strong>Dinner:</strong> {day.dinner}</li>
              <li><strong>Snacks:</strong> {day.snacks}</li>
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No meal plan available.</p>
      )}

      {nutritionTips.length > 0 && (
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            💡 Personalized Nutrition Tips
          </h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            {nutritionTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={handleLikeClick}
          disabled={likeLoading}
          className={`flex items-center gap-2 border px-4 py-2 rounded-md font-semibold transition ${
            liked ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-gray-300'
          } hover:bg-pink-50`}
        >
          {liked ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
          {likeLoading ? 'Liking...' : liked ? 'Liked' : 'Like'}
        </button>

        <button
          onClick={handleSaveClick}
          disabled={saveLoading}
          className={`flex items-center gap-2 border px-4 py-2 rounded-md font-semibold transition ${
            saved ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-gray-300'
          } hover:bg-pink-50`}
        >
          {saved ? <AiFillSave className="text-xl" /> : <AiOutlineSave className="text-xl" />}
          {saveLoading ? 'Saving...' : saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </motion.div>
  );
};

export default MealPlanResult;
