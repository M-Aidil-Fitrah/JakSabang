import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable } from '@/components/admin/DataTable';
import { AlertCircle, CheckCircle, Eye, X, Users, Shield, FileText, UserCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

type Verifikasi = {
  _id: string;
  npwp: string;
  ktp: string;
  dokumenBisnis: string;
  status: 'pending' | 'approved' | 'rejected';
  catatan?: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  no_hp?: string;
  alamat?: string;
  verifikasi?: Verifikasi;
};

export default function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedVerifikasi, setSelectedVerifikasi] = useState<Verifikasi | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Hanya admin yang boleh mengakses');
        else throw new Error('Gagal memuat data pengguna');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) {
        if (res.status === 400) throw new Error('Role tidak valid');
        if (res.status === 404) throw new Error('User tidak ditemukan');
        throw new Error('Gagal mengupdate role');
      }
      setSuccess('Role berhasil diupdate');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  const updateVerifikasiStatus = async (verifikasiId: string, newStatus: 'approved' | 'rejected') => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_URL}/admin/verifikasi/${verifikasiId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Gagal memperbarui status verifikasi');
      setSuccess('Status verifikasi berhasil diperbarui');
      setSelectedVerifikasi(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="flex h-screen bg-admin">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          title="Dashboard Admin"
          subtitle="Kelola pengguna dan verifikasi penjual JakSabang"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Alert Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert-error rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="font-medium text-red-800 dark:text-red-300">Error</span>
                </div>
                <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert-success rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">Berhasil</span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400 mt-1">{success}</p>
              </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Pengguna"
                value={users.length}
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="Verifikasi Pending"
                value={users.filter(u => u.verifikasi?.status === 'pending').length}
                icon={Shield}
                color="orange"
              />
              <StatsCard
                title="Seller Aktif"
                value={users.filter(u => u.role === 'seller').length}
                icon={UserCheck}
                color="emerald"
              />
              <StatsCard
                title="Admin"
                value={users.filter(u => u.role === 'admin').length}
                icon={FileText}
                color="purple"
              />
            </div>

            {/* Users Table */}
            <DataTable
              title="Daftar Pengguna"
              subtitle="Kelola role dan status verifikasi pengguna"
              loading={loading}
              data={users}
              emptyMessage="Tidak ada pengguna ditemukan"
              onRowClick={(user) => {
                if (user.verifikasi) {
                  setSelectedVerifikasi(user.verifikasi);
                }
              }}
              columns={[
                {
                  key: 'name',
                  label: 'Nama',
                  render: (value) => (
                    <div className="font-medium">{value}</div>
                  )
                },
                {
                  key: 'email',
                  label: 'Email',
                  render: (value) => (
                    <div className="text-muted-foreground">{value}</div>
                  )
                },
                {
                  key: 'role',
                  label: 'Role',
                  render: (value) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      value === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : value === 'seller'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {value}
                    </span>
                  )
                },
                {
                  key: 'no_hp',
                  label: 'No HP',
                  render: (value) => value || '-'
                },
                {
                  key: 'alamat',
                  label: 'Alamat',
                  render: (value) => (
                    <div className="max-w-xs truncate">
                      {value || '-'}
                    </div>
                  )
                },
                {
                  key: 'verifikasi',
                  label: 'Verifikasi',
                  render: (verifikasi) => (
                    <div className="flex items-center gap-2">
                      {verifikasi ? (
                        <>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            verifikasi.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : verifikasi.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {verifikasi.status === 'pending' ? 'Pending' :
                             verifikasi.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVerifikasi(verifikasi);
                            }}
                            className="p-1 h-6 w-6"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Belum mengajukan
                        </span>
                      )}
                    </div>
                  )
                },
                {
                  key: '_id',
                  label: 'Kelola Role',
                  render: (_, user) => (
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        size="sm" 
                        variant={user.role === 'buyer' ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateUserRole(user._id, 'buyer');
                        }}
                        className="text-xs h-6 px-2"
                      >
                        Buyer
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.role === 'seller' ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateUserRole(user._id, 'seller');
                        }}
                        className="text-xs h-6 px-2"
                      >
                        Seller
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.role === 'admin' ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateUserRole(user._id, 'admin');
                        }}
                        className="text-xs h-6 px-2"
                      >
                        Admin
                      </Button>
                    </div>
                  )
                }
              ]}
            />
          </motion.div>
        </div>
      </div>

      {/* Detail Verifikasi */}
      {selectedVerifikasi && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-admin-card rounded-lg border border-admin w-full max-w-2xl relative shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-admin">
              <div>
                <h2 className="text-lg font-semibold text-admin">
                  Detail Dokumen Verifikasi
                </h2>
                <p className="text-sm text-admin-muted">
                  Review dan kelola status verifikasi
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVerifikasi(null)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-admin mb-2">
                      Status Verifikasi
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedVerifikasi?.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : selectedVerifikasi?.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {selectedVerifikasi?.status === 'pending' ? 'Menunggu Review' :
                       selectedVerifikasi?.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </div>

                  {selectedVerifikasi?.catatan && (
                    <div>
                      <h3 className="text-sm font-medium text-admin mb-2">
                        Catatan
                      </h3>
                      <p className="text-sm text-admin-muted bg-admin p-3 rounded-lg">
                        {selectedVerifikasi.catatan}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-admin">
                    Dokumen yang Diunggah
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-admin rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-admin">KTP</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => selectedVerifikasi && window.open(`${API_URL}/${selectedVerifikasi.ktp}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-admin rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-admin">NPWP</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => selectedVerifikasi && window.open(`${API_URL}/${selectedVerifikasi.npwp}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-admin rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-admin">Dokumen Bisnis</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => selectedVerifikasi && window.open(`${API_URL}/${selectedVerifikasi.dokumenBisnis}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedVerifikasi?.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-admin">
                  <Button 
                    onClick={() => selectedVerifikasi && updateVerifikasiStatus(selectedVerifikasi._id, 'approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Setujui Verifikasi
                  </Button>
                  <Button 
                    onClick={() => selectedVerifikasi && updateVerifikasiStatus(selectedVerifikasi._id, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Tolak Verifikasi
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
