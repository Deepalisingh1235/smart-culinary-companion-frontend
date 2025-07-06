import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CreatableSelect from 'react-select/creatable';
import { BsThreeDots } from 'react-icons/bs';
import RecipeModal from './RecipeModal';
import api from '../api'; 

const suggestions = [
  'Tomato',
  'Potato',
  'Onion',
  'Garlic',
  'Chicken',
  'Paneer',
  'Spinach',
  'Rice',
  'Noodles',
  'Paneer Butter Masala',
  'Biryani',
  'Pasta',
  'Salad',
  'Chili',
  'Mushroom',
  'Carrot',
  'Beef',
  'Fish',
  'Egg',
  'Cheese',
  'Cucumber',
  'Broccoli',
  'Cauliflower',
  'Bell Pepper',
  'Tofu',
  'Lentils',
  'Yogurt',
  'Cilantro',
  'Ginger',
  'Basil',
];


const RecipesSearchSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [query, setQuery] = useState('');
  const [cookTime, setCookTime] = useState(null);
  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [servingSize, setServingSize] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeTitles, setRecipeTitles] = useState([]);
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [cuisine, setCuisine] = useState('');
  const [nutritionPref, setNutritionPref] = useState([]);
 const [showSuggestions, setShowSuggestions] = useState(false);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkToken = async () => {
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const res = await api.get('/auth/verify');
        const data = res.data;
        if (!res.status === 200 || !data.success) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          showToast('Session expired. Please log in again.');
        } else {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Token check error:', err);
        setIsLoggedIn(false);
        showToast('Token check failed');
      }
    };

    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const redirectToLogin = () => {
    showToast('🔐 Please login to continue.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  const clearFilters = () => {
    setCookTime(null);
    setDiet('');
    setAllergies([]);
    setServingSize('');
    setAdditionalNotes('');
    setCuisine('');
    setNutritionPref([]);
    showToast('Filters cleared ✅');
  };

  const handleSaveRecipe = async () => {
    if (!isLoggedIn) return redirectToLogin();
    const recipeId = selectedRecipe?._id;
    if (!recipeId) return showToast('Recipe ID missing!');
    setActionLoading(true);
    try {
      const res = await api.post('/api/recipes/toggle-save', { recipeId });
      const data = res.data;
      if (!data.success) throw new Error(data.message);
      setIsSaved((prev) => !prev);
      showToast(data.message);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save/unsave recipe');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLikeRecipe = async () => {
    if (!isLoggedIn) return redirectToLogin();
    const recipeId = selectedRecipe?._id;
    if (!recipeId) return showToast('❌ Recipe ID missing!');
    setActionLoading(true);
    try {
      const res = await api.post('/api/recipes/toggle-like', { recipeId });
      const data = res.data;
      if (!data.success) throw new Error(data.message);
      setIsLiked(data.liked);
      showToast(data.liked ? 'Liked ❤️' : 'Like removed 💔');
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle like');
    } finally {
      setActionLoading(false);
    }
  };

  

  const handleSmartSearch = async () => {
    if (!query.trim()) return;
    setShowForm(false);
    setLoading(true);
    setSelectedRecipe(null);
    setError('');
    setImage('');
     try {
    const res = await api.post('/api/recipes/smart', {
      step: 'titles',
      query,
      cookTime: cookTime?.value || cookTime || '',
      diet: diet?.value || diet || '',
      allergies: allergies.map(a => a.value || a),
      servingSize,
      additionalNotes,
      cuisine: cuisine?.value || cuisine || '',
      nutritionPref: nutritionPref.map(n => n.value || n),
    });
      const data = res.data;
      if (!data.success || !data.titles?.length)
        throw new Error(data.message || 'No recipe titles found');
      setRecipeTitles(data.titles);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipe = async (title) => {
    if (!title || !query.trim()) {
      setError('Title and query are required');
      return;
    }

    setLoading(true);
    setSelectedRecipe(null);
    setError('');
    setImage('');

    try {
      const res = await api.post('/api/recipes/smart', {
        step: 'fullRecipe',
        title,
      query,
      cookTime: cookTime?.value || cookTime || '',
      diet: diet?.value || diet || '',
      allergies: allergies.map(a => a.value || a),
      servingSize,
      additionalNotes,
      cuisine: cuisine?.value || cuisine || '',
      nutritionPref: nutritionPref.map(n => n.value || n),
    });

      const data = res.data;
      if (!data.success || !data.recipe)
        throw new Error(data.message || 'Recipe generation failed');
      setSelectedRecipe(data.recipe);
      setImage(data.recipe.imageUrl);
      setRecipeTitles([]);
      setIsLiked(false);
      setIsSaved(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderCreatableSingleSelect = (label, emoji, value, setValue, options) => (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {emoji} {label}
      </label>
      <CreatableSelect
        isClearable
        value={value}
        onChange={setValue}
        options={options.map((opt) => ({ label: opt, value: opt }))}
        placeholder={`Type or select ${label.toLowerCase()}`}
      />
    </div>
  );

  const renderCreatableMultiSelect = (label, emoji, value, setValue, options) => (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {emoji} {label}
      </label>
      <CreatableSelect
        isMulti
        isClearable
        value={value}
        onChange={setValue}
        options={options.map((opt) => ({ label: opt, value: opt }))}
        placeholder={`Type or select ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-rose-200 flex flex-col items-center px-6 pt-24 pb-20 text-center">
      <div className="max-w-3xl w-full">
        <h2 className="text-4xl md:text-6xl font-extrabold text-rose-700 mb-4 leading-tight">
          Let’s Cook Up Something Amazing
        </h2>
        <p className="text-3xl font-bold md:text-lg text-gray-600 mt-1 mb-8">
          Smart recipes crafted for your taste, ingredients, and lifestyle
          <br />— all in just seconds.
        </p>

        

        <div className="relative w-80 md:w-96 mx-auto">
          <input
            type="text"
            className="w-full p-3 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
            placeholder="Enter ingredients or cravings (e.g. tofu, spicy noodles)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
          {query && showSuggestions && (
            <ul className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-y-auto shadow-lg text-left">
              {suggestions
                .filter(item => item.toLowerCase().includes(query.toLowerCase()))
                .map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-rose-100 cursor-pointer"
                    onClick={() => {
                      setQuery(item);
                      setShowSuggestions(false);
                    }}
                  >
                    {item}
                  </li>
              ))}
            </ul>
          )}
       </div>
       </div>

      
      

      <div className="mt-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-rose-600 font-semibold text-sm hover:underline"
        >
          {showForm ? 'Hide Recipe Filters ▲' : 'Refine Your Search ▼'}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg grid md:grid-cols-2 gap-6 mt-4 max-w-4xl w-full shadow"
        >
          {renderCreatableSingleSelect('Cuisine', '🍱', cuisine, setCuisine, [
            'Indian',
            'Italian',
            'Mexican',
            'Chinese',
            'Thai',
            'Mediterranean',
          ])}
          {renderCreatableMultiSelect('Nutrition Preference', '💪', nutritionPref, setNutritionPref, [
            'Low Carb',
            'High Protein',
            'Low Fat',
            'High Fiber',
            'Gluten-Free',
          ])}
          {renderCreatableSingleSelect('Cook Time', '⏱️', cookTime, setCookTime, [
            '<15 min',
            '15–30 min',
            '30–45 min',
          ])}
          {renderCreatableSingleSelect('Diet', '🥗', diet, setDiet, ['Vegetarian', 'Vegan', 'Keto'])}
          {renderCreatableMultiSelect('Allergies', '⚠️', allergies, setAllergies, [
            'Dairy',
            'Gluten',
            'Peanuts',
          ])}
          <div>
            <label className="block text-sm font-semibold mb-1">🍽️ Serving Size</label>
            <input
              type="number"
              min="1"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              className="w-full border rounded-md p-2 shadow"
              placeholder="e.g. 2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">📝 Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 shadow"
              placeholder="e.g. Avoid nuts, make it spicy"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm rounded-md border border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSmartSearch}
          disabled={loading}
          className={`bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-5 rounded-lg ${
            loading ? 'opacity-60' : ''
          }`}
        >
          Get Recipe
        </button>
        {loading && (
          <motion.div
            className="mt-3 text-rose-500 text-4xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
          >
            <BsThreeDots />
          </motion.div>
        )}
      </div>

      {error && <div className="text-red-600 mt-6 font-semibold">{error}</div>}

      {recipeTitles.length > 0 && !selectedRecipe && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recipeTitles.map((title, index) => (
            <button
              key={index}
              onClick={() => handleGenerateRecipe(title)}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg text-rose-600 font-semibold text-sm border border-rose-200 hover:bg-rose-50"
            >
              {title}
            </button>
          ))}
        </div>
      )}

      {selectedRecipe && !loading && (
        <>
          <RecipeModal
            recipe={selectedRecipe}
            image={image}
            isLiked={isLiked}
            isSaved={isSaved}
            onClose={() => {
              setSelectedRecipe(null);
              setIsLiked(false);
              setIsSaved(false);
            }}
            onLike={handleLikeRecipe}
            onSave={handleSaveRecipe}
            
          />
          <div
            className="mt-6 p-4 bg-white rounded shadow max-w-4xl mx-auto text-left whitespace-pre-wrap overflow-auto"
            style={{ maxHeight: '400px' }}
          >
            <h3 className="font-semibold mb-2">Recipe JSON Output:</h3>
            <pre>{JSON.stringify(selectedRecipe, null, 2)}</pre>
          </div>
        </>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
          {toastMessage}
        </div>
      )}
    </section>
  );
};

export default RecipesSearchSection;
