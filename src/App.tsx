import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import './styles.css';

function App() {
  return (
    <Router basename="/cs409_mp2">
      <div className="App">
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/details/:name" element={<DetailView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
