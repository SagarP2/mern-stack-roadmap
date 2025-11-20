import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const SiteLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
