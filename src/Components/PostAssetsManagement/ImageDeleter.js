
import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import { Box, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import * as variables from "../../variables/variables"
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
//-------------------NOTE! This useeffect is responsible for showing the tags little icon when an image is tagged--------------------//
  React.useEffect(()=>{
    //Getting the images
    let AssetsDivs=document.getElementsByClassName("responsive") 
    for(let i=0;i<AssetsDivs.length;i++)
    {
      let currentimagesrc=""
      let ImageisTagged=false
      let TaggedImageAssetID=""
      let TaggedImageID=""
      //Deleting old tags if they exist
      const originalDiv = AssetsDivs[i];     
      for(let j=0;j<originalDiv.children.length;j++)
      {
           
        if(originalDiv.children[j].className=="thumbnail")
        {
          currentimagesrc=originalDiv.children[j].getAttribute("src");
        }

        if(originalDiv.children[j].className=="tagged")
        {
          originalDiv.children[j].remove()
        }
      }

      // here we get the ID attribute we secretly passed in the src url
      const urlParams = new URLSearchParams(currentimagesrc);
      TaggedImageID = urlParams.get('id');      
      //determine if the image is tagged or not
      variables.PostGlobalVariables.POST_AssetsTags.map((taggedimage)=>{

        if(taggedimage.Id==TaggedImageID)
        {
          ImageisTagged=true
        }

      })
          //If the image is tagged we add the icon
      if(ImageisTagged)
      {
        // Create a new div element
        const newDiv = document.createElement("div");    
        // Set the style of the new div to match the original div
        newDiv.className="tagged"
        // Add the new div to the parent element
        originalDiv.appendChild(newDiv)
      }
     
    }
  })

  return (
    <div>
      <ImagePicker
        images={Gallery.slice(startIndex, endIndex).map((image,index) => ({ src: image.src+"&id="+image.value, value: image.value,}))}
        onPick={onPickImagesWithLimit}
        multiple
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Pagination count={Math.ceil(Gallery.length / itemsPerPage)} page={page} color="primary" onChange={handleChangePage} />
       
      </Box>
    </div>

  );
}
