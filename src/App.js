import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Admin from './components/Admin';
import CreateProduct from './components/CreateProduct';
import CreateCategory from './components/CreateCategory';
import DeleteCategory from './components/DeleteCategory';
import DeleteProduct from './components/DeleteProduct';
import UpdateProduct from './components/UpdateProduct';
import Login from './components/Login';
import SignUp from './components/Signup';
import Home from './components/Home';
import ProductsByCategory from './components/ShowProductsByCategory';
import Error404 from './components/Error404';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/products-by-category/:id' exact element={<ProductsByCategory />} />
        <Route path='/admin' exact element={<Admin />} />
        <Route path='/create-new-product' exact element={<CreateProduct />} />
        <Route path='/create-new-category' exact element={<CreateCategory />} />
        <Route path='/delete-category' exact element={<DeleteCategory />} />
        <Route path='/delete-product' exact element={<DeleteProduct />} />
        <Route path='/update-product/:id' exact element={<UpdateProduct />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/signup' exact element={<SignUp />} />
        <Route path='*' exact element={<Error404/>}/>

      </Routes>
    </Router>
  )
}

export default App;
