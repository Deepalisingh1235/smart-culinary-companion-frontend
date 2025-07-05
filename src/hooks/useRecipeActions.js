import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/Auth';
import toast from 'react-hot-toast';

const useRecipeActions = () => {
  const navigate = useNavigate();

  const saveRecipe = async (recipeId) => {
    if (!isLoggedIn()) {
      toast.error('Please login to save recipes');
      return navigate('/login');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/recipes/save',
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Recipe saved!');
      
      if (!window.location.pathname.includes('savedrecipes')) {
        navigate('/savedrecipes');
      }
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error saving recipe');
    }
  };

  const likeRecipe = async (recipeId) => {
    if (!isLoggedIn()) {
      toast.error('Please login to like recipes');
      return navigate('/login');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/recipes/like',
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Liked!');
    } catch (err) {
      console.error('Like error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error liking recipe');
    }
  };

  const shareRecipe = (recipeId) => {
    const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
    try {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return { saveRecipe, likeRecipe, shareRecipe };
};

export default useRecipeActions;
