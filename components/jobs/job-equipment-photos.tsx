import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DocumentEntity } from '../../models/documents/document.entity';
import { useTranslation } from '../../hooks/use-translation';
import ViewModal from '../view-details/view-modal';
import DocumentApi from '../../pages/api/document';

interface JobEquipmentPhotosProps {
  photos: DocumentEntity[];
  readOnly?: boolean;
  className?: string;
}

export const JobEquipmentPhotos: React.FC<JobEquipmentPhotosProps> = ({
  photos,
  readOnly = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewingPhotoName, setViewingPhotoName] = useState<string>('');

  const handlePhotoClick = async (photo: DocumentEntity) => {
    try {
      if (photo.id) {
        const api = new DocumentApi();
        const document = await api.getSignedUrl(photo.id);
        setSelectedPhoto(document.path);
        setViewingPhotoName(photo.name || 'Equipment Photo');
      } else if (photo.path) {
        setSelectedPhoto(photo.path);
        setViewingPhotoName(photo.name || 'Equipment Photo');
      }
    } catch (error) {
      console.error('Error loading photo:', error);
    }
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setViewingPhotoName('');
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className={className}>
        <Row>
          {photos.map((photo, index) => (
            <Col key={index} xs={12} sm={6} md={4} className="mb-3">
              <div
                className="equipment-photo-container"
                onClick={() => handlePhotoClick(photo)}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '75%', // 4:3 aspect ratio
                  overflow: 'hidden',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <img
                  src={photo.path || (photo.id ? `/api/documents/${photo.id}` : '')}
                  alt={photo.name || `Equipment photo ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div
                  className="photo-overlay"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: 'white',
                    padding: '8px 12px',
                    fontSize: '14px',
                  }}
                >
                  {t('EQUIPMENT_PHOTO')} {index + 1}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Full-size image modal */}
      <ViewModal
        show={!!selectedPhoto}
        title={viewingPhotoName}
        onCloseClick={closeModal}
      >
        <img
          className="img-fluid"
          src={selectedPhoto || ''}
          alt={viewingPhotoName}
          style={{ width: '100%', height: 'auto' }}
        />
      </ViewModal>
    </>
  );
};
