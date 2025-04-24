import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '../store/gameStore';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../components/StrictModeDroppable';

function Home() {
  const { snippets, outputs, moveSnippet, checkWin, generateRandomSnippets } = useStore();

  useEffect(() => {
    generateRandomSnippets();
  }, [generateRandomSnippets]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    moveSnippet(draggableId, destination.droppableId);
    checkWin();
  };

  return (
    <section className="text-center py-16">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to My Portfolio
      </motion.h1>
      <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
        I'm a passionate developer creating modern web applications. Try this quick coding game below!
      </p>
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Mini Coding Game: Match the Code</h2>
        <p className="text-center mb-4">Drag the code snippets to their correct outputs!</p>
        <div className="text-center mb-6">
          <button
            onClick={generateRandomSnippets}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            New Game
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Code Snippets</h3>
              <StrictModeDroppable droppableId="snippets">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-2 droppable ${snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                  >
                    {snippets.map((snippet, index) => (
                      <Draggable key={snippet.id} draggableId={snippet.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm draggable ${
                              snapshot.isDragging ? 'opacity-75' : ''
                            }`}
                          >
                            <code className="text-sm">{snippet.code}</code>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Outputs</h3>
              {outputs.map((output) => (
                <StrictModeDroppable key={output.id} droppableId={output.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mb-2 droppable ${
                        snapshot.isDraggingOver ? 'bg-gray-300 dark:bg-gray-600' : ''
                      }`}
                    >
                      <p className="font-mono text-sm">{output.value}</p>
                      {output.matchedSnippet && (
                        <div className="mt-1 bg-white dark:bg-gray-800 p-2 rounded">
                          <code className="text-sm">{output.matchedSnippet.code}</code>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              ))}
            </div>
          </div>
        </DragDropContext>
      </motion.div>
    </section>
  );
}

export default Home;