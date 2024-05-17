import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login'; // Adjust this path as necessary

// Setup for the entire test suite
beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      accessToken: 'fake_access_token',
      refreshToken: 'fake_refresh_token',
      userId: 'testuser'
    }),
    status: 200
  }));
});

afterEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

test('allows a user to log in and updates sessionStorage', async () => {
  render(<Login />);

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText('아이디를 입력하세요.'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요.'), { target: { value: 'password' } });
  
  // Simulate form submission
  fireEvent.click(screen.getByText('확인'));

  // Ensure fetch was called correctly
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("로그인 서버 주소(요청지 주소)", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId: 'testuser', password: 'password'})
    });
  });

  // Check that session storage was updated (assuming the mock resolves immediately)
  expect(sessionStorage.getItem('accessToken')).toBe('fake_access_token');

  // Check that there are no error messages shown
  expect(screen.queryByText('아이디 혹은 비밀번호가 틀렸습니다.')).not.toBeInTheDocument();
});

test('shows an error message on login failure', async () => {
  // Overriding the fetch implementation for this test case
  fetch.mockImplementationOnce(() => Promise.resolve({
    json: () => Promise.resolve({ message: 'Invalid credentials' }),
    status: 401
  }));

  render(<Login />);

  fireEvent.change(screen.getByPlaceholderText('아이디를 입력하세요.'), { target: { value: 'wronguser' } });
  fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력하세요.'), { target: { value: 'wrongpassword' } });
  fireEvent.click(screen.getByText('확인'));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByText('아이디 혹은 비밀번호가 틀렸습니다.')).toBeInTheDocument();
  });
});
