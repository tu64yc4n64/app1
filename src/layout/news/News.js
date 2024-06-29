import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchData } from '../../api/api.js'; // API çağrı fonksiyonlarını import ediyoruz
import Icon from '../../components/icon/Icon';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './style.css'; // CSS dosyasını da import ediyoruz


const News = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    // Konum değiştiğinde arama inputunu temizle
    setQuery('');
  }, [location]);

  const handleInputChange = async (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    if (searchQuery.length > 2) {
      try {
        const data = await fetchData(`/search/api/search/?q=${searchQuery}`);

        const allResults = [
          ...data.people.map(person => ({ ...person, type: 'person' })),
          ...data.companies.map(company => ({ ...company, type: 'company' })),
          ...data.products.map(product => ({ ...product, type: 'product' })),
          ...data.offers.map(offer => ({ ...offer, type: 'offer' }))
        ];
        setResults(allResults);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Search endpoint not found:', error);
        } else {
          console.error('Search error:', error);
        }
      }
    } else {
      setResults([]);
    }
  };



  const handleResultClick = (result) => {
    setResults([]);
    setQuery(''); // Arama inputunu temizle
    switch (result.type) {
      case 'person':
        navigate(`/kisi-detay/${result.id}`);
        break;
      case 'company':
        navigate(`/sirket-detay/${result.id}`);
        break;
      case 'product':
        navigate(`/urun-detay/${result.id}`);
        break;
      case 'offer':
        navigate(`/teklif-detay/${result.id}`);
        break;
      default:
        console.error('Unknown result type');
    }
  };

  return (
    <div className="nk-news-list" ref={searchRef}>
      <div className="nk-chat-aside-search" style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
        <div className="form-group mb-0">
          <div className="form-control-wrap">
            <div className="form-icon form-icon-left">
              <Icon name="search"></Icon>
            </div>
            <input
              type="text"
              className="form-round form-control"
              id="default-03"
              placeholder="Kişi, ürün, fatura, teklif..."
              value={query}
              onChange={handleInputChange}
              style={{ width: '100%', maxWidth: '500px' }} // Arama inputunun genişliğini burada ayarlayabilirsiniz
            />
          </div>
        </div>
        {results.length > 0 && (
          <div className="search-results">
            <TransitionGroup component="ul">
              {results.map(result => (
                <CSSTransition key={result.id} timeout={300} classNames="fade">
                  <li onClick={() => handleResultClick(result)}>
                    <span>
                      {result.type === 'person' && `${result.first_name} ${result.last_name}`}
                      {result.type === 'company' && result.name}
                      {result.type === 'product' && result.name}
                      {result.type === 'offer' && result.title}
                    </span>
                    <span className="category">
                      {result.type === 'person' && 'Kişi'}
                      {result.type === 'company' && 'Firma'}
                      {result.type === 'product' && 'Ürün'}
                      {result.type === 'offer' && 'Teklif'}
                    </span>
                  </li>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
