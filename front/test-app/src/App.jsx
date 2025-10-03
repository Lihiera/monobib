
import { Header, Footer } from "./components/layout";
import SearchContent from './components/searchContent.jsx';
import Main from './components/main'
import Result from './components/result'
import { Route, Routes } from "react-router-dom";



function App() {
    return (
        <>
            <Header />
            <div className="mainContent">
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/search" element={<SearchContent />} />
                <Route path="/result" element={<Result />} />
            </Routes>
            <Footer />
            </div>
        </>
    )
}

export default App;