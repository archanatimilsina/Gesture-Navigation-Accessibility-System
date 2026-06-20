import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App.jsx'
import Page1 from './components/Page1.jsx'
import Page2 from './components/Page2.jsx'
import Page3 from './components/Page3.jsx'
import Page4 from './components/Page4.jsx'
import Page5 from './components/Page5.jsx'
import DrawingCanvas from './components/PracticeDrawing.jsx'
import PracticeDrawing2 from './components/PracticeDrawing2.jsx'
import GestureNavigator from './components/GestureNavigator.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter basename='/'>
  <GestureNavigator />
  <Routes>
<Route index element={<App />}/>
<Route path="page1" element={<Page1 />}/>
<Route path="page2" element={<Page2 />}/>
<Route path="page3" element={<Page3 />}/>
<Route path="page4" element={<Page4 />}/>
<Route path="page5" element={<Page5 />}/>
<Route path="draw" element={<DrawingCanvas />}/>
<Route path="draw2" element={<PracticeDrawing2 />}/>
  </Routes>
  </BrowserRouter>
  </StrictMode>,
)
