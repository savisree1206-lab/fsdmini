import React, { useState } from 'react';
import { Plane, Building2, Search, Star, Clock, Calendar } from 'lucide-react';
import './SearchTab.css';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Goa', 'Hyderabad', 'Kolkata', 'Manali', 'Jaipur', 'Kochi'];

const MOCK_FLIGHTS = [
  { id:1,  from:'Mumbai',    to:'Delhi',     airline:'IndiGo',   dep:'06:00', arr:'08:15', dur:'2h 15m', price:4500,  cls:'Economy',  stops:0 },
  { id:2,  from:'Mumbai',    to:'Delhi',     airline:'Air India', dep:'10:30', arr:'12:45', dur:'2h 15m', price:5200,  cls:'Economy',  stops:0 },
  { id:3,  from:'Mumbai',    to:'Bangalore', airline:'SpiceJet',  dep:'07:00', arr:'08:30', dur:'1h 30m', price:3800,  cls:'Economy',  stops:0 },
  { id:4,  from:'Mumbai',    to:'Goa',       airline:'GoAir',     dep:'06:30', arr:'07:45', dur:'1h 15m', price:3500,  cls:'Economy',  stops:0 },
  { id:5,  from:'Delhi',     to:'Goa',       airline:'GoAir',     dep:'14:00', arr:'16:30', dur:'2h 30m', price:5600,  cls:'Economy',  stops:0 },
  { id:6,  from:'Delhi',     to:'Mumbai',    airline:'Vistara',   dep:'08:00', arr:'10:15', dur:'2h 15m', price:12000, cls:'Business', stops:0 },
  { id:7,  from:'Delhi',     to:'Mumbai',    airline:'IndiGo',    dep:'14:30', arr:'16:45', dur:'2h 15m', price:4800,  cls:'Economy',  stops:0 },
  { id:8,  from:'Delhi',     to:'Kolkata',   airline:'Air India', dep:'09:00', arr:'11:10', dur:'2h 10m', price:5400,  cls:'Economy',  stops:0 },
  { id:9,  from:'Chennai',   to:'Hyderabad', airline:'IndiGo',    dep:'11:00', arr:'12:10', dur:'1h 10m', price:3200,  cls:'Economy',  stops:0 },
  { id:10, from:'Bangalore', to:'Kolkata',   airline:'Air India', dep:'09:00', arr:'11:30', dur:'2h 30m', price:5800,  cls:'Economy',  stops:1 },
  { id:11, from:'Hyderabad', to:'Goa',       airline:'SpiceJet',  dep:'15:30', arr:'17:00', dur:'1h 30m', price:4100,  cls:'Economy',  stops:0 },
  { id:12, from:'Kolkata',   to:'Delhi',     airline:'Vistara',   dep:'07:30', arr:'10:00', dur:'2h 30m', price:8500,  cls:'Business', stops:0 },
  { id:13, from:'Goa',       to:'Mumbai',    airline:'GoAir',     dep:'19:00', arr:'20:15', dur:'1h 15m', price:3900,  cls:'Economy',  stops:0 },
  { id:14, from:'Kochi',     to:'Delhi',     airline:'IndiGo',    dep:'05:45', arr:'08:45', dur:'3h 00m', price:6200,  cls:'Economy',  stops:1 },
  { id:15, from:'Jaipur',    to:'Mumbai',    airline:'SpiceJet',  dep:'08:30', arr:'10:30', dur:'2h 00m', price:4300,  cls:'Economy',  stops:0 },
];

const AIRLINE_COLOR = {
  'IndiGo': '#6366f1', 'Air India': '#ef4444',
  'SpiceJet': '#f59e0b', 'Vistara': '#8b5cf6',
  'GoAir': '#06b6d4',
};

