import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SellerSidebar } from '../../../components/dashboardseller/SellerSidebar';
import { SellerHeader } from '../../../components/dashboardseller/SellerHeader';
import { SellerStatsCard } from '../../../components/dashboardseller/SellerStatsCard';
import { ServiceList } from '../../../components/dashboardseller/ServiceList';
import RentalForm from '../../../components/dashboardseller/RentalForm';
import TourGuideForm from '../../../components/dashboardseller/TourGuideForm';
import PenginapanForm from '../../../components/dashboardseller/PenginapanForm';
import { Car, Users, Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const token = localStorage.getItem('token');
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Get current tab and form from URL params
  const currentTab = searchParams.get('tab') || 'dashboard';
  const currentForm = searchParams.get('form');

  const [user, setUser] = useState<{
    id: string; name: string; role: string; email: string; no_hp: string; alamat: string;
  } | null>(null);

  const [rentalList, setRentalList] = useState<any[]>([]);
  const [penginapanList, setPenginapanList] = useState<any[]>([]);
  const [tourguideList, setTourguideList] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed?.user || parsed);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [rentalRes, penginapanRes, tourguideRes] = await Promise.all([
          fetch(`${API_URL}/rental`).then(r => r.json()),
          fetch(`${API_URL}/penginapan`).then(r => r.json()),
          fetch(`${API_URL}/tourguides`).then(r => r.json()),
        ]);
        setRentalList(rentalRes);
        setPenginapanList(penginapanRes);
        setTourguideList(tourguideRes);
      } catch (e) {
        console.error('Failed to fetch data', e);
      }
    };
    fetchAll();
  }, [token]);

  // Filter data berdasarkan user
  const userRentals = rentalList.filter(item => (item.penyedia?._id || item.penyedia) === user?.id);
  const userPenginapan = penginapanList.filter(item => (item.penyedia?._id || item.penyedia) === user?.id);
  const userTourguides = tourguideList.filter(item => (item.penyedia?._id || item.penyedia) === user?.id);

  // Handle edit
  const handleEdit = (type: 'rental' | 'penginapan' | 'tourguide', data: any) => {
    setEditData(data);
    // Redirect to form page
    window.location.href = `/layanan/dashboard?form=${type}`;
  };

  // Handle close form
  const handleCloseForm = () => {
    setEditData(null);
    window.location.href = '/layanan/dashboard';
  };

  // Get page title and subtitle based on current tab/form
  const getPageInfo = () => {
    if (currentForm) {
      switch (currentForm) {
        case 'rental':
          return { title: editData ? 'Edit Rental' : 'Tambah Rental', subtitle: 'Kelola layanan rental kendaraan Anda' };
        case 'penginapan':
          return { title: editData ? 'Edit Penginapan' : 'Tambah Penginapan', subtitle: 'Kelola layanan penginapan Anda' };
        case 'tourguide':
          return { title: editData ? 'Edit Tour Guide' : 'Tambah Tour Guide', subtitle: 'Kelola layanan tour guide Anda' };
        default:
          return { title: 'Dashboard Seller', subtitle: 'Kelola layanan wisata Anda dengan mudah' };
      }
    }

    switch (currentTab) {
      case 'rental-saya':
        return { title: 'Rental Saya', subtitle: 'Kelola layanan rental kendaraan Anda' };
      case 'penginapan-saya':
        return { title: 'Penginapan Saya', subtitle: 'Kelola layanan penginapan Anda' };
      case 'tourguide-saya':
        return { title: 'Tour Guide Saya', subtitle: 'Kelola layanan tour guide Anda' };
      default:
        return { title: 'Dashboard Seller', subtitle: 'Kelola layanan wisata Anda dengan mudah' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex h-screen bg-admin">
      {/* Sidebar */}
      <SellerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <SellerHeader 
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          user={user}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Overview */}
          {!currentForm && currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SellerStatsCard
                  title="Rental Kendaraan"
                  value={userRentals.length}
                  icon={Car}
                  color="blue"
                  description="Layanan aktif"
                  onClick={() => window.location.href = '/layanan/dashboard?tab=rental-saya'}
                />
                <SellerStatsCard
                  title="Penginapan"
                  value={userPenginapan.length}
                  icon={Home}
                  color="purple"
                  description="Layanan aktif"
                  onClick={() => window.location.href = '/layanan/dashboard?tab=penginapan-saya'}
                />
                <SellerStatsCard
                  title="Tour Guide"
                  value={userTourguides.length}
                  icon={Users}
                  color="emerald"
                  description="Layanan aktif"
                  onClick={() => window.location.href = '/layanan/dashboard?tab=tourguide-saya'}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-admin-card rounded-lg border border-admin p-6">
                <h3 className="text-lg font-semibold text-admin mb-4">Tambah Layanan Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-admin rounded-lg cursor-pointer hover:bg-admin transition-colors"
                    onClick={() => window.location.href = '/layanan/dashboard?form=rental'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 text-white rounded-lg">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-admin">Rental Kendaraan</h4>
                        <p className="text-sm text-admin-muted">Tambah layanan rental</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-admin rounded-lg cursor-pointer hover:bg-admin transition-colors"
                    onClick={() => window.location.href = '/layanan/dashboard?form=penginapan'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 text-white rounded-lg">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-admin">Penginapan</h4>
                        <p className="text-sm text-admin-muted">Tambah layanan penginapan</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border border-admin rounded-lg cursor-pointer hover:bg-admin transition-colors"
                    onClick={() => window.location.href = '/layanan/dashboard?form=tourguide'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500 text-white rounded-lg">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-admin">Tour Guide</h4>
                        <p className="text-sm text-admin-muted">Tambah layanan tour guide</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* Rental Saya */}
          {!currentForm && currentTab === 'rental-saya' && (
            <ServiceList
              title="Rental Kendaraan Saya"
              services={userRentals}
              type="rental"
              onEdit={(service) => handleEdit('rental', service)}
            />
          )}

          {/* Penginapan Saya */}
          {!currentForm && currentTab === 'penginapan-saya' && (
            <ServiceList
              title="Penginapan Saya"
              services={userPenginapan}
              type="penginapan"
              onEdit={(service) => handleEdit('penginapan', service)}
            />
          )}

          {/* Tour Guide Saya */}
          {!currentForm && currentTab === 'tourguide-saya' && (
            <ServiceList
              title="Tour Guide Saya"
              services={userTourguides}
              type="tourguide"
              onEdit={(service) => handleEdit('tourguide', service)}
            />
          )}

          {/* Forms */}
          {currentForm && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-admin-card rounded-lg border border-admin overflow-hidden"
            >
              {currentForm === 'rental' && (
                <RentalForm 
                  token={token} 
                  user={user} 
                  setActiveForm={handleCloseForm} 
                  editData={editData} 
                />
              )}
              {currentForm === 'tourguide' && (
                <TourGuideForm 
                  token={token} 
                  user={user} 
                  setActiveForm={handleCloseForm} 
                />
              )}
              {currentForm === 'penginapan' && (
                <PenginapanForm 
                  token={token} 
                  user={user} 
                  setActiveForm={handleCloseForm} 
                  editData={editData} 
                />
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
