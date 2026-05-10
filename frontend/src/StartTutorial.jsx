const [tutorialStep, setTutorialStep] = useState(0);

const startTutorial = () => {
  setTutorialStep(1);
  speakInstruction("Namaste! Yo website chalauna sikhna ko lagi, krpaya screen ma euta golo banunus.");
};

// Inside your stopDrawing function:
const stopDrawing = () => {
  setIsDrawing(false);
  
  if (tutorialStep === 1) {
     const shape = recognizeShape(points); // Your AI logic
     if (shape === 'circle') {
       speakInstruction("Sabaigunda ramro! Aba tapai tyatryatryatryatrya..."); 
       setTutorialStep(2);
       localStorage.setItem('tutorialDone', 'true');
     } else {
       speakInstruction("Pheri prayas garnuhos, euta sano golo banunus.");
     }
  }
};