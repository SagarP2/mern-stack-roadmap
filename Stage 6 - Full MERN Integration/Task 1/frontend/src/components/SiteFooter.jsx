import { Link } from 'react-router-dom';

const SiteFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 text-white text-base">📝</span>
              <span className="text-lg font-bold text-gray-900">BlogSpace</span>
            </div>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              A modern blogging platform where writers share their stories and readers discover amazing content.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#blog-posts-section" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Browse</a></li>
              <li><Link to="/register" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Get started</Link></li>
              <li><Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Community</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} BlogSpace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
