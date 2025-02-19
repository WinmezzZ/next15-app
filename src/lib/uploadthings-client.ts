import { OurFileRouter } from "@/app/api/uploadting/core";
import {
    generateReactHelpers,
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
  
  export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();
  
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();