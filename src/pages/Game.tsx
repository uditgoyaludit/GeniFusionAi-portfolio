import { useEffect } from 'react';
import { useStore } from '../store/gameStore';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { StrictModeDroppable } from '../components/StrictModeDroppable';

function Game() {
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
    <section className="py-16">
      <motion.h2
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Coding Game: Match the Code
      </motion.h2>
      <p className="text-center mb-4">Drag the code snippets to their correct outputs!</p>
      <div className="text-center mb-8">
        <button
          onClick={generateRandomSnippets}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Generate New Snippets
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-4">Code Snippets</h3>
            <StrictModeDroppable droppableId="snippets">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-4 droppable ${snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                >
                  {snippets.map((snippet, index) => (
                    <Draggable key={snippet.id} draggableId={snippet.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md draggable ${
                            snapshot.isDragging ? 'opacity-75' : ''
                          }`}
                        >
                          <code>{snippet.code}</code>
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
            <h3 className="text-xl font-semibold mb-4">Outputs</h3>
            {outputs.map((output) => (
              <StrictModeDroppable key={output.id} droppableId={output.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 droppable ${
                      snapshot.isDraggingOver ? 'bg-gray-300 dark:bg-gray-600' : ''
                    }`}
                  >
                    <p className="font-mono">{output.value}</p>
                    {output.matchedSnippet && (
                      <div className="mt-2 bg-white dark:bg-gray-800 p-2 rounded">
                        <code>{output.matchedSnippet.code}</code>
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
    </section>
  );
}

export default Game;