const MOCK_HOTELS = [
  { id:1,  name:'The Taj Mahal Palace',  city:'Mumbai',    stars:5, price:25000, rating:4.9, amenities:['Pool','Spa','Restaurant','WiFi'],         img:'https://picsum.photos/id/164/400/260' },
  { id:2,  name:'ITC Grand Chola',       city:'Chennai',   stars:5, price:18000, rating:4.8, amenities:['Pool','Gym','Restaurant','WiFi'],          img:'https://picsum.photos/id/28/400/260'  },
  { id:3,  name:'The Oberoi',            city:'Delhi',     stars:5, price:22000, rating:4.9, amenities:['Pool','Spa','Restaurant','Bar'],            img:'https://picsum.photos/id/42/400/260'  },
  { id:4,  name:'Lemon Tree Hotel',      city:'Bangalore', stars:3, price:4500,  rating:4.2, amenities:['Restaurant','WiFi','Gym'],                  img:'https://picsum.photos/id/65/400/260'  },
  { id:5,  name:'Marriott Beach Resort', city:'Goa',       stars:5, price:15000, rating:4.8, amenities:['Beach','Pool','Restaurant','Bar'],           img:'https://picsum.photos/id/76/400/260'  },
  { id:6,  name:'Hyatt Regency',         city:'Hyderabad', stars:5, price:14000, rating:4.7, amenities:['Pool','Spa','Restaurant','WiFi'],           img:'https://picsum.photos/id/106/400/260' },
  { id:7,  name:'Radisson Blu',          city:'Kolkata',   stars:4, price:8000,  rating:4.4, amenities:['Pool','Restaurant','WiFi','Gym'],            img:'https://picsum.photos/id/119/400/260' },
  { id:8,  name:'Club Mahindra Resort',  city:'Manali',    stars:4, price:9500,  rating:4.5, amenities:['Mountain View','Restaurant','Bonfire','WiFi'],img:'https://picsum.photos/id/137/400/260' },
  { id:9,  name:'Fortune Select',        city:'Mumbai',    stars:4, price:7500,  rating:4.3, amenities:['Restaurant','WiFi','Gym','Bar'],             img:'https://picsum.photos/id/175/400/260' },
  { id:10, name:'Trident Hotel',         city:'Delhi',     stars:5, price:12000, rating:4.6, amenities:['Pool','Spa','Restaurant','WiFi'],           img:'https://picsum.photos/id/188/400/260' },
  { id:11, name:'Holiday Inn',           city:'Jaipur',    stars:4, price:6000,  rating:4.3, amenities:['Pool','Restaurant','WiFi'],                  img:'https://picsum.photos/id/209/400/260' },
  { id:12, name:'Casino Hotel',          city:'Kochi',     stars:5, price:10000, rating:4.5, amenities:['Pool','Spa','Casino','Restaurant'],          img:'https://picsum.photos/id/225/400/260' },
];

