
import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import './ImagePicker.css'
import { Box, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
export default function GalleryPicker({Gallery,SetGallery,SelectedPictures}) {
  const [maxImages, setMaxImages] = React.useState([]);
  const [maxMessage, setMaxMessage] = React.useState("");
  function onPickImagesWithLimit(maxImages) {
    SelectedPictures.current=maxImages
    setMaxImages(maxImages);
  }

  function onPickMaxImages(lastImage) {
    let image = JSON.stringify(lastImage);
    let maxMessage = `Max images reached. ${image}`;
    
    setMaxMessage(maxMessage);
  }

  const itemsPerPage = 12;
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const startIndex = (page-1)* itemsPerPage;
  const endIndex = ((startIndex) + itemsPerPage);
  return (
    <div>
      <ImagePicker
        images={Gallery.slice(startIndex, endIndex).map((image) => ({ src: image.resourceURL, value: image.id }))}
        onPick={onPickImagesWithLimit}
        maxPicks={2}
        onMaxPicks={onPickMaxImages}
        multiple
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Pagination count={Math.ceil(Gallery.length / itemsPerPage)} page={page} color="primary" onChange={handleChangePage} />
       
      </Box>
    </div>

  );
}
