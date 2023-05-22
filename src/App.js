import TextEditor from './components/TextEditor';
import {BrowserRouter,Routes,Route, redirect, Navigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/document/${uuidv4()}`} replace />}></Route>
        <Route path="/document/:id" element={<TextEditor/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
