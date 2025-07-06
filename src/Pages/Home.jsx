
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaUtensils, FaLeaf, FaHeartbeat } from 'react-icons/fa';

const features = [
  {
    title: 'AI-Powered Recipes',
    icon: <FaUtensils className="text-rose-500 text-3xl mb-2" />,
    description: 'Get creative, healthy recipes generated just for your taste and goals.'
  },
  {
    title: 'Personalized Meal Plans',
    icon: <FaLeaf className="text-emerald-500 text-3xl mb-2" />,
    description: 'Daily diet plans tailored to your lifestyle and preferences.'
  },
  {
    title: 'Nutrition Guidance',
    icon: <FaHeartbeat className="text-indigo-500 text-3xl mb-2" />,
    description: 'Track nutrients and stay informed with expert diet tips.'
  }
];

const HomePage = () => {
  return (
    <div className="bg-gradient-to-tr from-pink-50 via-rose-100 to-orange-50 text-gray-800 flex flex-col min-h-screen">
      <Header />

      
      <section className="text-center py-52 px-6 flex-grow">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-pink-500 to-yellow-400 font-poppins tracking-wide drop-shadow-md"


        >
          Your Personal AI Kitchen Assistant
        </motion.h1>

      <motion.h2
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-xl md:text-3xl font-semibold leading-snug text-gray-800 mt-4 font-inter"
>
  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-transparent bg-clip-text font-medium">
    Smart recipes
  </span>,{' '}
  <span className="text-emerald-600 font-medium">nutrition tips</span>, and{' '}
  <span className="text-indigo-600 font-medium">meal plans</span> — just for{' '}
  <span className="italic">you...</span>
</motion.h2>


        <div className="mt-10">
          <Link
            to="/create"
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full transition font-bold"
          >
            Get Started
          </Link>
        </div>
      </section>

     
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-rose-600 mb-8">✨ Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-rose-50 to-pink-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

     
      <footer className="bg-gradient-to-r from-rose-100 to-pink-200 py-8 px-6 text-center">
        <h3 className="text-xl font-semibold text-rose-600 mb-2">Stay Connected</h3>
        <p className="text-gray-700 mb-4">
          Follow us for smart kitchen hacks, recipe ideas, and wellness tips.
        </p>
        <div className="flex justify-center space-x-6 text-rose-600 text-2xl">
          <a href="#"><FaFacebookF className="hover:text-rose-800 transition" /></a>
          <a href="#"><FaInstagram className="hover:text-rose-800 transition" /></a>
          <a href="#"><FaTwitter className="hover:text-rose-800 transition" /></a>
          <a href="#"><FaLinkedin className="hover:text-rose-800 transition" /></a>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Smart Culinary Companion. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
