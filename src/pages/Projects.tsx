import { motion } from 'framer-motion';

function Projects() {
  const projects = [
    { title: 'Project 1', description: 'A modern e-commerce platform built with React and Supabase.' },
    { title: 'Project 2', description: 'A real-time chat app using WebSocket and Node.js.' },
    { title: 'Project 3', description: 'A task management tool with drag-and-drop functionality.' },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p>{project.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Projects;