const MOCK_PACKAGES = [
  { id:1,  name:'Santorini, Greece',       img:'https://picsum.photos/id/1047/600/400', price:95000,  duration:'5 Days', tag:'Popular',   rating:4.8, includes:['Hotel','Flights','Guided Tour','Meals'] },
  { id:2,  name:'Bali, Indonesia',          img:'https://picsum.photos/id/1015/600/400', price:70000,  duration:'7 Days', tag:'Trending',  rating:4.9, includes:['Hotel','Transfers','Activities','Breakfast'] },
  { id:3,  name:'Kyoto, Japan',             img:'https://picsum.photos/id/1043/600/400', price:125000, duration:'6 Days', tag:'Cultural',  rating:4.7, includes:['Hotel','Flights','Cultural Tours','Meals'] },
  { id:4,  name:'Amalfi Coast, Italy',      img:'https://picsum.photos/id/1040/600/400', price:175000, duration:'4 Days', tag:'Luxury',    rating:4.9, includes:['5-Star Hotel','Flights','Private Tour','All Meals'] },
  { id:5,  name:'Swiss Alps, Switzerland',  img:'https://picsum.photos/id/1036/600/400', price:145000, duration:'5 Days', tag:'Adventure', rating:4.8, includes:['Hotel','Flights','Adventure Activities','Breakfast'] },
  { id:6,  name:'Maldives',                 img:'https://picsum.photos/id/1055/600/400', price:205000, duration:'7 Days', tag:'Romantic',  rating:5.0, includes:['Overwater Villa','Flights','All Inclusive'] },
  { id:7,  name:'Kerala Backwaters, India', img:'https://picsum.photos/id/1060/600/400', price:35000,  duration:'4 Days', tag:'Cultural',  rating:4.6, includes:['Houseboat Stay','Meals','Transfers'] },
  { id:8,  name:'Rajasthan Heritage Tour',  img:'https://picsum.photos/id/1062/600/400', price:48000,  duration:'6 Days', tag:'Cultural',  rating:4.5, includes:['Heritage Hotel','Guided Tour','Meals','Transfers'] },
  { id:9,  name:'Goa Beach Holiday',        img:'https://picsum.photos/id/1057/600/400', price:28000,  duration:'3 Days', tag:'Popular',   rating:4.4, includes:['Beach Resort','Transfers','Breakfast'] },
  { id:10, name:'Himachal Adventure',       img:'https://picsum.photos/id/1064/600/400', price:42000,  duration:'5 Days', tag:'Adventure', rating:4.7, includes:['Hotel','Transfers','Trekking','Meals'] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const Stars = ({ n }) => (
  <span className="st-stars">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={11} fill={i < n ? '#f59e0b' : 'none'} color={i < n ? '#f59e0b' : '#475569'} />
    ))}
  </span>
);

// ── Reusable flight result card ───────────────────────────────────────────────
const FlightCard = ({ f, passengers, similar }) => (
  <div className={`st-flight-card ${similar ? 'st-similar' : ''}`}>
    <div className="st-airline-dot" style={{ background: AIRLINE_COLOR[f.airline] || '#6366f1' }} />
    <div className="st-flight-airline">{f.airline}</div>
    <div className="st-flight-route">
      <div className="st-city">
        <span className="st-time">{f.dep}</span>
        <span className="st-city-name">{f.from}</span>
      </div>
      <div className="st-flight-mid">
        <span className="st-dur"><Clock size={11} /> {f.dur}</span>
        <div className="st-line"><span /><Plane size={12} /><span /></div>
        <span className="st-stops">{f.stops === 0 ? 'Non-stop' : `${f.stops} stop`}</span>
      </div>
      <div className="st-city" style={{ textAlign: 'right' }}>
        <span className="st-time">{f.arr}</span>
        <span className="st-city-name">{f.to}</span>
      </div>
    </div>
    <div className="st-flight-right">
      <span className="st-cls-badge">{f.cls}</span>
      <div className="st-price">&#x20B9;{(f.price * passengers).toLocaleString('en-IN')}</div>
      <span className="st-per">{passengers > 1 ? `for ${passengers} pax` : 'per person'}</span>
    </div>
  </div>
);

