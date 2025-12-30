import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Stats {
  totalStudents: number;
  totalTasks: number;
  pendingTasks: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const { data: students } = await supabase.from('students').select('*');
      const { data: tasks } = await supabase.from('tasks').select('*');
      const pendingTasks = tasks?.filter(task => task.status === 'pending') || [];

      setStats({
        totalStudents: students?.length || 0,
        totalTasks: tasks?.length || 0,
        pendingTasks: pendingTasks.length,
      });
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total de Alumnos',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      link: '/students',
    },
    {
      title: 'Total de Tareas',
      value: stats.totalTasks,
      icon: BookOpen,
      color: 'bg-green-500',
      link: '/tasks',
    },
    {
      title: 'Tareas Pendientes',
      value: stats.pendingTasks,
      icon: BarChart3,
      color: 'bg-yellow-500',
      link: '/tasks',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={card.link}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-800">
                    {card.value}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-600">
                  {card.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Bienvenido al Sistema de Gestión Escolar
        </h2>
        <p className="text-gray-600">
          Desde este panel podrás gestionar tus alumnos y sus tareas de manera eficiente.
          Utiliza la navegación superior para acceder a las diferentes secciones del sistema.
        </p>
      </div>
    </div>
  );
}