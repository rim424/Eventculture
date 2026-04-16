import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './pages/EventDetail';
import MesReservations from './pages/MesReservations';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EvenementsEnAttente from './pages/EvenementsEnAttente';
import { LangProvider } from './contexts/LangContext';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <LangProvider>
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/mes-reservations" element={<MesReservations />} />
                    <Route path="/events/create" element={<CreateEvent />} />
                    <Route path="/events/edit/:id" element={<EditEvent />} />
                    <Route path="/admin/evenements/attente" element={<EvenementsEnAttente />} />
                </Routes>
            </Router>
        </AuthProvider>
        </LangProvider>
    );
}

export default App;