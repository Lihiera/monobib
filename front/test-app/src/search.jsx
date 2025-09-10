import '../styles/global.css';

import { Header, Footer } from "./components/layout";
import SearchContent from './components/searchContent';

function Search() {
    return (
        <>
            <Header />
            <SearchContent />
            <Footer />
        </>
    )
}

export default Search;