// ── Reusable hotel result card ────────────────────────────────────────────────
const HotelCard = ({ h, rooms, nights, similar, onBook }) => (
  <div className={`st-hotel-card ${similar ? 'st-similar' : ''}`}>
    <div className="st-hotel-img-wrap">
      <img src={h.img} alt={h.name} />
      <div className="st-rating-badge"><Star size={11} fill="#f59e0b" color="#f59e0b" /> {h.rating}</div>
    </div>
    <div className="st-hotel-body">
      <div className="st-hotel-name">{h.name}</div>
      <div className="st-hotel-city"><Building2 size={12} /> {h.city} &nbsp;·&nbsp; <Stars n={h.stars} /></div>
      <div className="st-amenities">
        {h.amenities.map(a => <span key={a} className="st-amenity">{a}</span>)}
      </div>
      <div className="st-hotel-footer">
        <div>
          <span className="st-price">&#x20B9;{(h.price * rooms * nights).toLocaleString('en-IN')}</span>
          <span className="st-per">{nights > 1 ? `/ ${nights} nights` : '/ night'}{rooms > 1 ? `, ${rooms} rooms` : ''}</span>
        </div>
        <button className="st-book-btn" onClick={() => onBook && onBook(h)}>Book Hotel</button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const SearchTab = ({ onBookHotel }) => {
  const [type, setType] = useState('flights');

  // ── Flight state ──────────────────────────────────────────────────────────
  const [fFrom, setFFrom]         = useState('');
  const [fTo, setFTo]             = useState('');
  const [fDate, setFDate]         = useState('');
  const [fPassengers, setFPass]   = useState(1);
  const [fClass, setFClass]       = useState('any');
  const [fResults, setFResults]   = useState(null);

  const searchFlights = () => {
    // Score each flight: +2 for from match, +2 for to match, +1 for class match
    const scored = MOCK_FLIGHTS.map(f => {
      let score = 0;
      if (fFrom && f.from.toLowerCase() === fFrom.toLowerCase()) score += 2;
      if (fTo   && f.to.toLowerCase()   === fTo.toLowerCase())   score += 2;
      if (fClass !== 'any' && f.cls.toLowerCase() === fClass)    score += 1;
      // Partial match (same origin OR same destination)
      if (fFrom && f.from.toLowerCase() !== fFrom.toLowerCase() && score === 0) score = 0;
      return { ...f, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const hasGoodMatch = scored.some(s => s.score >= 2);
    const noFilters    = !fFrom && !fTo && fClass === 'any';

    let bestMatches = [], similarFlights = [];

    if (noFilters) {
      // Show all flights when no filter applied
      bestMatches = scored;
    } else if (hasGoodMatch) {
      bestMatches    = scored.filter(s => s.score >= 2);
      similarFlights = scored.filter(s => s.score < 2)
                             .sort(() => Math.random() - 0.5)
                             .slice(0, 5);
    } else {
      // No exact match — show top random flights as "similar"
      similarFlights = [...MOCK_FLIGHTS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(f => ({ ...f, score: 0 }));
    }

    setFResults({ bestMatches, similarFlights, noFilters });
  };

  // ── Hotel state ───────────────────────────────────────────────────────────
  const [hCity, setHCity]         = useState('');
  const [hCheckIn, setHCheckIn]   = useState('');
  const [hCheckOut, setHCheckOut] = useState('');
  const [hRooms, setHRooms]       = useState(1);
  const [hStars, setHStars]       = useState('any');
  const [hMaxPrice, setHMaxPrice] = useState('any');
  const [hResults, setHResults]   = useState(null);

  const searchHotels = () => {
    const maxPrice = hMaxPrice !== 'any' ? parseInt(hMaxPrice) : Infinity;
    const starsNum  = hStars   !== 'any' ? parseInt(hStars)    : null;

    const scored = MOCK_HOTELS.map(h => {
      let score = 0;
      if (hCity && h.city.toLowerCase() === hCity.toLowerCase()) score += 3;
      if (starsNum !== null && h.stars === starsNum)              score += 2;
      if (h.price <= maxPrice)                                    score += 1;
      return { ...h, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const noFilters    = !hCity && hStars === 'any' && hMaxPrice === 'any';
    const hasGoodMatch = scored.some(s => s.score >= 3);

    let bestMatches = [], similarHotels = [];

    if (noFilters) {
      bestMatches = scored;
    } else if (hasGoodMatch) {
      bestMatches   = scored.filter(s => s.score >= 3);
      similarHotels = scored.filter(s => s.score < 3)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 4);
    } else {
      // No city match — show random hotels as suggestions
      similarHotels = [...MOCK_HOTELS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(h => ({ ...h, score: 0 }));
    }

    setHResults({ bestMatches, similarHotels, noFilters });
  };

  // ── Package state ─────────────────────────────────────────────────────────
  const [pQuery, setPQuery]       = useState('');
  const [pTag, setPTag]           = useState('All');
  const [pDuration, setPDuration] = useState('any');
  const [pBudget, setPBudget]     = useState('any');
  const [pResults, setPResults]   = useState(null);

  const searchPackages = () => {
    let res = [...MOCK_PACKAGES];
    if (pQuery) res = res.filter(p => p.name.toLowerCase().includes(pQuery.toLowerCase()));
    if (pTag !== 'All') res = res.filter(p => p.tag === pTag);
    if (pDuration !== 'any') {
      if (pDuration === 'short')  res = res.filter(p => parseInt(p.duration) <= 4);
      if (pDuration === 'medium') res = res.filter(p => parseInt(p.duration) >= 5 && parseInt(p.duration) <= 6);
      if (pDuration === 'long')   res = res.filter(p => parseInt(p.duration) >= 7);
    }
    if (pBudget !== 'any') {
      if (pBudget === '50k')  res = res.filter(p => p.price <= 50000);
      if (pBudget === '100k') res = res.filter(p => p.price <= 100000);
      if (pBudget === '150k') res = res.filter(p => p.price <= 150000);
      if (pBudget === '150k+') res = res.filter(p => p.price > 150000);
    }
    setPResults(res);
  };

  const pkgTags = ['All', 'Popular', 'Trending', 'Cultural', 'Luxury', 'Adventure', 'Romantic'];

  return (
    <div className="st-root">
      {/* ── Type tabs ───────────────────────────────────────────────────── */}
      <div className="st-type-bar">
        <button className={`st-type-btn ${type === 'flights'  ? 'active' : ''}`} onClick={() => setType('flights')}>
          <Plane size={17} /> Flights
        </button>
        <button className={`st-type-btn ${type === 'hotels'   ? 'active' : ''}`} onClick={() => setType('hotels')}>
          <Building2 size={17} /> Hotels
        </button>
      </div>

      {/* ══════════════════════ FLIGHTS ══════════════════════════════════ */}
      {type === 'flights' && (
        <div className="animate-fade-in">
          <div className="st-form-card">
            <div className="st-form-grid">
              <div className="st-field">
                <label>From</label>
                <select value={fFrom} onChange={e => setFFrom(e.target.value)}>
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="st-field">
                <label>To</label>
                <select value={fTo} onChange={e => setFTo(e.target.value)}>
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="st-field">
                <label>Departure Date</label>
                <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} />
              </div>
              <div className="st-field">
                <label>Passengers</label>
                <div className="st-counter">
                  <button onClick={() => setFPass(Math.max(1, fPassengers - 1))}>−</button>
                  <span>{fPassengers}</span>
                  <button onClick={() => setFPass(Math.min(9, fPassengers + 1))}>+</button>
                </div>
              </div>
              <div className="st-field">
                <label>Class</label>
                <select value={fClass} onChange={e => setFClass(e.target.value)}>
                  <option value="any">Any Class</option>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <button className="st-search-btn" onClick={searchFlights}>
              <Search size={16} /> Search Flights
            </button>
          </div>

          {fResults !== null && (
            <div className="st-results">
              {fResults.noFilters ? (
                <>
                  <p className="st-result-count">{fResults.bestMatches.length} flights available</p>
                  {fResults.bestMatches.map(f => <FlightCard key={f.id} f={f} passengers={fPassengers} />)}
                </>
              ) : (
                <>
                  {fResults.bestMatches.length > 0 && (
                    <>
                      <p className="st-result-count">{fResults.bestMatches.length} matching flight{fResults.bestMatches.length !== 1 ? 's' : ''} found</p>
                      {fResults.bestMatches.map(f => <FlightCard key={f.id} f={f} passengers={fPassengers} />)}
                    </>
                  )}
                  {fResults.similarFlights.length > 0 && (
                    <>
                      <p className="st-section-label">✈ Similar Flights You Might Like</p>
                      {fResults.similarFlights.map(f => <FlightCard key={f.id} f={f} passengers={fPassengers} similar />)}
                    </>
                  )}
                  {fResults.bestMatches.length === 0 && fResults.similarFlights.length === 0 && (
                    <div className="st-empty">No flights found. Try different cities.</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ HOTELS ═══════════════════════════════════ */}
      {type === 'hotels' && (
        <div className="animate-fade-in">
          <div className="st-form-card">
            <div className="st-form-grid">
              <div className="st-field">
                <label>City</label>
                <select value={hCity} onChange={e => setHCity(e.target.value)}>
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="st-field">
                <label>Check-in</label>
                <input type="date" value={hCheckIn} onChange={e => setHCheckIn(e.target.value)} />
              </div>
              <div className="st-field">
                <label>Check-out</label>
                <input type="date" value={hCheckOut} onChange={e => setHCheckOut(e.target.value)} />
              </div>
              <div className="st-field">
                <label>Rooms</label>
                <div className="st-counter">
                  <button onClick={() => setHRooms(Math.max(1, hRooms - 1))}>−</button>
                  <span>{hRooms}</span>
                  <button onClick={() => setHRooms(Math.min(10, hRooms + 1))}>+</button>
                </div>
              </div>
              <div className="st-field">
                <label>Star Rating</label>
                <select value={hStars} onChange={e => setHStars(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Star</option>
                  <option value="4">⭐⭐⭐⭐ 4 Star</option>
                  <option value="3">⭐⭐⭐ 3 Star</option>
                </select>
              </div>
              <div className="st-field">
                <label>Max Price / Night</label>
                <select value={hMaxPrice} onChange={e => setHMaxPrice(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="5000">Under ₹5,000</option>
                  <option value="10000">Under ₹10,000</option>
                  <option value="15000">Under ₹15,000</option>
                  <option value="25000">Under ₹25,000</option>
                </select>
              </div>
            </div>
            <button className="st-search-btn" onClick={searchHotels}>
              <Search size={16} /> Search Hotels
            </button>
          </div>

          {hResults !== null && (() => {
            const nights = (hCheckIn && hCheckOut)
              ? Math.max(1, Math.ceil((new Date(hCheckOut) - new Date(hCheckIn)) / 86400000))
              : 1;
            return (
              <div className="st-results">
                {hResults.noFilters ? (
                  <>
                    <p className="st-result-count">{hResults.bestMatches.length} hotels available</p>
                    <div className="st-hotel-grid">
                      {hResults.bestMatches.map(h => <HotelCard key={h.id} h={h} rooms={hRooms} nights={nights} onBook={h => onBookHotel && onBookHotel(h, hCheckIn, hCheckOut, hRooms)} />)}
                    </div>
                  </>
                ) : (
                  <>
                    {hResults.bestMatches.length > 0 && (
                      <>
                        <p className="st-result-count">{hResults.bestMatches.length} matching hotel{hResults.bestMatches.length !== 1 ? 's' : ''} found</p>
                        <div className="st-hotel-grid">
                          {hResults.bestMatches.map(h => <HotelCard key={h.id} h={h} rooms={hRooms} nights={nights} onBook={h => onBookHotel && onBookHotel(h, hCheckIn, hCheckOut, hRooms)} />)}
                        </div>
                      </>
                    )}
                    {hResults.similarHotels.length > 0 && (
                      <>
                        <p className="st-section-label">🏨 Similar Hotels You Might Like</p>
                        <div className="st-hotel-grid">
                          {hResults.similarHotels.map(h => <HotelCard key={h.id} h={h} rooms={hRooms} nights={nights} similar onBook={h => onBookHotel && onBookHotel(h, hCheckIn, hCheckOut, hRooms)} />)}
                        </div>
                      </>
                    )}
                    {hResults.bestMatches.length === 0 && hResults.similarHotels.length === 0 && (
                      <div className="st-empty">No hotels found. Try a different city or budget.</div>
                    )}
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SearchTab;

