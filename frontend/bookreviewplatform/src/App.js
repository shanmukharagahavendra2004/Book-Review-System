import React from 'react';
import './App.css';
import Home from './components/Home';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import BookDetails from './components/BookDetails';
function App() {
  return (
    <div className="App">
      <BrowserRouter>     
        <Home /> 
        <Routes>       
          <Route path='/signin' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/bookform' element={<BookForm/>}/>
          <Route path='/booklist' element={<BookList/>}/>
           <Route path="/reviewform/:bookId" element={<ReviewForm />} /> {/* ✅ Add this */}
        <Route path='reviewlist' element={<ReviewList/>}/>
      <Route path='bookdetails/:id' element={<BookDetails />} />
      <Route path="/bookform/:id" element={<BookForm />} />

        </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
