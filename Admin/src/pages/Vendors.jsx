import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import VendorList from '../components/VendorList.jsx';
import VendorDetail from '../components/VendorDetail.jsx';

const Vendors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    if (id) {
      fetchVendorById(id);
    } else {
      fetchVendors();
    }
  }, [id, filters, pagination.page]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = {
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const data = await API.getAllVendors(params);
      setVendors(data.vendors);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      alert(`Error fetching vendors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorById = async (vendorId) => {
    try {
      setLoading(true);
      const vendor = await API.getVendorById(vendorId);
      setSelectedVendor(vendor);
    } catch (error) {
      console.error('Error fetching vendor:', error);
      alert(`Error fetching vendor: ${error.message}`);
      navigate('/vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleVendorSelect = (vendor) => {
    navigate(`/vendors/${vendor._id}`);
  };

  const handleVendorAction = async (vendorId, action, notes = '') => {
    try {
      console.log(`Performing action ${action} on vendor ${vendorId}`);
      
      if (action === 'approve' || action === 'reject') {
        await API.verifyVendor(vendorId, action === 'approve' ? 'approved' : 'rejected', notes);
      } else if (action === 'suspend' || action === 'activate') {
        const status = action === 'suspend' ? 'suspended' : 'active';
        await API.updateVendorStatus(vendorId, status, notes);
      }
      
      alert(`Vendor ${action}d successfully`);
      
      // Refresh data
      if (selectedVendor && selectedVendor._id === vendorId) {
        fetchVendorById(vendorId);
      } else {
        fetchVendors();
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDocumentReview = async (vendorId, status, reviewNotes = '') => {
    try {
      await API.reviewVendorDocuments(vendorId, status, reviewNotes);
      alert(`Documents ${status} successfully`);
      
      // Refresh data
      if (selectedVendor && selectedVendor._id === vendorId) {
        fetchVendorById(vendorId);
      } else {
        fetchVendors();
      }
    } catch (error) {
      console.error('Error reviewing documents:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading && !vendors.length && !selectedVendor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {id && selectedVendor ? (
        <VendorDetail 
          vendor={selectedVendor}
          onAction={handleVendorAction}
          onDocumentReview={handleDocumentReview}
          onBack={() => navigate('/vendors')}
        />
      ) : (
        <VendorList
          vendors={vendors}
          pagination={pagination}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onVendorSelect={handleVendorSelect}
          onAction={handleVendorAction}
        />
      )}
    </div>
  );
};

export default Vendors;