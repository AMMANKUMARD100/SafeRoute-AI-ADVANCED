import { Link } from 'react-router-dom';
import GlowButton from '../components/common/GlowButton';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
    <h1 className="text-6xl font-bold text-pink-400 mb-4">404</h1>
    <p className="text-xl text-gray-400 mb-8">Oops! This route doesn’t exist.</p>
    <Link to="/">
      <GlowButton>Back to Safety</GlowButton>
    </Link>
  </div>
);

export default NotFound;