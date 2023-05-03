
import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import './ImageDeleter.css'
import { Box, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
export default function GalleryPicker({Gallery,SetSelectedAssets}) {
  function onPickImagesWithLimit(maxImages) {
    let ListOfSelectedImages=[]

    maxImages.map((Image)=>{

      Gallery.map((im)=>{

        if(im.value==Image.value)
        {
          ListOfSelectedImages=[...ListOfSelectedImages,im]
        }
      })
    })
    SetSelectedAssets(ListOfSelectedImages)
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
        images={Gallery.slice(startIndex, endIndex).map((image,index) => ({ src: image.src, value: image.value}))}
        onPick={onPickImagesWithLimit}
        multiple
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Pagination count={Math.ceil(Gallery.length / itemsPerPage)} page={page} color="primary" onChange={handleChangePage} />
       
      </Box>
    </div>

  );
}
