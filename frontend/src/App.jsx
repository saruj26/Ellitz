import React, { useState } from 'react'
// import "./components/Customer/Header.css"; 
import "./components/Company/CompanyApp.css"; 
import "./components/Company/CompanyProduct.css"; 
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom'; // Ensure Router is imported
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Dashboard } from './components/Dashboard'
// import Header from './components/Customer/Header'
// import { Sidebar } from './components/Customer/Sidebar'
import CompanyHeader from './components/Company/CompanyHeader';
import CompanySidebar from './components/Company/CompanySidebar';
import AddProduct from './components/Company/AddProduct';
import UpdateProduct from './components/Company/UpdateProduct';
import ViewProducts from './components/Company/ViewProducts';

function App() {
  const [sidebarToggle,setSidebarToggle]=useState(false)
  
  
  return (
    <Router>
            <div className="">
                <CompanyHeader />
                <CompanySidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
                <main className={`content ${sidebarToggle ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Routes>
                        <Route exact path="/" element={<AddProduct />} /> {/* Example of a Route component */}
                        <Route exact path="/add-product" element={<AddProduct />} />
                        <Route exact path="/display-product" element={<ViewProducts />} />
                         <Route exact path="/update/:id" element={<UpdateProduct />} />
          
                         </Routes>
                </main>
            </div>
    
        
      </Router>
);
  

}

export default App;

// {/* <div>
//           <header>
//             {/* Add your header component if needed */}
//             </header>
//             <div className="container">
//               <Routes>
//                 <Route path="/edit/:id" component={ProductEdit} />
//                 <Route path="/" component={ProductList} />
//               </Routes>
//             </div>
//           </div> */}