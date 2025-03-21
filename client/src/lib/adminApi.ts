import { apiRequest } from "./queryClient";

// Helper function to get admin token from localStorage
const getAdminToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Function to make authenticated admin API requests
export const adminApiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };
  
  // Make the API request with the authorization header
  return apiRequest(endpoint, {
    ...options,
    headers
  });
};

// Dashboard stats
export const fetchDashboardStats = async () => {
  return adminApiRequest('/api/admin/dashboard');
};

// Pets management
export const fetchAdminPets = async () => {
  return adminApiRequest('/api/admin/pets');
};

export const createPet = async (petData: any) => {
  return adminApiRequest('/api/admin/pets', {
    method: 'POST',
    body: JSON.stringify(petData)
  });
};

export const updatePet = async (id: number, petData: any) => {
  return adminApiRequest(`/api/admin/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(petData)
  });
};

export const deletePet = async (id: number) => {
  return adminApiRequest(`/api/admin/pets/${id}`, {
    method: 'DELETE'
  });
};

// Owners management
export const fetchAllOwners = async () => {
  return adminApiRequest('/api/admin/owners');
};

export const fetchPendingOwners = async () => {
  return adminApiRequest('/api/admin/owners/pending');
};

export const createOwner = async (ownerData: any) => {
  return adminApiRequest('/api/admin/owners', {
    method: 'POST',
    body: JSON.stringify(ownerData)
  });
};

export const updateOwner = async (id: number, ownerData: any) => {
  return adminApiRequest(`/api/admin/owners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ownerData)
  });
};

export const approveOwner = async (id: number) => {
  return adminApiRequest(`/api/admin/owners/${id}/approve`, {
    method: 'PUT'
  });
};

export const deleteOwner = async (id: number) => {
  return adminApiRequest(`/api/admin/owners/${id}`, {
    method: 'DELETE'
  });
};

// Reports management
export const fetchReports = async () => {
  return adminApiRequest('/api/admin/reports');
};

export const fetchReport = async (id: number) => {
  return adminApiRequest(`/api/admin/reports/${id}`);
};

export const updateReport = async (id: number, reportData: any) => {
  return adminApiRequest(`/api/admin/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reportData)
  });
};

// Admins management
export const fetchAdmins = async () => {
  return adminApiRequest('/api/admin/admins');
};

export const createAdmin = async (adminData: any) => {
  return adminApiRequest('/api/admin/admins', {
    method: 'POST',
    body: JSON.stringify(adminData)
  });
};

// Products management
export const fetchProducts = async () => {
  return adminApiRequest('/api/admin/products');
};

export const createProduct = async (productData: any) => {
  return adminApiRequest('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

export const updateProduct = async (id: number, productData: any) => {
  return adminApiRequest(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};

export const deleteProduct = async (id: number) => {
  return adminApiRequest(`/api/admin/products/${id}`, {
    method: 'DELETE'
  });
};