import React, { useState, useEffect } from 'react';
// import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import fetchImages from './api';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [hasMoreImages, setHasMoreImages] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;

    const loadImages = async () => {
      setIsLoading(true);

      try {
        const { images: newImages, totalHits } = await fetchImages(
          searchQuery,
          currentPage
        );
        setImages(prevImages => [...prevImages, ...newImages]);
        setIsLoading(false);
        setHasMoreImages(currentPage < Math.ceil(totalHits / 12));
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = query => {
    setSearchQuery(query);
    setCurrentPage(1);
    setImages([]);
    setHasMoreImages(true);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openModal = imageURL => {
    setShowModal(true);
    setLargeImageURL(imageURL);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={openModal} />
      {isLoading && <Loader />}
      {images.length > 0 && hasMoreImages && !isLoading && (
        <Button onLoadMore={handleLoadMore} />
      )}
      {showModal && <Modal image={largeImageURL} onClose={closeModal} />}
    </div>
  );
};

export default App;

// class App extends Component {
//   state = {
//     images: [],
//     currentPage: 1,
//     searchQuery: '',
//     isLoading: false,
//     showModal: false,
//     largeImageURL: '',
//     hasMoreImages: true,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       prevState.searchQuery !== this.state.searchQuery ||
//       prevState.currentPage !== this.state.currentPage
//     ) {
//       this.loadImages();
//     }
//   }

//   loadImages = async () => {
//     this.setState({ isLoading: true });

//     try {
//       const { images, totalHits } = await fetchImages(
//         this.state.searchQuery,
//         this.state.currentPage
//       );
//       this.setState(prevState => ({
//         images: [...prevState.images, ...images],
//         isLoading: false,
//         hasMoreImages: this.state.currentPage < Math.ceil(totalHits / 12),
//       }));
//     } catch (error) {
//       this.setState({ isLoading: false });
//     }
//   };

//   handleSearchSubmit = query => {
//     this.setState({
//       searchQuery: query,
//       currentPage: 1,
//       images: [],
//       hasMoreImages: true,
//     });
//   };

//   handleLoadMore = () => {
//     this.setState(prevState => ({
//       currentPage: prevState.currentPage + 1,
//     }));
//   };

//   openModal = imageURL => {
//     this.setState({
//       showModal: true,
//       largeImageURL: imageURL,
//     });
//   };

//   closeModal = () => {
//     this.setState({
//       showModal: false,
//       largeImageURL: '',
//     });
//   };

//   render() {
//     const { images, isLoading, showModal, largeImageURL, hasMoreImages } =
//       this.state;

//     return (
//       <div className="App">
//         <Searchbar onSubmit={this.handleSearchSubmit} />
//         <ImageGallery images={images} onImageClick={this.openModal} />
//         {isLoading && <Loader />}
//         {images.length > 0 && hasMoreImages && !isLoading && (
//           <Button onLoadMore={this.handleLoadMore} />
//         )}
//         {showModal && <Modal image={largeImageURL} onClose={this.closeModal} />}
//       </div>
//     );
//   }
// }

// export default App;
