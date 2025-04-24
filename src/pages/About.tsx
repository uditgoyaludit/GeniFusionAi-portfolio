import { motion } from 'framer-motion';

function About() {
  return (
    <section className="py-16">
      <motion.h2
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Me
      </motion.h2>
      <p className="text-lg max-w-3xl mx-auto">
        I'm a full-stack developer with expertise in React, TypeScript, and Node.js. I love building intuitive and
        performant web applications. When I'm not coding, you can find me exploring new tech or playing strategy games.
      </p>
    </section>
  );
}

export default About;