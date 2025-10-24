import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
