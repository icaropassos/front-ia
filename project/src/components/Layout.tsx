import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Search, Settings, ChevronRight } from 'lucide-react';
import logo from '../img/Logo SysMap 25 Anos.png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ name: 'Dashboard', href: '/' }];

    if (path.includes('/historia/')) {
      breadcrumbs.push({ name: 'Histórias', href: '/' });
      if (path.includes('/cenario/')) {
        breadcrumbs.push({ name: 'Detalhes da História', href: path.split('/cenario/')[0] });
        breadcrumbs.push({ name: 'Cenário de Teste', href: path });
      } else {
        breadcrumbs.push({ name: 'Detalhes da História', href: path });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6 flex justify-center">
          <img src={logo} alt='Logo SysMap' className='h-12'/>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                location.pathname === '/' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                location.pathname.includes('/historia/') 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="mr-3 h-4 w-4" />
              Histórias
            </Link>
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
              <Search className="mr-3 h-4 w-4" />
              Busca Avançada
            </div>
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
              <Settings className="mr-3 h-4 w-4" />
              Configurações
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.href} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                  <Link
                    to={breadcrumb.href}
                    className={`text-sm font-medium ${
                      index === breadcrumbs.length - 1
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {breadcrumb.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;