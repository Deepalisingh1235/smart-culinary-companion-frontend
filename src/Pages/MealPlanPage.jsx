import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MealPlanResult from '../components/MealPlanResult';
import api from '../api'; // ✅ Axios instance with token support

const MealPlanResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    plans = [],
    nutritionTips = [],
    liked: initialLiked = false,
    saved: initialSaved = false,
    planId,
  } = location.state || {};

  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center mt-10 text-red-500">
        No meal plan data found. Please generate one first.
      </div>
    );
  }

  const handleLike = async () => {
    if (!planId) return alert('Plan ID missing. Cannot like.');
    try {
      const res = await api.post('/api/mealplanner/like', { id: planId });
      if (res.data.success) {
        setLiked(res.data.liked);
      } else {
        alert(res.data.message || 'Failed to like meal plan.');
      }
    } catch (err) {
      console.error('❌ Like error:', err);
      alert('Error while liking the meal plan.');
    }
  };

  const handleSave = async () => {
    if (!planId) return alert('Plan ID missing. Cannot save.');
    try {
      const res = await api.post('/api/mealplanner/save', { id: planId });
      if (res.data.success) {
        setSaved((prev) => !prev);
      } else {
        alert(res.data.message || 'Failed to save meal plan.');
      }
    } catch (err) {
      console.error('❌ Save error:', err);
      alert('Error while saving the meal plan.');
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <MealPlanResult
        plans={plans}
        nutritionTips={nutritionTips}
        liked={liked}
        saved={saved}
        planId={planId}
        onClose={() => navigate(-1)}
        onLike={handleLike}
        onSave={handleSave}
      />
    </div>
  );
};

export default MealPlanResultPage;
