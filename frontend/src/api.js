const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8081/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Invalid credentials');
  }
  return response.json();
};

export const signup = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Signup failed');
  }
  return response.json();
};

export const getStudents = async (token) => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
};

export const createStudent = async (token, student) => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Failed to create student');
  return response.json();
};

export const updateStudent = async (token, id, student) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Failed to update student');
  return response.json();
};

export const deleteStudent = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete student');
  return true;
};
