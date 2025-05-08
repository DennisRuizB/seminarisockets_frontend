// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Chat from './components/Chat/Chat';
import {Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { User } from './types/types';
import Login from './components/Login/Login';
import { LogIn } from './services/usersService';
import { useSocket } from './hooks/useSocket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface AppState {
  currentUser: User | null;
  users: User[];
  newUsersNumber: number;
  isLoggedIn: boolean;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<AppState['isLoggedIn']>(false);
  const [currentUser, setCurrentUser] = useState<AppState['currentUser']>(null);
  const socket = useSocket();
  

  const navigate = useNavigate();

  const divRef = useRef<HTMLDivElement>(null); // Mantenemos el useRef como ejemplo
  useEffect(() => {
    if (isLoggedIn) {    
      navigate('/chat', {state: {user: currentUser}}); // Navega a la página de chat cuando el usuario inicie sesión
    }
}, [isLoggedIn, navigate, currentUser]); 


  const handleLogin = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await LogIn(email, password);
      console.log('User logged in:', response);

      const accessToken = response.accessToken;
      localStorage.setItem('accessToken', accessToken);

      setCurrentUser(response.user);
      setIsLoggedIn(true);

      // Emitir el evento login_emmit al servidor
      if (socket) {
        socket.emit('login_emmit', response.user.name);
        console.log('Evento login_emmit emitido:', response.user.name);
      } else {
        console.error('Socket no está inicializado.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
        <div className="App" ref={divRef}>
          <Routes>
              <Route path="/" element={
                <div className="content">
                {!isLoggedIn ? (
                    <Login
                        onLogin={({ email, password }) => handleLogin(email, password)}
                    />
                ) : (
                    <>
                        <h2>Bienvenido, {currentUser?.name}!</h2>
                    </>
                )}
            </div>
              } 
            />
             <Route path="/chat" element={<Chat />} />
             <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer />
        </div>
  );
}

export default App;

