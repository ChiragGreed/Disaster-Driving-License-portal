import React, { useState, useEffect } from 'react'
import Dashboard from './Features/Home/Pages/Dashboard';

const banners = [
  '/images/portal1.jpg',
  '/images/portal2.jpg',
  '/images/portal3.jpg',
  '/images/portal4.jpg'
];

export default function App() {
  return (
    <main>
      <Dashboard />
    </main>
  )
}
