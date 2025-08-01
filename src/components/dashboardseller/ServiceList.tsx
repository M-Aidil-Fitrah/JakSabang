import { motion } from 'framer-motion';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceListProps {
  title: string;
  services: any[];
  onEdit?: (service: any) => void;
  onView?: (service: any) => void;
  onDelete?: (service: any) => void;
  type: 'rental' | 'penginapan' | 'tourguide';
}

export function ServiceList({ 
  title, 
  services, 
  onEdit, 
  onView, 
  onDelete, 
  type 
}: ServiceListProps) {
  const getImageField = (service: any) => {
    switch (type) {
      case 'rental':
        return service.gambar;
      case 'penginapan':
        return service.gambar;
      case 'tourguide':
        return service.foto;
      default:
        return '';
    }
  };

  const getNameField = (service: any) => {
    switch (type) {
      case 'rental':
        return service.name;
      case 'penginapan':
        return service.nama;
      case 'tourguide':
        return service.name;
      default:
        return '';
    }
  };

  const getDescriptionField = (service: any) => {
    switch (type) {
      case 'rental':
        return service.deskripsi;
      case 'penginapan':
        return service.deskripsi;
      case 'tourguide':
        return service.kataKata;
      default:
        return '';
    }
  };

  const getPriceField = (service: any) => {
    switch (type) {
      case 'rental':
        return service.harga ? `Rp ${parseInt(service.harga).toLocaleString('id-ID')}` : '-';
      case 'penginapan':
        return service.harga ? `Rp ${parseInt(service.harga).toLocaleString('id-ID')}` : '-';
      case 'tourguide':
        return service.tarif ? `Rp ${parseInt(service.tarif).toLocaleString('id-ID')}` : '-';
      default:
        return '-';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-admin">{title}</h2>
        <span className="text-sm text-admin-muted">
          {services.length} layanan
        </span>
      </div>

      {services.length === 0 ? (
        <div className="bg-admin-card rounded-lg border border-admin p-8 text-center">
          <p className="text-admin-muted">Belum ada layanan yang ditambahkan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-admin-card rounded-lg border border-admin overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                {getImageField(service) ? (
                  <img
                    src={getImageField(service)}
                    alt={getNameField(service)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-admin-muted">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-admin mb-2 line-clamp-1">
                  {getNameField(service)}
                </h3>
                <p className="text-sm text-admin-muted mb-3 line-clamp-2">
                  {getDescriptionField(service)}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-emerald-600">
                    {getPriceField(service)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {onView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(service)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(service)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(service)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
